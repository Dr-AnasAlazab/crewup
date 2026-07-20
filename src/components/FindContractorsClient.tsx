/** @format */

"use client";

import React, { useState } from "react";
import { SubcontractorUI } from "@/types";
import ContractorTopBar from "./ContractorTopBar";
import ContractorFilterSidebar from "./ContractorFilterSidebar";
import ContractorList from "./ContractorList";
import Pagination from "./Pagination";

interface FindContractorsClientProps {
  initialData: SubcontractorUI[];
}

export default function FindContractorsClient({
  initialData,
}: FindContractorsClientProps) {
  // Setup local state for filtering/pagination later
  const [contractors, setContractors] =
    useState<SubcontractorUI[]>(initialData);

  return (
    <div className="max-w-350 mx-auto p-6 md:p-8">
      <ContractorTopBar />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 mt-6">
        <div className="flex flex-col gap-6">
          <ContractorList contractors={contractors} />
          <Pagination />
        </div>

        <aside className="hidden lg:block">
          <ContractorFilterSidebar />
        </aside>
      </div>
    </div>
  );
}
