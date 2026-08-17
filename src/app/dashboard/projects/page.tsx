/** @format */
import Link from "next/link";
import { Plus, ChevronDown } from "lucide-react";
import { getProjects } from "@/src/actions/dataActions";
import type { Project } from "@/types";
import Searchbar from "@/src/components/Searchbar";
import ProjectList from "@/src/components/ProjectList";

export default async function GlobalProjectsPage({
  searchParams,
}: {
  // 1. Update the type to a Promise since you are on Next.js 16
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  // 2. Await the searchParams promise to extract the plain object
  const resolvedParams = await searchParams;
  const currentSearchTerm = resolvedParams.search || "";

  // 3. Pass the string clean into your backend function
  const projects: Project[] = await getProjects({
    searchParams: currentSearchTerm,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Page Header ── */}
      <div className="px-8 pt-7 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your active construction pipelines and track incoming
            subcontractor proposals.
          </p>
        </div>

        <Link
          href="/dashboard/projects/postproject"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-5 py-3 rounded-xl shadow-sm transition-colors self-start md:self-auto"
        >
          <Plus size={18} />
          Post a Project
        </Link>
      </div>

      {/* ── Status Tabs Filter ── */}
      <div className="px-8 border-b border-slate-200 bg-white pt-2">
        <div className="flex gap-6 text-sm font-semibold text-slate-500">
          <button className="border-b-2 border-blue-600 pb-3 text-blue-600">
            All Projects ({projects.length})
          </button>
          <button className="pb-3 hover:text-slate-800">Open / Bidding</button>
          <button className="pb-3 hover:text-slate-800">In Progress</button>
          <button className="pb-3 hover:text-slate-800">Completed</button>
        </div>
      </div>

      {/* ── Two-Column Workspace ── */}
      <div className="p-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* LEFT COLUMN: Search, Filters & Project Feed */}
        <div className="flex flex-col gap-5">
          <Searchbar />
          <ProjectList projects={projects} />
        </div>

        {/* RIGHT COLUMN: Side Analytics View */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              Global Pipeline
            </h3>
            <div className="flex items-center justify-between gap-4">
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    className="text-slate-100"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-600"
                    strokeDasharray="45, 100"
                    strokeWidth="3"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-xl font-bold text-slate-800">45%</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    Done
                  </span>
                </div>
              </div>
              <ul className="flex-1 text-xs font-medium text-slate-600 flex flex-col gap-2">
                <li className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Completed
                  </span>
                  <span className="font-bold text-slate-800">2</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    In Progress
                  </span>
                  <span className="font-bold text-slate-800">6</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
