import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClientComponentClient();

// Database types
export type Job = {
  id: string;
  company: string;
  position: string;
  date_applied: string;
  status: 'not_applied' | 'applied' | 'interviewing' | 'offer' | 'rejected';
  notes?: string;
  created_at: string;
  user_id: string;
};

export type Connection = {
  id: string;
  name: string;
  company: string;
  position: string;
  reach_out_status: 'not_contacted' | 'contacted' | 'responded' | 'meeting_scheduled' | 'met';
  profile_link?: string;
  priority: number;
  notes?: string;
  created_at: string;
  user_id: string;
};

export type DailyGoal = {
  id: string;
  title: string;
  type: 'job_applications' | 'networking' | 'other';
  target_count: number;
  current_count: number;
  linked_items?: string[];
  date: string;
  completed: boolean;
  created_at: string;
  user_id: string;
}; 