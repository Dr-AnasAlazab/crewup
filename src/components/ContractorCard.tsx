/** @format */

import { MapPin, Star, CheckCircle2 } from "lucide-react";
import { SubcontractorUI } from "@/types";

interface ContractorCardProps {
  contractor: SubcontractorUI;
}

export default function ContractorCard({ contractor }: ContractorCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row gap-6 hover:shadow-sm transition-shadow">
      {/* Left: Avatar/Logo */}
      <div className="w-16 h-16 shrink-0 rounded-lg border border-slate-100 flex items-center justify-center bg-white overflow-hidden">
        {contractor.avatar_url ? (
          <img
            src={contractor.avatar_url}
            alt={contractor.company_name || "Logo"}
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xl">
            {contractor.company_name?.charAt(0) || "C"}
          </div>
        )}
      </div>

      {/* Center: Details */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-slate-900 text-lg leading-tight">
              {contractor.company_name}
            </h3>
            <p className="text-sm text-slate-600 mt-0.5">
              {contractor.trades.join(", ")}
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-white border border-slate-100 px-2 py-1 rounded-md">
            <Star size={14} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-bold text-slate-900">
              {contractor.rating}
            </span>
            <span className="text-xs text-slate-500">
              ({contractor.review_count})
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin size={14} className="text-slate-400" />
          {contractor.location}
        </div>

        <p className="text-sm text-slate-600 line-clamp-2 mt-1 pr-4">
          {contractor.bio}
        </p>

        <div className="flex items-center gap-4 mt-2">
          {contractor.is_licensed && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 size={14} className="fill-emerald-600 text-white" />
              Licensed
            </span>
          )}
          {contractor.is_insured && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 size={14} className="fill-emerald-600 text-white" />
              Insured
            </span>
          )}
        </div>

        {contractor.portfolio_images &&
          contractor.portfolio_images.length > 0 && (
            <div className="flex gap-2 mt-3">
              {contractor.portfolio_images.map((img, idx) => (
                <div
                  key={idx}
                  className="w-20 h-14 rounded overflow-hidden border border-slate-200"
                >
                  <img
                    src={img}
                    alt={`Portfolio ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
      </div>

      {/* Right: Actions */}
      <div className="flex flex-col gap-3 shrink-0 sm:w-36 mt-4 sm:mt-0">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors">
          View Profile
        </button>
        <button className="w-full bg-white hover:bg-slate-50 border border-slate-200 text-blue-600 text-sm font-semibold py-2 rounded-lg transition-colors">
          Message
        </button>
      </div>
    </div>
  );
}
