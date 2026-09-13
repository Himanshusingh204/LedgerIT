"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { accountFormSchema } from "@/lib/validations/account";
import { archiveAccount, createAccount } from "@/lib/data/accounts";

export interface AccountActionState {
  status: "idle" | "error";
  message?: string;
}

export async function createAccountAction(
  _prevState: AccountActionState,
  formData: FormData,
): Promise<AccountActionState> {
  const parsed = accountFormSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    currency: formData.get("currency") || undefined,
    lastFour: formData.get("lastFour") || undefined,
    openingBalance: formData.get("openingBalance") || undefined,
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid account." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: "error", message: "Your session expired. Please sign in again." };
  }

  try {
    await createAccount(supabase, user.id, {
      ...parsed.data,
      lastFour: parsed.data.lastFour || undefined,
    });
  } catch {
    return { status: "error", message: "Could not create the account. Please try again." };
  }

  revalidatePath("/settings");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return { status: "idle" };
}

export async function archiveAccountAction(id: string): Promise<void> {
  const supabase = await createClient();
  await archiveAccount(supabase, id);
  revalidatePath("/settings");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
}
