import type { SupabaseClient } from "@supabase/supabase-js";
import type { Category, CategoryKind, Database } from "@/types/database";

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

function slugify(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface CreateCategoryInput {
  name: string;
  kind: CategoryKind;
}

export async function createCategory(
  supabase: SupabaseClient<Database>,
  userId: string,
  input: CreateCategoryInput,
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      user_id: userId,
      name: input.name,
      slug: slugify(input.name),
      kind: input.kind,
      icon: "circle",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCategory(
  supabase: SupabaseClient<Database>,
  id: string,
  name: string,
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .update({ name, slug: slugify(name) })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function archiveCategory(supabase: SupabaseClient<Database>, id: string): Promise<void> {
  const { error } = await supabase.from("categories").update({ is_archived: true }).eq("id", id);
  if (error) throw error;
}
