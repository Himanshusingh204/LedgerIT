import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Profile } from "@/types/database";

export async function getProfile(supabase: SupabaseClient<Database>, userId: string): Promise<Profile> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error) throw error;
  return data;
}

export async function updateProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: Partial<Pick<Profile, "display_name" | "currency" | "timezone">>,
): Promise<Profile> {
  const { data, error } = await supabase.from("profiles").update(input).eq("id", userId).select().single();
  if (error) throw error;
  return data;
}
