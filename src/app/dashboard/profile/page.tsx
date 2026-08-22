/** @format */

import { getProfile, getProjects } from "@/src/actions/dataActions";
import ProfileClient from "../../../components/ProfileClient";
import { serverSupabase } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await serverSupabase();

  // 1. Fetch Auth User
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const currentUserId = user?.id;

  if (!currentUserId) {
    redirect("/login");
  }

  // 2. Fetch data in parallel
  // Passing empty string to your searchParams logic
  const [profile, projects] = await Promise.all([
    getProfile(currentUserId),
    getProjects({ searchParams: "" }),
  ]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your business profile and account settings.
          </p>
        </div>

        {/* Pass server-fetched data for client hydration */}
        <ProfileClient initialProfile={profile} initialProjects={projects} />
      </div>
    </main>
  );
}
