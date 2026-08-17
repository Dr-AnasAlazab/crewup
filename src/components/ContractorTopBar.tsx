/** @format */

import { Search, Bell, ChevronDown } from "lucide-react";
import Searchbar from "./Searchbar";

export default function ContractorTopBar() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Find Contractors
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Search and connect with trusted subcontractors.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative text-slate-500 hover:text-slate-700">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              2
            </span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
              alt="User"
              className="w-8 h-8 rounded-full bg-slate-200"
            />
            <span className="text-sm font-medium text-slate-700 hidden sm:block">
              John Contractor
            </span>
            <ChevronDown size={16} className="text-slate-400" />
          </div>
        </div>
      </div>

      <Searchbar />
      {/* Search & Global Filters
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by trade, keyword, or company"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <div className="relative w-40">
            <select className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Trades</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={16}
            />
          </div>

          <div className="relative w-40">
            <select className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Location</option>
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              size={16}
            />
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors">
            Search
          </button>
        </div>
      </div> */}
    </div>
  );
}
