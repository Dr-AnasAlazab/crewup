/** @format */
import Link from "next/link";
import { Star } from "lucide-react";

interface Contractor {
  id: string;
  name: string;
  trades: string;
  rating: number;
  avatar_url: string | null;
}

interface RecommendedContractorsProps {
  contractors: Contractor[];
}

function AvatarFallback({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl: string | null;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  const colors = [
    "bg-amber-600",
    "bg-blue-600",
    "bg-teal-600",
    "bg-rose-600",
    "bg-violet-600",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
    );
  }
  return (
    <div
      className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

export default function RecommendedContractors({
  contractors,
}: RecommendedContractorsProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mt-4">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900">
          Recommended Contractors
        </h2>
        <Link
          href="/dashboard/find-contractors"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {contractors.map((contractor) => (
          <Link
            key={contractor.id}
            href={`/dashboard/find-contractors/${contractor.id}`}
            className="flex items-center gap-3 px-6 py-4 hover:bg-slate-50 transition-colors group"
          >
            <AvatarFallback
              name={contractor.name}
              avatarUrl={contractor.avatar_url}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {contractor.name}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {contractor.trades}
              </p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-slate-700">
                {contractor.rating}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
