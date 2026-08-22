/** @format */
"use client";

import { SubcontractorUI } from "@/types";
import { Image as ImageIcon, UploadCloud } from "lucide-react";

export default function PortfolioTab({
  profile,
}: {
  profile: SubcontractorUI;
}) {
  // Using the specific portfolio_images array from your SubcontractorUI type
  const images = profile.portfolio_images || [];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900">Project Portfolio</h3>
        <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <UploadCloud size={16} />
          Upload Photos
        </button>
      </div>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="aspect-square rounded-lg border border-slate-200 overflow-hidden group relative cursor-pointer bg-slate-100"
            >
              <img
                src={img}
                alt={`Portfolio ${idx}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
          <div className="p-4 bg-white rounded-full shadow-sm mb-4">
            <ImageIcon size={32} className="text-slate-400" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">
            No portfolio images yet
          </h4>
          <p className="text-sm text-slate-500 text-center max-w-sm">
            Upload images of your completed projects to show potential clients
            the quality of your work.
          </p>
        </div>
      )}
    </div>
  );
}
