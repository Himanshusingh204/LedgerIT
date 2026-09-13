import type { SupabaseClient } from "@supabase/supabase-js";
import type { Category, Database } from "@/types/database";

/** RLS already restricts results to system categories (user_id null) plus the caller's own. */
export async function listCategories(supabase: SupabaseClient<Database>): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_archived", false)
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
