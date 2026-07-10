/** @format */
"use server";

import { redirect } from "next/navigation";
import { serverSupabase } from "../lib/supabase/server";

// Simple helper to safely turn human dates like "Apr 15, 2024" into "2024-04-15"

const supabase = await serverSupabase();

function convertToISODate(dateStr: string): string | null {
  const timestamp = Date.parse(dateStr);
  if (isNaN(timestamp)) return null; // Fallback if parsing fails (e.g., "ASAP")
  return new Date(timestamp).toISOString().split("T")[0];
}

export async function createPost(formData: FormData) {
  const supabase = await serverSupabase();

  // 1. Authenticate user
  const { data: authData } = await supabase.auth.getClaims();
  if (!authData?.claims) {
    redirect("/sign-in");
  }
  const userId = authData.claims.sub;

  // 2. Extract standard string values from form parameters
  const title = formData.get("title") as string;
  const location = formData.get("location") as string;
  const project_type = formData.get("project_type") as string;
  const description = formData.get("description") as string;

  // Fix 1: Handle trades array serialization into a single text string
  const tradesArray = formData.getAll("trades") as string[];
  const tradesString = tradesArray.length > 0 ? tradesArray.join(", ") : null;

  // Fix 2: Extract and parse budget numbers safely
  const budgetMinRaw = formData.get("budget_min") as string; // Reads "$34,566"
  const budgetMaxRaw = formData.get("budget_max") as string; // Reads "$34,556"

  // 2. Strip out "$" and "," using regex, then convert to a clean number
  const budget_min = budgetMinRaw
    ? parseFloat(budgetMinRaw.replace(/[$,]/g, ""))
    : null; // Converts to 34566
  const budget_max = budgetMaxRaw
    ? parseFloat(budgetMaxRaw.replace(/[$,]/g, ""))
    : null; // Converts to 34556

  // Fix 3: Extract, split, and format timelines to valid Postgres dates (YYYY-MM-DD)
  // const timeline = formData.get("timeline") as string;
  const timelineStart = formData.get("timeline_start") as string | null;
  const timelineEnd = formData.get("timeline_end") as string | null;

  // if (timeline && timeline.includes(" - ")) {
  //   const dates = timeline.split(" - ");
  //   timelineStart = convertToISODate(dates[0].trim());
  //   timelineEnd = convertToISODate(dates[1].trim());
  // }

  // Basic validation check before touching production database
  if (!title || !location || !project_type) {
    throw new Error("Missing required form fields.");
  }

  try {
    // 3. Insert into public.projects
    const { data, error } = await supabase.from("projects").insert([
      {
        owner_id: userId,
        title,
        location,
        project_type,
        description,
        budget_min,
        budget_max,
        timeline_start: timelineStart, // Now clean 'YYYY-MM-DD' or null
        timeline_end: timelineEnd, // Now clean 'YYYY-MM-DD' or null
        trades: tradesString, // Now joined as a clean comma-separated text string
        status: "open", // Matches your status check constraint defaults
      },
    ]);

    if (error) {
      console.error("Database Insert Error:", error.message);
      throw new Error(`Database rejected operation: ${error.message}`);
    }
  } catch (err) {
    console.error("Server Action Exception:", err);
    throw new Error("Something went wrong while creating the project.");
  }

  // 4. Safe Redirect outside try/catch block bounds
  redirect(`/dashboard/projects`);
}

export async function getTrades() {
  const supabase = await serverSupabase();
  const { data, error } = await supabase.from("project_trades").select("*");
  if (error) {
    console.error("Database Error:", error.message);
    throw new Error(`Database error: ${error.message}`);
  }
  return data?.map((row) => row.trade) || [];
}

export async function getProjects() {
  const supabase = await serverSupabase();

  // Fetch all projects AND their respective proposal counts together
  const { data, error } = await supabase.from("projects").select(`
      *,
      proposals:proposals(count)
    `);

  if (error) {
    console.error("Database Error:", error.message);
    throw new Error(`Database error: ${error.message}`);
  }

  // Map the data so your frontend gets a clean 'proposalsCount' integer automatically
  return data.map((project) => ({
    ...project,
    proposalsCount: project.proposals?.[0]?.count || 0,
  }));
}

export async function getProposalsByProjectId(projectId: string) {
  const { data, error } = await supabase
    .from("proposals")
    .select("*")
    .eq("project_id", projectId);
  if (error) {
    console.error("Database Error:", error.message);
    throw new Error(`Database error: ${error.message}`);
  }
  return data;
}
