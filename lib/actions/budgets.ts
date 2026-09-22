"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { budgetFormSchema } from "@/lib/validations/budget";
import { deleteBudget, upsertBudget } from "@/lib/data/budgets";

export interface BudgetActionState {
  status: "idle" | "error";
  message?: string;
}

export async function setBudgetAction(
  _prevState: BudgetActionState,
  formData: FormData,
): Promise<BudgetActionState> {
  const parsed = budgetFormSchema.safeParse({
    categoryId: formData.get("categoryId"),
    monthStart: formData.get("monthStart"),
    amount: formData.get("amount"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid budget." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: "error", message: "Your session expired. Please sign in again." };
  }

  try {
    await upsertBudget(supabase, user.id, parsed.data.categoryId, parsed.data.monthStart, parsed.data.amount);
  } catch (error) {
    console.error("[action:budgets] upsertBudget failed", {
      userId: user.id,
      categoryId: parsed.data.categoryId,
      monthStart: parsed.data.monthStart,
      action: "upsertBudget",
      error: error instanceof Error ? error.message : String(error),
      ts: new Date().toISOString(),
    });
    return { status: "error", message: "Could not save the budget. Please try again." };
  }

  revalidatePath("/budgets");
  revalidatePath("/analytics");
  return { status: "idle" };
}

export async function deleteBudgetAction(id: string): Promise<void> {
  try {
    // Ownership of `id` is enforced by RLS (auth.uid() = user_id on the budgets table)
    const supabase = await createClient();
    await deleteBudget(supabase, id);
    revalidatePath("/budgets");
    revalidatePath("/analytics");
  } catch (error) {
    console.error("[action:budgets] deleteBudget failed", {
      budgetId: id,
      action: "deleteBudget",
      error: error instanceof Error ? error.message : String(error),
      ts: new Date().toISOString(),
    });
    throw error;
  }
}
