import type { SupabaseClient } from "@supabase/supabase-js";
import type { Budget, Database } from "@/types/database";

export async function listBudgetsForMonth(
  supabase: SupabaseClient<Database>,
  userId: string,
  monthStart: string,
): Promise<Budget[]> {
  const { data, error } = await supabase
    .from("budgets")
    .select("*")
    .eq("user_id", userId)
    .eq("month_start", monthStart);

  if (error) throw error;
  return data ?? [];
}

export async function upsertBudget(
  supabase: SupabaseClient<Database>,
  userId: string,
  categoryId: string,
  monthStart: string,
  amount: number,
): Promise<Budget> {
  const { data, error } = await supabase
    .from("budgets")
    .upsert(
      { user_id: userId, category_id: categoryId, month_start: monthStart, amount },
      { onConflict: "user_id,category_id,month_start" },
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteBudget(supabase: SupabaseClient<Database>, id: string): Promise<void> {
  const { error } = await supabase.from("budgets").delete().eq("id", id);
  if (error) throw error;
}
