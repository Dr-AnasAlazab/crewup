/** @format */
"use client";
import { ChevronDown, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ContractorFilterSidebar() {
  const params = useSearchParams();

  const handleFilterChange = (filterName: string, value: string) => {
    // Implementation for handling filter changes
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-900">Filter Results</h3>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
          Clear all
        </button>
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <label className="text-sm font-semibold text-slate-900 block mb-2">
            Trade
          </label>
          <div className="relative">
            <select
              onChange={(e) => handleFilterChange("trade", e.target.value)}
              className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Select a Trade</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={16}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-900 block mb-2">
            Location
          </label>
          <input
            type="text"
            placeholder="City, State or ZIP"
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-900 block mb-2">
            Service Area
          </label>
          <div className="relative">
            <select className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Within 50 miles</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={16}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-900 block mb-3">
            License & Insurance
          </label>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              Licensed
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              Insured
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              Bonded
            </label>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-900 block mb-3">
            Rating
          </label>
          <div className="flex gap-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                <Star size={10} className="fill-slate-900 text-slate-900" />{" "}
                {rating}
                {rating !== 5 && " & up"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-900 block mb-2">
            Years in Business
          </label>
          <div className="relative">
            <select className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select Experience</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={16}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-900 block mb-3">
            Availability
          </label>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              Available Now
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              Available for Upcoming Projects
            </label>
          </div>
        </div>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors mt-2">
          Apply Filters
        </button>
      </div>
    </div>
  );
}
