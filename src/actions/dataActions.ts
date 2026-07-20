/** @format */
"use server";

import { redirect } from "next/navigation";
import { serverSupabase } from "../lib/supabase/server";
import { SubcontractorUI } from "@/types";

// Simple helper to safely turn human dates like "Apr 15, 2024" into "2024-04-15"
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

  // Strip out "$" and "," using regex, then convert to a clean number
  const budget_min = budgetMinRaw
    ? parseFloat(budgetMinRaw.replace(/[$,]/g, ""))
    : null; // Converts to 34566
  const budget_max = budgetMaxRaw
    ? parseFloat(budgetMaxRaw.replace(/[$,]/g, ""))
    : null; // Converts to 34556

  const timelineStart = formData.get("timeline_start") as string | null;
  const timelineEnd = formData.get("timeline_end") as string | null;

  // Basic validation check before touching production database
  if (!title || !location || !project_type) {
    throw new Error("Missing required form fields.");
  }

  try {
    // 3. Insert into public.projects
    const { error } = await supabase.from("projects").insert([
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

export async function getProjects({ searchParams }: { searchParams: string }) {
  const supabase = await serverSupabase();

  // Fetch all projects AND their respective proposal counts together
  let query = supabase.from("projects").select(`
      *,
      proposals:proposals(count)
    `);

  // 2. Conditionally apply the case-insensitive substring search filters
  if (searchParams) {
    query = query.or(
      `title.ilike.%${searchParams}%,location.ilike.%${searchParams}%`,
    );
  }
  console.log("Supabase Query Result:", searchParams);

  // 3. Execute the query ONCE at the end
  const { data, error } = await query;

  if (error) {
    console.error("Database Error:", error.message);
    throw new Error(`Database error: ${error.message}`);
  }

  // Map the data so your frontend gets a clean 'proposalsCount' integer automatically
  return (data || []).map((project) => ({
    ...project,
    proposalsCount: project.proposals?.[0]?.count || 0,
  }));
}

export async function getProposalsByProjectId(projectId: string) {
  // Fix: Safe local instantiation
  const supabase = await serverSupabase();

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

export async function getProjectById(id: string) {
  // Fix: Safe local instantiation
  const supabase = await serverSupabase();

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
      *,
      proposals:proposals(count)
    `,
    )
    .eq("id", id)
    .single(); // Tells Supabase to return exactly 1 object instead of an array

  console.log("Supabase Query Result for Project ID:", id, data);
  if (error) {
    console.error("Error fetching project:", error.message);
    return null;
  }

  if (!data) return null;

  // Flatten the proposals structure just like we did in the search page
  return {
    ...data,
    proposalsCount: data.proposals?.[0]?.count || 0,
  };
}

// Assuming standard Supabase client initialization. Adjust if using @supabase/ssr

export async function getSubcontractors(): Promise<SubcontractorUI[]> {
  const supabase = await serverSupabase();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "subcontractor");

  if (error) {
    console.error("Error fetching subcontractors:", error);
    return [];
  }

  // Map over the results and inject the UI-required mock data
  return profiles.map((profile) => ({
    ...profile,
    // Provide fallbacks for UI consistency if DB fields are null
    company_name:
      profile.company_name || profile.full_name || "Unknown Company",
    bio:
      profile.bio ||
      "Specializing in residential and commercial projects with a focus on quality.",
    location: profile.location || "Dallas, TX",

    // Injected mock data for missing UI fields
    trades:
      profile.trades ||
      ["Concrete", "Framing", "Electrical"]
        .sort(() => 0.5 - Math.random())
        .slice(0, 2),
    is_licensed:
      profile.is_licensed !== undefined
        ? profile.is_licensed
        : Math.random() > 0.1, // 90% chance to be true
    is_insured:
      profile.is_insured !== undefined
        ? profile.is_insured
        : Math.random() > 0.1,
    rating:
      profile.rating !== undefined
        ? profile.rating
        : Number((Math.random() * (5.0 - 4.0) + 4.0).toFixed(1)), // Ratings between 4.0 and 5.0
    review_count:
      profile.review_count !== undefined
        ? profile.review_count
        : Math.floor(Math.random() * 50) + 5,
    portfolio_images: profile.portfolio_images || [
      "https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=150&h=100",
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=150&h=100",
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=150&h=100",
    ],
  }));
}
