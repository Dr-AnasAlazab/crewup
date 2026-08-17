/** @format */

"use client";

import { ConversationUI, MessageUI } from "@/types";

import EmptyConversation from "./EmptyConversation";
import { useMemo } from "react";
import ConversationSidebar from "./ConversationSidebar";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

interface MessagesClientProps {
  currentUserId: string;
  conversations: ConversationUI[];
  messages: MessageUI[];
  selectedConversationId?: string;
}

export default function MessagesClient({
  currentUserId,
  conversations,
  messages,
  selectedConversationId,
}: MessagesClientProps) {
  const selectedConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversationId),
    [conversations, selectedConversationId],
  );

  return (
    <div className="flex h-[calc(100vh-64px)] w-full bg-white overflow-hidden border-t border-slate-200">
      {/* LEFT SIDEBAR (Hidden on mobile if a conversation is open) */}
      <div
        className={`w-full md:w-[320px] lg:w-95 shrink-0 border-r border-slate-200 bg-slate-50/50 flex flex-col 
        ${selectedConversationId ? "hidden md:flex" : "flex"}`}
      >
        <ConversationSidebar
          conversations={conversations}
          selectedId={selectedConversationId}
        />
      </div>

      {/* MAIN CHAT AREA */}
      <div
        className={`flex-1 flex-col bg-white w-full
        ${selectedConversationId ? "flex" : "hidden md:flex"}`}
      >
        {selectedConversation ? (
          <>
            <ChatHeader participant={selectedConversation.participant} />
            <MessageList
              messages={messages}
              currentUserId={currentUserId}
              participant={selectedConversation.participant}
            />
            <MessageInput
              currentUserId={currentUserId}
              conversationId={selectedConversation.id}
            />
          </>
        ) : (
          <EmptyConversation
            type={conversations.length === 0 ? "no-conversations" : "select"}
          />
        )}
      </div>
    </div>
  );
}
