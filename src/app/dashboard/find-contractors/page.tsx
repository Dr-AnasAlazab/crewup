/** @format */

import { getSubcontractors } from "@/src/actions/dataActions";
import FindContractorsClient from "@/src/components/FindContractorsClient";

export default async function FindContractorsPage() {
  const initialData = await getSubcontractors();

  return (
    <div className="min-h-screen bg-slate-50">
      <FindContractorsClient initialData={initialData} />
    </div>
  );
}
