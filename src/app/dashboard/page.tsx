/** @format */
import { serverSupabase } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";
import TopBar from "@/src/components/TopBar";
import StatCards from "@/src/components/StatCards";
import RecentProjects from "@/src/components/RecentProjects";
import MessagesList from "@/src/components/MessagesList";
import RecommendedContractors from "@/src/components/RecommendedContractors";
import SavedContractors from "@/src/components/SavedContractors";

export default async function DashboardPage() {
  const supabase = await serverSupabase();

  // Get logged-in user
  const { data: authData } = await supabase.auth.getClaims();
  if (!authData?.claims) redirect("/sign-in");

  const userId = authData.claims.sub;

  // Fetch all dashboard data in parallel
  const [
    { data: profile },
    { data: projects },
    // { data: messages },
    { data: recommendedContractors },
    { data: savedItems },
  ] = await Promise.all([
    // Current user's profile
    supabase
      .from("profiles")
      .select("full_name, company_name, avatar_url")
      .eq("id", userId)
      .single(),

    // 3 most recent projects owned by this contractor
    supabase
      .from("projects")
      .select(
        `
        id,
        title,
        location,
        image_url,
        status,
        created_at,
        project_trades(trade),
        proposals(count)
      `,
      )
      .eq("owner_id", userId)
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(3),

    // 3 most recent messages involving this user
    // supabase
    //   .from("messages")
    //   .select(
    //     `
    //     id,
    //     content,
    //     created_at,
    //     is_read,
    //     sender_id,
    //     profiles!sender_id(full_name, avatar_url)
    //   `,
    //   )
    //   .neq("sender_id", userId)
    //   .order("created_at", { ascending: false })
    //   .limit(3),

    // Recommended subcontractors (highest rated)
    supabase
      .from("profiles")
      .select("id, full_name, company_name, average_rating, avatar_url")
      .eq("role", "subcontractor")
      .order("average_rating", { ascending: false })
      .limit(3),

    // Saved contractors
    supabase
      .from("saved_items")
      .select(
        `
        item_id,
        profiles!item_id(id, full_name, company_name, average_rating, avatar_url)
      `,
      )
      .eq("user_id", userId)
      .eq("item_type", "contractor")
      .limit(4),
  ]);

  // Shape the data for components
  const shapedProjects = (projects ?? []).map((p: any) => ({
    id: p.id,
    title: p.title,
    location: p.location ?? "",
    trades: (p.project_trades ?? []).map((t: any) => t.trade),
    proposals_count: p.proposals?.[0]?.count ?? 0,
    created_at: p.created_at,
    image_url: p.image_url ?? "",
    status: p.status,
  }));

  // const shapedMessages = (messages ?? []).map((m: any) => ({
  //   id: m.id,
  //   sender_name: m.profiles?.full_name ?? "Unknown",
  //   content: m.content ?? "",
  //   time_ago: formatTimeAgo(m.created_at),
  //   is_unread: !m.is_read,
  //   avatar_url: m.profiles?.avatar_url ?? null,
  // }));

  const shapedRecommended = (recommendedContractors ?? []).map((c: any) => ({
    id: c.id,
    name: c.company_name ?? c.full_name,
    trades: "", // populated from profile_trades in a real query
    rating: c.average_rating ?? 0,
    avatar_url: c.avatar_url ?? null,
  }));

  const shapedSaved = (savedItems ?? []).map((s: any) => ({
    id: s.profiles?.id ?? s.item_id,
    name: s.profiles?.company_name ?? s.profiles?.full_name ?? "Unknown",
    trade: "",
    rating: s.profiles?.average_rating ?? 0,
    avatar_url: s.profiles?.avatar_url ?? null,
  }));

  return (
    <div className="pb-12">
      <TopBar userName={profile?.full_name ?? "John Contractor"} />

      <StatCards />

      {/* Main 2-column grid */}
      <div className="px-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        {/* Left column */}
        <div className="flex flex-col gap-4">
          <RecentProjects projects={shapedProjects} />
          <SavedContractors contractors={shapedSaved} />
        </div>

        {/* Right column */}
        <div className="flex flex-col">
          {/* <MessagesList messages={shapedMessages} /> */}
          <RecommendedContractors contractors={shapedRecommended} />
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
