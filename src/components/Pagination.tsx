/** @format */

import type { GetSubcontractorsResponse, SubcontractorUI } from "@/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  totalCount: number;
}

export default function Pagination({ totalCount }: PaginationProps) {
  const pageSize = 5;
  const totalPages = Math.ceil(totalCount / pageSize);

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  const searchParams = useSearchParams();
  const router = useRouter();

  // Read the current page from the URL
  const currentPage = Number(searchParams.get("page") ?? 1);

  const handleSetPageToParams = (page: number) => {
    const newParams = new URLSearchParams(searchParams);

    newParams.set("page", page.toString());
    newParams.set("pageSize", pageSize.toString());

    router.push(`?${newParams.toString()}`);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handleSetPageToParams(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handleSetPageToParams(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-4">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-md text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handleSetPageToParams(page)}
            className={`w-9 h-9 flex items-center justify-center rounded-md font-medium transition-colors
              ${
                page === currentPage
                  ? "bg-blue-600 text-white"
                  : "border border-slate-300 bg-white text-slate-600 hover:bg-blue-600 hover:text-white"
              }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="w-9 h-9 flex items-center justify-center border border-slate-200 rounded-md text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <p className="text-sm text-slate-500">
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
}
