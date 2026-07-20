/** @format */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  MapPin,
  Calendar,
  Edit2,
  ChevronDown,
  Check,
  Globe,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
} from "lucide-react";
import type { Project } from "@/types";

interface ProjectDetailsClientProps {
  project: Project;
}

type TabType =
  | "overview"
  | "proposals"
  | "messages"
  | "files"
  | "activity"
  | "team";

export default function ProjectDetailsClient({
  project,
}: ProjectDetailsClientProps) {
  // Set the default tab state to 'overview'
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const currentProposalsCount = project.proposals?.[0]?.count || 0;

  return (
    <div className="min-h-screen bg-white">
      {/* ── 1. Top Navigation & Global Header ── */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-200">
        <Link
          href="/dashboard/projects"
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>

        <div className="flex items-center gap-6">
          <button className="relative text-slate-500 hover:text-slate-700 transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </button>
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-medium text-slate-700 hidden sm:block">
              {project.owner_id ? "Project Owner" : "Guest"}
            </span>
            <ChevronDown size={16} className="text-slate-400" />
          </div>
        </div>
      </header>

      {/* ── Main Layout Grid ── */}
      <main className="p-8 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-8">
          {/* ── 2. Project Overview Card ── */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-full md:w-48 h-32 shrink-0 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={
                    project.image_url ||
                    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600&h=400"
                  }
                  alt="Project Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {project.title}
                  </h1>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-md capitalize">
                    {project.status || "open"}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={16} />
                    {project.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={16} />
                    {project.timeline_start} - {project.timeline_end}
                  </span>
                </div>

                <p className="text-sm text-slate-600 line-clamp-2">
                  {project.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2.5 rounded-lg transition-colors">
                  <Edit2 size={16} />
                  Edit Project
                </button>
                <button className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-sm px-4 py-2.5 rounded-lg transition-colors">
                  More Actions
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-500 mb-1">Project Type</p>
                <p className="font-semibold text-slate-900">
                  {project.project_type || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Budget</p>
                <p className="font-semibold text-slate-900">
                  ${project.budget_min?.toLocaleString() || "N/A"} - $
                  {project.budget_max?.toLocaleString() || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Proposals</p>
                <p className="font-semibold text-slate-900">
                  {currentProposalsCount} Received
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Created By</p>
                <p className="font-semibold text-slate-900">
                  {project.owner_id ? "Owner" : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* ── 3. Interactive Tabs Navigation ── */}
          <div className="flex gap-8 border-b border-slate-200 overflow-x-auto overflow-y-hidden">
            {[
              { id: "overview", label: "Overview" },
              {
                id: "proposals",
                label: `Proposals (${currentProposalsCount})`,
              },
              { id: "messages", label: "Messages" },
              { id: "files", label: "Files (5)" },
              { id: "activity", label: "Activity" },
              { id: "team", label: "Team" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`pb-3 font-semibold text-sm whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600 font-bold"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── 4. Dynamic Tab Content View ── */}
          {activeTab === "overview" && (
            <>
              {/* Detailed Sub-Grid */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Section */}
                <div className="flex flex-col gap-6">
                  <h3 className="font-bold text-slate-900">Project Details</h3>

                  <div className="grid grid-cols-[120px_1fr] gap-4 text-sm">
                    <div className="text-slate-500 font-medium">Timeline</div>
                    <div className="text-slate-900 font-medium">
                      {project.timeline_start} - {project.timeline_end}
                    </div>

                    <div className="text-slate-500 font-medium">
                      Budget Range
                    </div>
                    <div className="text-slate-900 font-medium">
                      ${project.budget_min?.toLocaleString() || "N/A"} - $
                      {project.budget_max?.toLocaleString() || "N/A"}
                    </div>

                    <div className="text-slate-500 font-medium pt-1">
                      Trade Needed
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.trades ? (
                        project.trades.split(",").map((trade) => {
                          const trimmedTrade = trade.trim();
                          return (
                            <span
                              key={trimmedTrade}
                              className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md"
                            >
                              {trimmedTrade}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-slate-400 text-xs">
                          No trades specified
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">
                      Project Description
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {project.description}
                    </p>
                  </div>
                </div>

                {/* Right Section / Progress Tracker */}
                <div className="flex flex-col gap-6">
                  <h3 className="font-bold text-slate-900">Project Status</h3>

                  <div className="relative flex justify-between pt-2 mb-4">
                    <div className="absolute top-6 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
                    <div className="flex flex-col items-center gap-2 relative bg-white px-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-blue-600">
                          Posted
                        </p>
                        <p className="text-[10px] text-slate-500">
                          Apr 10, 2024
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 relative bg-white px-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 text-sm font-bold">
                        2
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-blue-600">
                          Proposals
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {currentProposalsCount} Received
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 relative bg-white px-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 text-sm font-bold">
                        3
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-slate-500">
                          Under Review
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2 relative bg-white px-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 text-sm font-bold">
                        4
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-slate-500">
                          Hired
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-[120px_1fr] gap-4 text-sm mt-2">
                    <div className="text-slate-500 font-medium">Visibility</div>
                    <div className="flex items-center gap-1.5 text-slate-900 font-medium">
                      <Globe size={14} className="text-slate-400" />
                      Public
                    </div>
                    <div className="text-slate-500 font-medium">Project ID</div>
                    <div className="text-slate-900 font-medium">
                      #{project.id.slice(0, 13).toUpperCase()}
                    </div>
                    <div className="text-slate-500 font-medium">
                      Last Updated
                    </div>
                    <div className="text-slate-900 font-medium">
                      Apr 10, 2024 at 2:30 PM
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Rack Component */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">
                    Project Documents (5)
                  </h3>
                  <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                    View All
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3 hover:scale-[1.02] transition-transform cursor-pointer bg-white">
                    <FileText size={28} className="text-red-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 truncate">
                        Plans_OfficeBuildout.pdf
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        2.4 MB • PDF
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2">
                        Uploaded Apr 10, 2024
                      </p>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3 hover:scale-[1.02] transition-transform cursor-pointer bg-white">
                    <ImageIcon size={28} className="text-blue-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 truncate">
                        Floor_Plan.dwg
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        4.8 MB • DWG
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2">
                        Uploaded Apr 10, 2024
                      </p>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3 hover:scale-[1.02] transition-transform cursor-pointer bg-white">
                    <FileSpreadsheet size={28} className="text-emerald-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 truncate">
                        Scope_of_Work.xlsx
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        28 KB • XLSX
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2">
                        Uploaded Apr 10, 2024
                      </p>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3 hover:scale-[1.02] transition-transform cursor-pointer bg-white">
                    <FileText size={28} className="text-red-500" />
                    <div>
                      <p className="text-xs font-bold text-slate-900 truncate">
                        Specs_Finishes.pdf
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        1.1 MB • PDF
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2">
                        Uploaded Apr 10, 2024
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab !== "overview" && (
            <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
              <p className="text-slate-500 font-medium capitalize">
                {activeTab} Workspace coming soon...
              </p>
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN PLACEHOLDER ── */}
        <div className="hidden lg:flex flex-col gap-6">
          <div className="w-full h-full min-h-[600px] border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex items-center justify-center p-6 text-center">
            <p className="text-sm font-semibold text-slate-400">
              Right Sidebar Placeholder
              <br />
              (Project Progress, Proposals Summary, Recent Activity)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
