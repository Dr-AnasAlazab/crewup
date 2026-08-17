/** @format */

"use client";

import { ParticipantUI } from "@/types";
import { ChevronLeft, MoreVertical, User } from "lucide-react";
import Link from "next/link";

export default function ChatHeader({
  participant,
}: {
  participant: ParticipantUI;
}) {
  return (
    <div className="h-16 border-b border-slate-200 bg-white px-4 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile Back Button */}
        <Link
          href="/dashboard/messages"
          className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
          replace
        >
          <ChevronLeft size={24} />
        </Link>

        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-200">
          {participant.avatar_url ? (
            <img
              src={participant.avatar_url}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="text-slate-400" size={20} />
          )}
        </div>

        <div>
          <h2 className="font-semibold text-slate-900 leading-tight">
            {participant.company_name ||
              `${participant.first_name} ${participant.last_name}`}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-xs text-slate-500 font-medium">Online</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="hidden sm:block text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 px-4 py-2 rounded-lg transition-colors">
          View Profile
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
}
