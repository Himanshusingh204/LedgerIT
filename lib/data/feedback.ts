import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, SiteFeedback } from "@/types/database";

export interface CreateFeedbackInput {
  name: string;
  email?: string;
  message: string;
  userId?: string;
}

export async function createFeedback(
  supabase: SupabaseClient<Database>,
  input: CreateFeedbackInput,
): Promise<void> {
  const { error } = await supabase.from("site_feedback").insert({
    name: input.name,
    email: input.email || null,
    message: input.message,
    user_id: input.userId ?? null,
  });
  if (error) throw error;
}

export async function listFeedback(supabase: SupabaseClient<Database>): Promise<SiteFeedback[]> {
  const { data, error } = await supabase
    .from("site_feedback")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}
