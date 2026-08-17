/** @format */

import type { ConversationUI } from "@/types";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

export function ConversationItem({
  conversation,
  isActive,
}: {
  conversation: ConversationUI;
  isActive: boolean;
}) {
  const router = useRouter();

  const handleSelect = () => {
    // URL Driven navigation, avoiding page refresh
    router.replace(`/dashboard/messages?conversation=${conversation.id}`, {
      scroll: false,
    });
  };

  return (
    <button
      onClick={handleSelect}
      className={`w-full text-left p-4 flex gap-3 cursor-pointer items-start border-b border-slate-300 transition-colors
        ${isActive ? "bg-blue-50/50" : "hover:bg-slate-100 bg-white"}
      `}
    >
      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200">
        {conversation.participant.avatar_url ? (
          <img
            src={conversation.participant.avatar_url}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="text-slate-400" size={24} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline mb-0.5">
          <p className="font-semibold text-slate-900 truncate">
            {conversation.participant.company_name ||
              `${conversation.participant.first_name} ${conversation.participant.last_name}`}
          </p>
          <span className="text-xs text-slate-500 whitespace-nowrap ml-2">
            {/* Format date properly in production */}
            {new Date(conversation.updated_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <p
          className={`text-sm truncate ${conversation.unread_count > 0 ? "text-slate-900 font-medium" : "text-slate-500"}`}
        >
          {conversation.latest_message?.text || "Sent an attachment"}
        </p>
      </div>

      {conversation.unread_count > 0 && (
        <div className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full mt-1">
          {conversation.unread_count}
        </div>
      )}
    </button>
  );
}
