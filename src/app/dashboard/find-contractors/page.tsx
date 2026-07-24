/** @format */

import { getSubcontractors, getTrades } from "@/src/actions/dataActions";
import FindContractorsClient from "@/src/components/FindContractorsClient";
import type { FindContractorsPageParams } from "@/types";

export default async function FindContractorsPage({
  searchParams,
}: {
  searchParams: Promise<FindContractorsPageParams> | FindContractorsPageParams;
}) {
  // Await searchParams to safely extract the query filters
  const resolvedSearchParams = await searchParams;

  const trades = await getTrades();
  const initialData = await getSubcontractors(resolvedSearchParams);

  return (
    <div className="min-h-screen bg-slate-50">
      <FindContractorsClient initialData={initialData} trades={trades} />
    </div>
  );
}
