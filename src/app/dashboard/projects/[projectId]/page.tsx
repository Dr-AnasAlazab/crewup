/** @format */
import { notFound } from "next/navigation";
import { getProjectById } from "@/src/actions/dataActions";
import ProjectDetailsClient from "@/src/components/ProjectDetailsClient"; // Make sure this path is correct

// Force Next.js to treat this page dynamically
export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  // Destructure the matching property
  const { projectId } = await params;

  console.log("Found ID:", projectId);

  // Pass it to your database function
  const project = await getProjectById(projectId);

  // If the project doesn't exist, show a standard 404 page
  if (!project) {
    notFound();
  }

  // Pass the fetched project data to our interactive Client Component
  return <ProjectDetailsClient project={project} />;
}
