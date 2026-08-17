/** @format */

"use client";

import { Paperclip, Send, X, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chattAttachments, sendMessage } from "../actions/dataActions";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

interface MessageInputProps {
  conversationId: string;
  currentUserId: string;
  onMessageSent?: () => void;
}

interface SendMessagePayload {
  text: string;
  file: File | null;
}

export default function MessageInput({
  conversationId,
  currentUserId,
  onMessageSent,
}: MessageInputProps) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // 1. File Input Utilities
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 2. TanStack Query Mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ text, file }: SendMessagePayload) => {
      let fileUrl: string | null = null;
      let fileName: string | null = null;
      let fileSize: number | null = null;

      // Upload file to Supabase Storage if present
      if (file) {
        const uploadResult = await chattAttachments({
          file,
          conversationId,
        });

        if (uploadResult) {
          fileUrl = uploadResult.fileUrl;
          fileName = uploadResult.fileName;
          fileSize = uploadResult.fileSize;
        }
      }

      // Build payload for Server Action
      const formData = new FormData();
      formData.append("conversationId", conversationId);
      formData.append("senderId", currentUserId);
      if (text.trim()) formData.append("content", text.trim());
      if (fileUrl) formData.append("fileUrl", fileUrl);
      if (fileName) formData.append("fileName", fileName);
      if (fileSize) formData.append("fileSize", fileSize.toString());

      return await sendMessage(formData);
    },

    onSuccess: () => {
      // Clear inputs
      setText("");
      handleRemoveFile();
      router.refresh();

      // Refetch relevant cache queries to update UI automatically
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });

      if (onMessageSent) onMessageSent();
    },

    onError: (error) => {
      console.error("[MessageInput] Failed to send message:", error);
    },
  });

  // 3. Dispatch Mutation
  const handleSend = () => {
    if ((!text.trim() && !selectedFile) || sendMessageMutation.isPending)
      return;

    sendMessageMutation.mutate({
      text: text.trim(),
      file: selectedFile,
    });
  };

  const isFormValid = text.trim().length > 0 || selectedFile !== null;
  const isSending = sendMessageMutation.isPending;

  return (
    <div className="p-4 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto flex flex-col gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-shadow">
        {/* Selected File Badge */}
        {selectedFile && (
          <div className="flex items-center gap-2 bg-slate-200/70 text-slate-700 px-3 py-1.5 rounded-lg text-sm w-fit mx-1 mt-1">
            <Paperclip size={14} />
            <span className="truncate max-w-xs font-medium">
              {selectedFile.name}
            </span>
            <button
              onClick={handleRemoveFile}
              disabled={isSending}
              className="text-slate-500 hover:text-slate-800 p-0.5 rounded-full hover:bg-slate-300 disabled:opacity-50"
              type="button"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="relative flex items-end gap-2">
          {/* File Picker */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            aria-hidden="true"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending}
            className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors shrink-0 disabled:opacity-50"
            aria-label="Attach file"
            type="button"
          >
            <Paperclip size={20} />
          </button>

          {/* Text Area */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            disabled={isSending}
            className="flex-1 max-h-32 min-h-11 bg-transparent resize-none py-2.5 px-2 text-[15px] text-slate-800 focus:outline-none placeholder:text-slate-400 disabled:opacity-50"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />

          {/* Send / Loader Button */}
          <button
            onClick={handleSend}
            disabled={!isFormValid || isSending}
            className={`p-2.5 rounded-lg transition-colors shrink-0 flex items-center justify-center ${
              isFormValid && !isSending
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                : "bg-transparent text-slate-300"
            }`}
            aria-label="Send message"
            type="button"
          >
            {isSending ? (
              <Loader2 size={18} className="animate-spin text-blue-600" />
            ) : (
              <Send size={18} className={isFormValid ? "ml-0.5" : ""} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
