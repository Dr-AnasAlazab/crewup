/** @format */

"use client";

import { US_STATES } from "@/config/states";
import { ChevronDown, Star } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ContractorFilterSidebarProps {
  trades: string[];
}

export default function ContractorFilterSidebar({
  trades,
}: ContractorFilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = router;

  // Helper function to read current params from URL
  const getParamsFromUrl = () => ({
    trade: searchParams.get("trade") || "",
    location: searchParams.get("location") || "",
    licensed: searchParams.get("licensed") === "true",
    insured: searchParams.get("insured") === "true",
    bonded: searchParams.get("bonded") === "true",
    rating: searchParams.get("rating") || "",
    yearsInBusiness: searchParams.get("yearsInBusiness") || "",
    availableNow: searchParams.get("availableNow") === "true",
    availableForUpcomingProjects:
      searchParams.get("availableForUpcomingProjects") === "true",
    search: searchParams.get("search"),
    page: searchParams.get("page") || 1,
    pageSize: searchParams.get("pageSize") || 5,
  });

  // 1. Initialize state with current URL search params
  const [filterItems, setFilterItems] = useState(getParamsFromUrl);

  // 2. Sync state whenever the URL searchParams update (handles hard reloads & back/forward browser buttons)
  useEffect(() => {
    setFilterItems(getParamsFromUrl());
  }, [searchParams]);

  // 3. Handler to Apply Filters to the URL
  const handleApplyFilters = () => {
    const newParams = new URLSearchParams();

    Object.entries(filterItems).forEach(([key, value]) => {
      if (typeof value === "boolean") {
        if (value) newParams.set(key, "true");
      } else if (value) {
        newParams.set(key, value as string);
      }
    });

    replace(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  // 4. Handler to Clear all Filters
  const handleClearFilters = () => {
    const newParams = new URLSearchParams();

    newParams.set("search", searchParams.get("search") ?? "");
    newParams.set("page", searchParams.get("page") ?? "1");
    newParams.set("pageSize", searchParams.get("pageSize") ?? "5");

    setFilterItems({
      trade: "",
      location: "",
      licensed: false,
      insured: false,
      bonded: false,
      rating: "",
      yearsInBusiness: "",
      availableNow: false,
      availableForUpcomingProjects: false,
      search: searchParams.get("search") ?? "",
      page: Number(searchParams.get("page") ?? 1),
      pageSize: Number(searchParams.get("pageSize") ?? 5),
    });

    replace(`${pathname}?${newParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-900">Filter Results</h3>
        <button
          onClick={handleClearFilters}
          className="text-sm cursor-pointer font-semibold text-blue-600 hover:text-blue-700"
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-col gap-5">
        {/* Trade Filter */}
        <div>
          <label className="text-sm font-semibold text-slate-900 block mb-2">
            Trade
          </label>
          <div className="relative">
            <select
              value={filterItems.trade}
              onChange={(e) =>
                setFilterItems({ ...filterItems, trade: e.target.value })
              }
              className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Trade</option>
              {trades.map((trade) => (
                <option key={trade} value={trade}>
                  {trade}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={16}
            />
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <label className="text-sm font-semibold text-slate-900 block mb-2">
            Location
          </label>
          <select
            value={filterItems.location}
            onChange={(e) =>
              setFilterItems({ ...filterItems, location: e.target.value })
            }
            className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a State</option>
            {US_STATES.map((state) => (
              <option key={state.code} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        {/* License & Insurance Filter */}
        <div>
          <label className="text-sm font-semibold text-slate-900 block mb-3">
            License & Insurance
          </label>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterItems.licensed}
                onChange={(e) =>
                  setFilterItems({ ...filterItems, licensed: e.target.checked })
                }
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              Licensed
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterItems.insured}
                onChange={(e) =>
                  setFilterItems({ ...filterItems, insured: e.target.checked })
                }
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              Insured
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterItems.bonded}
                onChange={(e) =>
                  setFilterItems({ ...filterItems, bonded: e.target.checked })
                }
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              Bonded
            </label>
          </div>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="text-sm font-semibold text-slate-900 block mb-3">
            Rating
          </label>
          <div className="flex gap-1">
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() =>
                  setFilterItems({
                    ...filterItems,
                    rating:
                      filterItems.rating === rating.toString()
                        ? ""
                        : rating.toString(),
                  })
                }
                className={`flex-1 ${
                  rating !== 5 && "py-3 "
                } flex items-center justify-center gap-1 py-1.5 border rounded-md text-xs font-medium transition-colors ${
                  filterItems.rating === rating.toString()
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Star size={10} className="fill-slate-900 text-slate-900" />
                {rating} {rating !== 5 && "up"}
              </button>
            ))}
          </div>
        </div>

        {/* Years in Business Filter */}
        <div>
          <label className="text-sm font-semibold text-slate-900 block mb-2">
            Years in Business
          </label>
          <div className="relative">
            <select
              value={filterItems.yearsInBusiness}
              onChange={(e) =>
                setFilterItems({
                  ...filterItems,
                  yearsInBusiness: e.target.value,
                })
              }
              className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Experience</option>
              <option value="Less than 1 year">Less than 1 year</option>
              <option value="1-5 years">1-5 years</option>
              <option value="5-10 years">5-10 years</option>
              <option value="More than 10 years">More than 10 years</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={16}
            />
          </div>
        </div>

        {/* Availability Filter */}
        <div>
          <label className="text-sm font-semibold text-slate-900 block mb-3">
            Availability
          </label>
          <div className="flex flex-col gap-3 text-sm text-slate-600">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterItems.availableNow}
                onChange={(e) =>
                  setFilterItems({
                    ...filterItems,
                    availableNow: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              Available Now
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filterItems.availableForUpcomingProjects}
                onChange={(e) =>
                  setFilterItems({
                    ...filterItems,
                    availableForUpcomingProjects: e.target.checked,
                  })
                }
                className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
              />
              Available for Upcoming Projects
            </label>
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApplyFilters}
          className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors mt-2"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
