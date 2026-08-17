/** @format */

/** @format */
import { Paperclip, Download } from "lucide-react";

export default function AttachmentCard({
  attachment,
  isIncoming,
}: {
  attachment: any; // Replace 'any' with your actual Attachment UI type
  isIncoming: boolean;
}) {
  return (
    <a
      // Use the URL from your attachment object
      href={attachment.file_url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 p-2.5 w-fit max-w-sm rounded-lg border transition-colors cursor-pointer group
        ${
          isIncoming
            ? "bg-white hover:bg-slate-50 border-slate-200"
            : "bg-blue-700 hover:bg-blue-800 border-blue-600 text-white"
        }
      `}
    >
      <div
        className={`p-2 rounded-md shadow-sm ${isIncoming ? "bg-slate-100" : "bg-blue-600"}`}
      >
        <Paperclip
          size={16}
          className={isIncoming ? "text-blue-500" : "text-white"}
        />
      </div>

      <div className="flex flex-col overflow-hidden">
        <span className="text-sm font-medium truncate">
          {attachment.file_name || "Attached File"}
        </span>
        {attachment.fileSize && (
          <span
            className={`text-xs ${isIncoming ? "text-slate-500" : "text-blue-200"}`}
          >
            {(attachment.file_size / 1024 / 1024).toFixed(2)} MB
          </span>
        )}
      </div>

      <Download
        size={16}
        className={`ml-2 transition-colors ${
          isIncoming
            ? "text-slate-400 group-hover:text-blue-600"
            : "text-blue-300 group-hover:text-white"
        }`}
      />
    </a>
  );
}

// /** @format */

// "use client";

// import { AttachmentUI } from "@/types";
// import { Download, File } from "lucide-react";

// export default function AttachmentCard({
//   attachment,
//   isIncoming,
// }: {
//   attachment: AttachmentUI;
//   isIncoming: boolean;
// }) {
//   const formatBytes = (bytes: number) => {
//     if (bytes === 0) return "0 B";
//     const k = 1024;
//     const sizes = ["B", "KB", "MB", "GB"];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
//   };

//   return (
//     <div
//       className={`flex items-center gap-3 p-3 rounded-xl border max-w-sm
//       ${isIncoming ? "bg-white border-slate-200" : "bg-blue-700/20 border-blue-500/30 text-white"}
//     `}
//     >
//       <div
//         className={`p-2 rounded-lg ${isIncoming ? "bg-blue-50 text-blue-600" : "bg-blue-600/50 text-white"}`}
//       >
//         <File size={20} />
//       </div>

//       <div className="flex-1 min-w-0">
//         <p
//           className={`text-sm font-medium truncate ${isIncoming ? "text-slate-800" : "text-blue-50"}`}
//         >
//           {attachment.file_name}
//         </p>
//         <p
//           className={`text-xs ${isIncoming ? "text-slate-500" : "text-blue-200"}`}
//         >
//           {formatBytes(attachment.file_size)} •{" "}
//           {attachment.file_type.toUpperCase()}
//         </p>
//       </div>

//       <button
//         className={`p-2 rounded-full transition-colors
//         ${isIncoming ? "text-slate-400 hover:text-slate-600 hover:bg-slate-100" : "text-blue-200 hover:text-white hover:bg-blue-600/50"}
//       `}
//       >
//         <Download size={18} />
//       </button>
//     </div>
//   );
// }
