/** @format */
/** @format */
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SubcontractorUI, Project } from "@/types";
import { getProfile, getProjects } from "@/src/actions/dataActions";
import ProfileHeader from "../components/ProfileHeader";
import OverviewTab from "./OverviewTab";
import BusinessInfoTab from "../app/dashboard/profile/Tabs/business/page";
import ServicesTab from "../app/dashboard/profile/Tabs/servicesTab/page";
import PortfolioTab from "../app/dashboard/profile/Tabs/portfolio/page";

interface ProfileClientProps {
  initialProfile: SubcontractorUI; // Using your exact type
  initialProjects: Project[]; // Using your exact type
}

type TabType = "overview" | "business_info" | "services" | "portfolio";

export default function ProfileClient({
  initialProfile,
  initialProjects,
}: ProfileClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Hydrate TanStack Query with Server Data
  const { data: profile } = useQuery({
    queryKey: ["profile", initialProfile.id],
    queryFn: () => getProfile(initialProfile.id),
    initialData: initialProfile,
  });

  const { data: projects } = useQuery({
    queryKey: ["projects", initialProfile.id], // Keeping this cached per user
    queryFn: () => getProjects({ searchParams: "" }),
    initialData: initialProjects,
  });

  const tabs: { id: TabType; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "business_info", label: "Business Information" },
    { id: "services", label: "Services" },
    { id: "portfolio", label: "Portfolio" },
  ];

  if (!profile) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Card */}
      <ProfileHeader profile={profile} />

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content Rendering */}
      <div className="mt-2">
        {activeTab === "overview" && (
          <OverviewTab profile={profile} projects={projects || []} />
        )}
        {activeTab === "business_info" && <BusinessInfoTab profile={profile} />}
        {activeTab === "services" && <ServicesTab profile={profile} />}
        {activeTab === "portfolio" && <PortfolioTab profile={profile} />}
      </div>
    </div>
  );
}
