/** @format */

import { SubcontractorUI } from "@/types";
import ContractorCard from "./ContractorCard";

interface ContractorListProps {
  contractors: SubcontractorUI[];
}

export default function ContractorList({ contractors }: ContractorListProps) {
  if (!contractors || contractors.length === 0) {
    return (
      <div className="text-center p-8 text-slate-500">
        No contractors found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {contractors.map((contractor) => (
        <ContractorCard key={contractor.id} contractor={contractor} />
      ))}
    </div>
  );
}
