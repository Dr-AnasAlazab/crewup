/** @format */
import Link from "next/link";
import {
  Plus,
  Search,
  SlidersHorizontal,
  MapPin,
  Calendar,
  ChevronDown,
} from "lucide-react";
import { getProjects } from "@/src/actions/dataActions";
import type { Project } from "@/types";

export default async function GlobalProjectsPage() {
  // 1. Fetch real relational data from your Supabase server action
  const projects: Project[] = await getProjects();

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
          {/* Search & Filter Bar Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
            <div className="relative w-full flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Search by project name, ID, or location..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
              />
            </div>

            {/* <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <button className="flex items-center gap-1.5 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-medium bg-white text-slate-600 hover:border-slate-300">
                Type <ChevronDown size={14} />
              </button>
              <button className="flex items-center gap-1.5 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-medium bg-white text-slate-600 hover:border-slate-300">
                Location <ChevronDown size={14} />
              </button>
              <button className="flex items-center gap-1.5 border border-slate-200 px-3 py-2.5 rounded-xl text-sm font-medium bg-white text-slate-600 hover:border-slate-300">
                <SlidersHorizontal size={14} /> More
              </button>
            </div> */}
          </div>

          {/* Project List / Feed Stack */}
          <div className="flex flex-col gap-4">
            {projects.map((project: Project) => {
              // 2. Extract and format the count right here inside the loop scope
              const currentProposalsCount = project.proposals?.[0]?.count || 0;

              return (
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  key={project.id}
                  className="group block bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-blue-400 hover:shadow-md transition-all"
                >
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    {/* Project Image Aspect */}
                    <img
                      src={
                        project.image_url ||
                        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&h=120&q=80"
                      }
                      alt={project.title}
                      className="w-full sm:w-36 h-24 object-cover rounded-xl bg-slate-100 border border-slate-100 shrink-0"
                    />

                    {/* Main Details */}
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {project.title}
                          </h3>
                          <span className="text-xs text-slate-400 font-mono line-clamp-1 max-w-[120px]">
                            #{project.id.slice(0, 8)}...
                          </span>
                        </div>

                        {/* Dynamic Badging Status */}
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                            project.status === "open"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {project.status || "open"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                        <MapPin size={14} />{" "}
                        {project.location || "No location specified"}
                        <span className="text-slate-300 mx-1">|</span>
                        <Calendar size={14} />{" "}
                        {project.timeline_start
                          ? `${project.timeline_start} - ${project.timeline_end}`
                          : "No dates set"}
                      </div>

                      {/* Meta Row Info Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100 text-xs">
                        <div>
                          <p className="text-slate-400 mb-0.5">Project Type</p>
                          <p className="font-semibold text-slate-800 capitalize">
                            {project.project_type || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400 mb-0.5">Budget</p>
                          <p className="font-semibold text-slate-800">
                            {project.budget_min
                              ? `$${project.budget_min.toLocaleString()} - $${project.budget_max?.toLocaleString()}`
                              : "TBD"}
                          </p>
                        </div>

                        {/* ── Dynamic Counter Fix ── */}
                        <div>
                          <p className="text-slate-400 mb-0.5">Proposals</p>
                          <p className="font-semibold text-blue-600">
                            {currentProposalsCount} Received
                          </p>
                        </div>

                        <div className="flex flex-col justify-end">
                          <p className="text-slate-400 mb-1 flex justify-between">
                            <span>Progress</span>
                            <span className="font-bold text-slate-700">
                              {project.progress || 0}%
                            </span>
                          </p>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${project.progress || 0}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
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
