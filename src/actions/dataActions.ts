/** @format */
"use server";

import { redirect } from "next/navigation";
import { serverSupabase } from "../lib/supabase/server";
import {
  SubcontractorUI,
  type ConversationUI,
  type FindContractorsPageParams,
  type GetSubcontractorsResponse,
  type MessageUI,
} from "@/types";

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
  return (
    data?.map((row) => {
      return row.trade;
    }) || []
  );
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

export async function getSubcontractors(
  params: FindContractorsPageParams,
): Promise<GetSubcontractorsResponse> {
  const supabase = await serverSupabase();
  console.log("Params.page", params.page);
  const page = Number(params.page ?? 1);
  const pageSize = Number(params.pageSize ?? 5);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .eq("role", "subcontractor");

  if (params.search) {
    query = query.or(
      `company_name.ilike.%${params.search}%,location.ilike.%${params.search}%`,
    );
  }

  if (params.licensed) query = query.eq("is_licensed", true);
  if (params.insured) query = query.eq("is_insured", true);
  if (params.bonded) query = query.eq("is_bonded", true);
  if (params.availableNow) query = query.eq("available_now", true);
  if (params.availableForUpcomingProjects)
    query = query.eq("available_upcoming", true);

  if (params.location?.trim()) {
    query = query.ilike("location", `%${params.location.trim()}%`);
  }

  if (params.rating) {
    const minmum = Number(params.rating);
    if (!isNaN(minmum)) {
      query = query.gte("rating", minmum);
    }
  }

  if (params.yearsInBusiness) {
    const ranges: Record<string, { gte?: number; lte?: number }> = {
      "1-3": { gte: 1, lte: 3 },
      "3-5": { gte: 3, lte: 5 },
      "5-10": { gte: 5, lte: 10 },
      "10+": { gte: 10 },
    };
    const range = ranges[params.yearsInBusiness];
    if (range) {
      if (range.gte !== undefined)
        query = query.gte("years_in_business", range.gte);
      if (range.lte !== undefined)
        query = query.lte("years_in_business", range.lte);
    }
  }

  if (params.page) {
    query = query.range(from, to);
  }
  // ── NOW execute the query ──────────────────────────

  const { data, error, count } = await query;

  if (error) {
    console.error("[getSubcontractors]", error.message);
    return {
      contractors: [],
      totalCount: 0,
    };
  }

  return {
    contractors: data ?? [],
    totalCount: count ?? 0,
  };
}

// export async function getSubcontractors(
//   params: FindContractorsPageParams,
// ): Promise<SubcontractorUI[]> {
//   const supabase = await serverSupabase();

//   const { data: profiles, error } = await supabase
//     .from("profiles")
//     .select("*")
//     .eq("role", "subcontractor");

//   if (error) {
//     console.error("Error fetching subcontractors:", error);
//     return [];
//   }

//   // Map over the results and inject the UI-required mock data
//   return profiles.map((profile) => ({
//     ...profile,
//     // Provide fallbacks for UI consistency if DB fields are null
//     company_name:
//       profile.company_name || profile.full_name || "Unknown Company",
//     bio:
//       profile.bio ||
//       "Specializing in residential and commercial projects with a focus on quality.",
//     location: profile.location || "Dallas, TX",

//     // Injected mock data for missing UI fields
//     trades:
//       profile.trades ||
//       ["Concrete", "Framing", "Electrical"]
//         .sort(() => 0.5 - Math.random())
//         .slice(0, 2),
//     is_licensed:
//       profile.is_licensed !== undefined
//         ? profile.is_licensed
//         : Math.random() > 0.1, // 90% chance to be true
//     is_insured:
//       profile.is_insured !== undefined
//         ? profile.is_insured
//         : Math.random() > 0.1,
//     rating:
//       profile.rating !== undefined
//         ? profile.rating
//         : Number((Math.random() * (5.0 - 4.0) + 4.0).toFixed(1)), // Ratings between 4.0 and 5.0
//     review_count:
//       profile.review_count !== undefined
//         ? profile.review_count
//         : Math.floor(Math.random() * 50) + 5,
//     portfolio_images: profile.portfolio_images || [
//       "https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=150&h=100",
//       "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=150&h=100",
//       "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=150&h=100",
//     ],
//   }));
// }

