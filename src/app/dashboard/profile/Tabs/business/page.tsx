/** @format */
"use client";

import { SubcontractorUI } from "@/types";
import { Mail, Phone, Globe, CalendarDays } from "lucide-react";

export default function BusinessInfoTab({
  profile,
}: {
  profile: SubcontractorUI;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm max-w-3xl">
      <h3 className="text-lg font-bold text-slate-900 mb-6">
        Contact & Business Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
          <Mail className="text-blue-600 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Email Address
            </p>
            <p className="text-sm font-medium text-slate-900">
              {profile.email || "Not provided"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
          <Phone className="text-blue-600 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Phone Number
            </p>
            <p className="text-sm font-medium text-slate-900">
              {profile.phone || "Not provided"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
          <Globe className="text-blue-600 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Website
            </p>
            {profile.website ? (
              <a
                href={
                  profile.website.startsWith("http")
                    ? profile.website
                    : `https://${profile.website}`
                }
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                {profile.website}
              </a>
            ) : (
              <p className="text-sm font-medium text-slate-900">Not provided</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
          <CalendarDays className="text-blue-600 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Experience
            </p>
            <p className="text-sm font-medium text-slate-900">
              {profile.years_in_business || 0} Years in Business
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
