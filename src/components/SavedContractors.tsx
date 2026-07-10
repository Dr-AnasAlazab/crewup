/** @format */
import Link from "next/link";
import { Star } from "lucide-react";

interface SavedContractor {
  id: string;
  name: string;
  trade: string;
  rating: number;
  avatar_url: string | null;
}

interface SavedContractorsProps {
  contractors: SavedContractor[];
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
        className="w-10 h-10 rounded-full object-cover"
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

export default function SavedContractors({
  contractors,
}: SavedContractorsProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mt-4">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900">
          Saved Contractors
        </h2>
        <Link
          href="/dashboard/saved"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Horizontal scroll row of contractor cards */}
      <div className="flex gap-4 px-6 py-5 overflow-x-auto scrollbar-none">
        {contractors.map((contractor) => (
          <Link
            key={contractor.id}
            href={`/dashboard/find-contractors/${contractor.id}`}
            className="flex flex-col items-center gap-2 flex-shrink-0 w-20 group"
          >
            <AvatarFallback
              name={contractor.name}
              avatarUrl={contractor.avatar_url}
            />
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                {contractor.name}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {contractor.trade}
              </p>
              <div className="flex items-center justify-center gap-0.5 mt-0.5">
                <Star size={10} className="text-amber-400 fill-amber-400" />
                <span className="text-[10px] text-slate-500 font-medium">
                  {contractor.rating}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