/**
 * Fetches all conversations for the authenticated user, complete with
 * participant details, latest message, and unread calculations based on last_read_at.
 */
export async function getConversations(
  userId: string,
): Promise<ConversationUI[]> {
  const supabase = await serverSupabase();

  // 1. Fetch conversation entries where the current user is a participant
  const { data, error } = await supabase
    .from("conversation_participants")
    .select(
      `
      last_read_at,
      conversation:conversations (
        id,
        updated_at,
        last_message_at,
        last_message:messages!conversations_last_message_fkey (
          id,
          content,
          created_at,
          sender_id
        ),
        participants:conversation_participants (
          user_id,
          profile:profiles!conversation_participants_user_id_fkey (
            id,
            full_name,
            avatar_url
          )
        )
      )
    `,
    )
    .eq("user_id", userId);

  if (error) {
    console.error("[getConversations] Error:", error.message);
    return [];
  }

  if (!data) return [];

  // 2. Transform DB payload into UI model
  console.log("messages", data);
  const conversations: ConversationUI[] = data
    .filter((row) => row.conversation !== null)
    .map((row) => {
      const conv = row.conversation as any;
      const userLastReadAt = row.last_read_at
        ? new Date(row.last_read_at)
        : new Date(0);

      // Identify the other participant in the conversation
      const otherParticipantObj = conv.participants?.find(
        (p: any) => p.user_id !== userId,
      );
      const otherProfile = otherParticipantObj?.profile || {};

      // Split full_name safely into first_name and last_name for the UI contract
      const fullName = otherProfile.full_name || "Unknown User";
      const nameParts = fullName.trim().split(" ");
      const firstName = nameParts[0] || "Unknown";
      const lastName = nameParts.slice(1).join(" ") || "";

      // Determine unread status from last_read_at vs latest message timestamp
      const latestMessage = conv.last_message;
      let unreadCount = 0;

      if (latestMessage && latestMessage.sender_id !== userId) {
        const lastMsgTime = new Date(latestMessage.created_at);
        if (lastMsgTime > userLastReadAt) {
          unreadCount = 1; // Flag as unread if latest message arrived after last_read_at
        }
      }

      return {
        id: conv.id,
        participant: {
          id: otherProfile.id || "unknown",
          first_name: firstName,
          last_name: lastName,
          company_name: null,
          avatar_url: otherProfile.avatar_url || null,
        },
        latest_message: latestMessage
          ? {
              text: latestMessage.content,
              created_at: latestMessage.created_at,
              sender_id: latestMessage.sender_id,
            }
          : null,
        unread_count: unreadCount,
        updated_at: conv.last_message_at || conv.updated_at,
      };
    });

  // Sort by latest activity descending
  return conversations.sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  );
}

/**
 * Fetches messages for a given conversation and updates the user's `last_read_at` timestamp.
 */
