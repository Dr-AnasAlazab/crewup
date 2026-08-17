/** @format */

import React from "react";
import Link from "next/link";
import type { Project } from "@/types";
import { Calendar, MapPin } from "lucide-react";

export default function ProjectList({ projects }: { projects: Project[] }) {
  return (
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
                    <span className="text-xs text-slate-400 font-mono line-clamp-1 max-w-30">
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
  );
}
