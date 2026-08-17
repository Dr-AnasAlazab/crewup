/** @format */

"use client";

import { MessageUI, ParticipantUI } from "@/types";
import { useEffect, useRef } from "react";
import AttachmentCard from "./AttachmentCard";

export default function MessageList({
  messages,
  currentUserId,
  participant,
}: {
  messages: MessageUI[];
  currentUserId: string;
  participant: ParticipantUI;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  console.log(messages);

  // Auto scroll to bottom when messages load/change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAFAFA] flex flex-col gap-6"
    >
      {messages.map((msg) => {
        const isIncoming = msg.sender_id !== currentUserId;

        return (
          <div
            key={msg.id}
            className={`flex max-w-[85%] sm:max-w-[75%] gap-3 ${isIncoming ? "self-start" : "self-end flex-row-reverse"}`}
          >
            {/* Avatar for incoming */}
            {isIncoming && (
              <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 mt-auto overflow-hidden">
                {participant.avatar_url && (
                  <img src={participant.avatar_url} alt="" />
                )}
              </div>
            )}

            <div
              className={`flex flex-col ${isIncoming ? "items-start" : "items-end"}`}
            >
              {/* Text Bubble */}
              {msg.text && (
                <div
                  className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed shadow-sm
                  ${
                    isIncoming
                      ? "bg-white border border-slate-200 text-slate-800 rounded-bl-none"
                      : "bg-blue-600 text-white rounded-br-none"
                  }`}
                >
                  {msg.text}
                </div>
              )}

              {/* Attachments */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mt-2 flex flex-col gap-2 w-full">
                  {msg.attachments.map((att) => (
                    <AttachmentCard
                      key={att.id}
                      attachment={att}
                      isIncoming={isIncoming}
                    />
                  ))}
                </div>
              )}

              {/* Timestamp */}
              <span className="text-[11px] text-slate-400 mt-1.5 font-medium px-1">
                {new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
