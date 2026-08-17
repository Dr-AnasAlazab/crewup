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

export interface Profile {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: "contractor" | "subcontractor";
  company_name: string | null;
  location: string | null;
  bio: string | null;
  website: string | null;
  created_at: string;
}

export interface SubcontractorUI extends Profile {
  trades: string[];
  is_licensed: boolean;
  is_insured: boolean;
  is_bonded: boolean;
  years_in_business: number;
  available_now: string;
  rating: number;
  review_count: number;
  portfolio_images: string[];
}
export interface GetSubcontractorsResponse {
  contractors: SubcontractorUI[];
  totalCount: number;
}

export interface FindContractorsPageParams {
  trade: string[];
  location: string;
  licensed: boolean;
  insured: boolean;
  bonded: boolean;
  rating: string;
  yearsInBusiness: number;
  availableNow: boolean;
  availableForUpcomingProjects: boolean;
  page: number;
  pageSize: number;
  search: string;
}

export interface ParticipantUI {
  id: string;
  first_name: string;
  last_name: string;
  company_name: string | null;
  avatar_url: string | null;
  is_online?: boolean; // For future realtime presence
}

export interface AttachmentUI {
  id: string;
  file_name: string;
  file_size: number; // in bytes
  file_url: string;
  file_type: string;
}

export interface MessageUI {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string | null;
  created_at: string;
  is_read: boolean;
  sender: ParticipantUI;
  attachments?: AttachmentUI[];
}

export interface ConversationUI {
  id: string;
  participant: ParticipantUI;
  latest_message: Pick<MessageUI, "text" | "created_at" | "sender_id"> | null;
  unread_count: number;
  updated_at: string;
}
