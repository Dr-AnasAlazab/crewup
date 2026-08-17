/** @format */

"use client";

import { MessageSquare } from "lucide-react";

export default function EmptyConversation({
  type,
}: {
  type: "select" | "no-conversations";
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
      <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm mb-4 text-blue-600">
        <MessageSquare size={32} />
      </div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">
        {type === "select" ? "Your Messages" : "Inbox Zero"}
      </h2>
      <p className="text-slate-500 max-w-sm">
        {type === "select"
          ? "Select a conversation from the sidebar to view details, or start a new message to a contractor."
          : "You don't have any active conversations yet. Once you connect with contractors, messages will appear here."}
      </p>

      {type === "no-conversations" && (
        <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors shadow-sm">
          Browse Contractors
        </button>
      )}
    </div>
  );
}
