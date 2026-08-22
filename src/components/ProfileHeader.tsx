/** @format */
"use client";

import { SubcontractorUI } from "@/types";
import { BadgeCheck, MapPin, Edit3, Building2 } from "lucide-react";

export default function ProfileHeader({
  profile,
}: {
  profile: SubcontractorUI;
}) {
  // Parse date safely based on your string type
  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row gap-6 items-start justify-between">
      <div className="flex gap-6 items-start">
        <div className="w-24 h-24 rounded-lg bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-blue-900 shrink-0 overflow-hidden">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          ) : (
            <Building2 size={40} className="text-blue-600 mb-1" />
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900">
              {profile.company_name || profile.full_name}
            </h2>
            <BadgeCheck
              className="text-blue-600"
              size={20}
              fill="currentColor"
              stroke="white"
            />
          </div>

          <p className="text-slate-500 text-sm mt-1">
            {profile.trades?.[0] || "General Contractor"}
          </p>

          <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <MapPin size={16} className="text-slate-400" />
              {profile.location || "No location set"}
            </span>
            <span>•</span>
            <span>{profile.phone || "No phone provided"}</span>
          </div>

          {profile.website && (
            <a
              href={
                profile.website.startsWith("http")
                  ? profile.website
                  : `https://${profile.website}`
              }
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline text-sm font-medium mt-1"
            >
              {profile.website}
            </a>
          )}

          {/* Connected perfectly to your boolean types */}
          <div className="flex gap-3 mt-4">
            {profile.is_licensed && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100">
                <BadgeCheck size={14} className="text-emerald-600" /> Licensed
              </span>
            )}
            {profile.is_insured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100">
                <BadgeCheck size={14} className="text-emerald-600" /> Insured
              </span>
            )}
            {profile.is_bonded && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100">
                <BadgeCheck size={14} className="text-emerald-600" /> Bonded
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-6 w-full md:w-auto">
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Edit3 size={16} />
          Edit Profile
        </button>

        <div className="text-right w-full pt-4 border-t border-slate-100 md:border-none md:pt-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Member Since
          </p>
          <p className="text-sm font-semibold text-slate-900 mt-1">
            {memberSince}
          </p>
        </div>
      </div>
    </div>
  );
}
