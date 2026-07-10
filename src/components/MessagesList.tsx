/** @format */
import Link from "next/link";

interface Message {
  id: string;
  sender_name: string;
  content: string;
  time_ago: string;
  is_unread: boolean;
  avatar_url: string | null;
}

interface MessagesListProps {
  messages: Message[];
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
  const colors = ["bg-slate-700", "bg-blue-700", "bg-teal-700", "bg-rose-700"];
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

export default function MessagesList({ messages }: MessagesListProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900">Messages</h2>
        <Link
          href="/dashboard/messages"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {messages.map((msg) => (
          <Link
            key={msg.id}
            href={`/dashboard/messages`}
            className="flex items-start gap-3 px-6 py-4 hover:bg-slate-50 transition-colors"
          >
            <AvatarFallback name={msg.sender_name} avatarUrl={msg.avatar_url} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900">
                {msg.sender_name}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {msg.content}
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className="text-xs text-slate-400">{msg.time_ago}</span>
              {msg.is_unread && (
                <span className="w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
