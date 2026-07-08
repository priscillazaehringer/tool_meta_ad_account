import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  // Only warn at runtime, not during build
  if (typeof window === "undefined" && process.env.NODE_ENV !== "production") {
    console.warn(
      "Supabase env vars missing. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }
}

export const supabaseAdmin = createClient(url ?? "", serviceKey ?? "", {
  auth: { persistSession: false },
});

export type MetaSetupRow = {
  id: string;
  email: string;
  last_name: string;
  first_name: string;
  current_step: number;
  q1_answer: string | null;
  q2_answer: string | null;
  q3_answer: string | null;
  q4_answer: string | null;
  q5_completed_at: string | null;
  q6_completed_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};
