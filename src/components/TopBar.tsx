/** @format */
import { Bell, Menu, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TopBarProps {
  userName: string;
}

export default function TopBar({ userName }: TopBarProps) {
  const firstName = userName.split(" ")[0];

  return (
    <div className="flex flex-col">
      {/* Top nav bar */}
      <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200">
        <button className="text-slate-500 hover:text-slate-800 transition-colors">
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-4">
          {/* Bell with notification dot */}
          <button className="relative text-slate-500 hover:text-slate-800 transition-colors">
            <Bell size={20} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User avatar + name */}
          <button className="flex items-center gap-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
            <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
              {/* Fallback initials if no avatar */}
              {userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <span>{userName}</span>
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Page header */}
      <div className="flex items-center justify-between px-8 pt-8 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {firstName}!
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Here&apos;s what&apos;s happening with your projects.
          </p>
        </div>

        <Link
          href="/dashboard/projects/postproject"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={16} />
          Post a Project
        </Link>
      </div>
    </div>
  );
}
