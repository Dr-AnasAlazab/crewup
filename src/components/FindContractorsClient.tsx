/** @format */

"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import {
  SubcontractorUI,
  type FindContractorsPageParams,
  type GetSubcontractorsResponse,
} from "@/types";
import ContractorTopBar from "./ContractorTopBar";
import ContractorFilterSidebar from "./ContractorFilterSidebar";
import ContractorList from "./ContractorList";
import Pagination from "./Pagination";

// ⚠️ Make sure this import matches your actual file structure
import { getSubcontractors } from "@/src/actions/dataActions";

interface FindContractorsClientProps {
  initialData: GetSubcontractorsResponse;
  trades: string[]; // Or { trade: string; id: string }[] depending on your actual type
}

export default function FindContractorsClient({
  initialData,
  trades,
}: FindContractorsClientProps) {
  const searchParams = useSearchParams();

  // 1. Convert the URL Search Params into a plain object to pass to your action
  const currentParams = useMemo(() => {
    const params: Partial<FindContractorsPageParams> = {};

    searchParams.forEach((value, key) => {
      (params as Record<string, unknown>)[key] =
        value === "true" ? true : value;
    });

    return params as FindContractorsPageParams;
  }, [searchParams]);
  // 2. TanStack Query takes over state management
  const { data, isFetching } = useQuery({
    // The queryKey watches your URL params. If the URL changes, this triggers a fetch.
    queryKey: ["contractors", currentParams],

    // Call the Server Action directly from the client
    queryFn: () => getSubcontractors(currentParams),

    // Hydrate instantly with the HTML data from the Server Component
    initialData: initialData,
  });
  const contractors = data?.contractors ?? [];
  const totalCount = data?.totalCount ?? [];

  return (
    <div className="max-w-350 mx-auto p-6 md:p-8">
      <ContractorTopBar />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 mt-6">
        <div className="flex flex-col gap-6">
          {/* Optional: Add a subtle loading indicator while TanStack is fetching in the background */}
          {isFetching && (
            <div className="text-sm text-blue-600 animate-pulse">
              Updating results...
            </div>
          )}

          {/* Pass the TanStack Query data directly to your list */}
          <ContractorList contractors={contractors} />

          <Pagination totalCount={totalCount} />
        </div>

        <aside className="hidden lg:block">
          <ContractorFilterSidebar trades={trades} />
        </aside>
      </div>
    </div>
  );
}
