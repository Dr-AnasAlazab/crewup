/** @format */

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination() {
  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-md text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
          <ChevronLeft size={16} />
        </button>

        <button className="w-9 h-9 flex items-center justify-center bg-blue-600 text-white font-medium rounded-md">
          1
        </button>
        <button className="w-9 h-9 flex items-center justify-center border border-slate-200 text-slate-600 font-medium rounded-md hover:bg-slate-50 transition-colors">
          2
        </button>
        <button className="w-9 h-9 flex items-center justify-center border border-slate-200 text-slate-600 font-medium rounded-md hover:bg-slate-50 transition-colors">
          3
        </button>

        <span className="w-9 h-9 flex items-center justify-center text-slate-400">
          ...
        </span>

        <button className="w-9 h-9 flex items-center justify-center border border-slate-200 text-slate-600 font-medium rounded-md hover:bg-slate-50 transition-colors">
          10
        </button>

        <button className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-md text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors">
          <ChevronRight size={16} />
        </button>
      </div>

      <p className="text-sm text-slate-500">Showing 1 to 10 of 95 results</p>
    </div>
  );
}
