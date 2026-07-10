/** @format */

export interface Project {
  id: string; // uuid, primary key
  owner_id: string; // uuid, foreign key referencing profiles
  title: string; // text, not null
  description: string | null; // text null
  project_type: string | null; // text null
  location: string | null; // text null
  budget_min: number | null; // integer null
  budget_max: number | null; // integer null
  timeline_start: string | null; // date null (returned as YYYY-MM-DD string)
  timeline_end: string | null; // date null (returned as YYYY-MM-DD string)
  status: string | null; // text null, default 'open'
  image_url: string | null; // text null
  created_at: string | null; // timestamp with time zone null (ISO string)
  trades: string | null;
  progress?: number; // Optional UI tracking field

  // This matches the Supabase aggregate relationship return shape
  proposals?: {
    count: number;
  }[];
}
