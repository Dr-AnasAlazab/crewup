/** @format */
"use client";

import { SubcontractorUI, Project } from "@/types";
import { CheckCircle2 } from "lucide-react";

export default function OverviewTab({
  profile,
  projects,
}: {
  profile: SubcontractorUI;
  projects: Project[];
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          About My Business
        </h3>
        <p className="text-slate-600 text-[15px] leading-relaxed mb-6 whitespace-pre-line">
          {profile.bio || "No description provided."}
        </p>
        <button className="text-blue-600 border border-blue-200 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          View Full Profile
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">Services</h3>
          <button className="text-blue-600 text-sm font-medium hover:underline">
            Manage
          </button>
        </div>
        <ul className="space-y-3">
          {profile.trades?.map((trade, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 text-slate-700 text-sm font-medium"
            >
              <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
              {trade}
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-900">Recent Projects</h3>
          <button className="text-blue-600 text-sm font-medium hover:underline">
            View All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((proj) => {
            // Support for your Supabase Proposals Count Shape
            const count = proj.proposals?.[0]?.count || 0;

            return (
              <div
                key={proj.id}
                className="flex gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group cursor-pointer"
              >
                <div className="w-24 h-16 rounded-md bg-slate-200 shrink-0 overflow-hidden">
                  {proj.image_url && (
                    <img
                      src={proj.image_url}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {proj.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {proj.location} • ${(proj.budget_max || 0).toLocaleString()}
                  </p>

                  <div className="flex items-center gap-2 mt-1.5">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full
                      ${proj.status === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}
                    `}
                    >
                      {proj.status === "completed"
                        ? "Completed"
                        : "In Progress"}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {count} Proposals
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
