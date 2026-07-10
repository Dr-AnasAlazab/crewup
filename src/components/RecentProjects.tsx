/** @format */
import Image from "next/image";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  location: string;
  trades: string[];
  proposals_count: number;
  created_at: string;
  image_url: string;
  status: string;
}

interface RecentProjectsProps {
  projects: Project[];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
}

export default function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h2 className="text-base font-bold text-slate-900">Recent Projects</h2>
        <Link
          href="/dashboard/projects"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Project rows */}
      <div className="divide-y divide-slate-100">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/dashboard/projects/${project.id}`}
            className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors group"
          >
            {/* Project image */}
            <div className="w-[88px] h-[66px] rounded-xl overflow-hidden flex-shrink-0 bg-slate-200">
              <Image
                src={"/hero.webp"}
                alt={project.title}
                width={88}
                height={66}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Project info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {project.title}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {project.location}
              </p>
              <p className="text-xs text-slate-400 mt-1 truncate">
                {project.trades.join(", ")}
              </p>
            </div>

            {/* Proposals + time */}
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs font-semibold text-slate-700">
                  {project.proposals_count} Proposals
                </span>
              </div>
              <span className="text-xs text-slate-400">
                {timeAgo(project.created_at)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
