/** @format */
import Link from "next/link";
import { Briefcase, Mail, Users, CheckCircle } from "lucide-react";
import { ArrowRight } from "lucide-react";

interface StatCard {
  label: string;
  value: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  linkLabel: string;
  href: string;
}

const cards: StatCard[] = [
  {
    label: "Active Projects",
    value: 12,
    icon: Briefcase,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    linkLabel: "View all projects",
    href: "/dashboard/projects",
  },
  {
    label: "Proposals Received",
    value: 8,
    icon: Mail,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    linkLabel: "View proposals",
    href: "/dashboard/proposals",
  },
  {
    label: "Ongoing Jobs",
    value: 5,
    icon: Users,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-500",
    linkLabel: "View jobs",
    href: "/dashboard/jobs",
  },
  {
    label: "Completed Jobs",
    value: 24,
    icon: CheckCircle,
    iconBg: "bg-green-100",
    iconColor: "text-green-500",
    linkLabel: "View completed",
    href: "/dashboard/jobs?status=completed",
  },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-8 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">
                  {card.value}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
              </div>
            </div>

            <Link
              href={card.href}
              className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              {card.linkLabel}
              <ArrowRight size={14} />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
