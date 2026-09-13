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
  } catch {
    return { status: "error", message: "Could not save the budget. Please try again." };
  }

  revalidatePath("/budgets");
  revalidatePath("/analytics");
  return { status: "idle" };
}

export async function deleteBudgetAction(id: string): Promise<void> {
  // Ownership of `id` is enforced by RLS (auth.uid() = user_id on the budgets table), not by an
  // explicit check here — do not "optimize" this by switching to a service-role client, which
  // would bypass that check silently.
  const supabase = await createClient();
  await deleteBudget(supabase, id);
  revalidatePath("/budgets");
  revalidatePath("/analytics");
}