export async function getMessages(
  conversationId: string,
  userId?: string,
): Promise<MessageUI[]> {
  const supabase = await serverSupabase();

  // 1. Fetch active messages (ignoring soft-deleted rows)
  const { data, error } = await supabase
    .from("messages")
    .select(
      `
      id,
      conversation_id,
      sender_id,
      content,
      file_url,
      file_name,
      file_size,
      created_at,
      sender:profiles!messages_sender_id_fkey (
        id,
        full_name,
        avatar_url
      )
    `,
    )
    .eq("conversation_id", conversationId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true })
    .limit(50);

  if (error) {
    console.error("[getMessages] Error:", error.message);
    return [];
  }

  // 2. Update user's `last_read_at` pointer upon loading messages
  if (userId) {
    await supabase
      .from("conversation_participants")
      .update({ last_read_at: new Date().toISOString() })
      .match({ conversation_id: conversationId, user_id: userId });
  }

  // 3. Transform to MessageUI structure
  return (data || []).map((msg: any) => {
    const fullName = msg.sender?.full_name || "Unknown";
    const nameParts = fullName.trim().split(" ");

    return {
      id: msg.id,
      conversation_id: msg.conversation_id,
      sender_id: msg.sender_id,
      text: msg.content,
      created_at: msg.created_at,
      is_read: true,
      sender: {
        id: msg.sender?.id || msg.sender_id,
        first_name: nameParts[0] || "Unknown",
        last_name: nameParts.slice(1).join(" ") || "",
        company_name: null,
        avatar_url: msg.sender?.avatar_url || null,
      },
      attachments: msg.file_url
        ? [
            {
              id: msg.id,
              file_name: msg.file_name || "Attachment",
              file_size: msg.file_size || 0,
              file_url: msg.file_url,
              file_type: msg.file_name?.split(".").pop() || "file",
            },
          ]
        : [],
    };
  });
}

/**
 * Sends a message, handles file attachments stored on the row,
 * updates the parent conversation metadata, and updates sender's read pointer.
 */
export async function sendMessage(formData: FormData) {
  const supabase = await serverSupabase();

  const conversationId = formData.get("conversationId") as string;
  const senderId = formData.get("senderId") as string;
  const content = formData.get("content") as string | null;
  const fileUrl = formData.get("fileUrl") as string | null;
  const fileName = formData.get("fileName") as string | null;
  const fileSize = formData.get("fileSize")
    ? Number(formData.get("fileSize"))
    : null;

  if (!conversationId || !senderId || (!content && !fileUrl)) {
    throw new Error("Missing required message fields");
  }

  // 1. Insert new message
  const { data: newMessage, error: msgError } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content: content || null,
      file_url: fileUrl || null,
      file_name: fileName || null,
      file_size: fileSize || null,
    })
    .select("id, created_at")
    .single();

  if (msgError) {
    console.error("[sendMessage] Error inserting message:", msgError.message);
    throw new Error(msgError.message);
  }

  // 2. Cascade update pointers on the parent conversation
  const now = newMessage.created_at;

  const { error: convError } = await supabase
    .from("conversations")
    .update({
      last_message_id: newMessage.id,
      last_message_at: now,
      updated_at: now,
    })
    .eq("id", conversationId);

  if (convError) {
    console.error(
      "[sendMessage] Error updating conversation pointer:",
      convError.message,
    );
  }

  // 3. Mark message as read for the sender
  await supabase
    .from("conversation_participants")
    .update({ last_read_at: now })
    .match({ conversation_id: conversationId, user_id: senderId });

  return { success: true, messageId: newMessage.id };
}

interface AttachmentUploadProps {
  file: File;
  conversationId: string;
}

interface AttachmentResult {
  fileUrl: string;
  fileName: string;
  fileSize: number;
}

export const chattAttachments = async ({
  file,
  conversationId,
}: AttachmentUploadProps): Promise<AttachmentResult> => {
  const supabase = await serverSupabase();
  const fileExt = file.name.split(".").pop();
  const filePath = `${conversationId}/${Date.now()}.${fileExt}`;

  // 1. Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("chat-attachments")
    .upload(filePath, file);

  if (uploadError) {
    throw new Error(`File upload failed: ${uploadError.message}`);
  }

  // 2. Get the public URL
  const { data: publicUrlData } = supabase.storage
    .from("chat-attachments")
    .getPublicUrl(uploadData.path);

  // 3. Return the exact object TypeScript is expecting in MessageInput.tsx
  return {
    fileUrl: publicUrlData.publicUrl,
    fileName: file.name,
    fileSize: file.size,
  };
};
