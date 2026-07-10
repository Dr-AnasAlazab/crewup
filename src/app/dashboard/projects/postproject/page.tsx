/** @format */
"use server";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import PostProjectForm from "@/src/components/PostProjectForm";
import SidebarCards from "@/src/components/SidebarCards";
import { serverSupabase } from "@/src/lib/supabase/server";
import { createPost, getTrades } from "@/src/actions/dataActions";

//todo the drop box the ui error boundaries and anything need refining
export default async function PostProjectPage() {
  const trades = await getTrades();
  console.log("Trades fetched from database:", trades);
  // const [currentStep, setCurrentStep] = useState(1);

  // const handleNext = (formData: FormData) => {
  //   // In a real app: save formData to state/context/server and advance step

  //   createPost(formData); // Call the server action to create the post
  //   console.log("Step 1 data:", Object.fromEntries(formData.entries()));
  //   // setCurrentStep(2);
  //   // router.push('/dashboard/projects/new/scope') — for multi-page steps
  // };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Top nav bar ─────────────────────────────────────── */}
      <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-3">
          {/* Bell */}
          <button className="relative text-slate-500 hover:text-slate-800 transition-colors">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User */}
          <div className="flex items-center gap-2.5 text-sm font-medium text-slate-700">
            <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs font-bold">
              JC
            </div>
            <span>John Contractor</span>
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Page heading ─────────────────────────────────────── */}
      <div className="px-8 pt-7 pb-5">
        <h1 className="text-2xl font-bold text-slate-900">Post a Project</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tell us about your project and get proposals from qualified
          subcontractors.
        </p>
      </div>

      {/* ── Two-column workspace ─────────────────────────────── */}
      <div className="px-8 pb-12 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* Left — main form card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
          <PostProjectForm trades={trades} />
        </div>

        {/* Right — sidebar helper cards */}
        <SidebarCards />
      </div>
    </div>
  );
  1;
}
