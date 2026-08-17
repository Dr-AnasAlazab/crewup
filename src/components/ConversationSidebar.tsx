/** @format */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ConversationUI } from "@/types";
import { Edit, User } from "lucide-react";
import { ConversationItem } from "./ConversationItems";

export default function ConversationSidebar({
  conversations,
  selectedId,
}: {
  conversations: ConversationUI[];
  selectedId?: string;
}) {
  return (
    <>
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
        <h1 className="text-xl font-semibold text-slate-900">Messages</h1>
        <button
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="New Message"
        >
          <Edit size={20} />
        </button>
      </div>

      {/* Tabs Layout */}
      <div className="flex px-4 pt-2 gap-6 border-b border-slate-200 bg-white">
        {["Inbox", "Sent", "Archived"].map((tab, i) => (
          <button
            key={tab}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              i === 0
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {conversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            isActive={conv.id === selectedId}
          />
        ))}
      </div>
    </>
  );
}
