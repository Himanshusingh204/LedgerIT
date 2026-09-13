"use server";

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";
import { createClient } from "@/lib/supabase/server";
import { transactionFormSchema } from "@/lib/validations/transaction";
import { createTransaction, deleteTransaction, updateTransaction } from "@/lib/data/transactions";

export interface TransactionActionState {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
}

function parseFormValues(formData: FormData) {
  const categoryId = formData.get("categoryId");
  return transactionFormSchema.safeParse({
    type: formData.get("type"),
    amount: formData.get("amount"),
    accountId: formData.get("accountId"),
    categoryId: categoryId ? categoryId : null,
    merchant: formData.get("merchant") || undefined,
    note: formData.get("note") || undefined,
    occurredAt: formData.get("occurredAt"),
  });
}

export async function createTransactionAction(
  _prevState: TransactionActionState,
  formData: FormData,
): Promise<TransactionActionState> {
  const parsed = parseFormValues(formData);
  if (!parsed.success) {
    return { status: "error", fieldErrors: flattenFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: "error", message: "Your session expired. Please sign in again." };
  }

  try {
    await createTransaction(supabase, user.id, parsed.data);
  } catch {
    return { status: "error", message: "Could not save the transaction. Please try again." };
  }

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return { status: "idle" };
}

export async function updateTransactionAction(
  id: string,
  _prevState: TransactionActionState,
  formData: FormData,
): Promise<TransactionActionState> {
  const parsed = parseFormValues(formData);
  if (!parsed.success) {
    return { status: "error", fieldErrors: flattenFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  try {
    await updateTransaction(supabase, id, parsed.data);
  } catch {
    return { status: "error", message: "Could not save the transaction. Please try again." };
  }

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return { status: "idle" };
}

export async function deleteTransactionAction(id: string): Promise<void> {
  const supabase = await createClient();
  await deleteTransaction(supabase, id);
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
}

function flattenFieldErrors(error: ZodError) {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !result[key]) result[key] = issue.message;
  }
  return result;
}
