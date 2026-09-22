import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export async function isAdmin(supabase: SupabaseClient<Database>, userId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_admin", { check_user_id: userId });
  if (error) throw error;
  return data ?? false;
}
