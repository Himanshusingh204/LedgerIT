"use server";

import { revalidatePath } from "next/cache";
import type { ZodError } from "zod";
import { createClient } from "@/lib/supabase/server";
import { transactionFormSchema } from "@/lib/validations/transaction";
import { createTransaction, deleteTransaction, updateTransaction } from "@/lib/data/transactions";
import { uploadReceipt } from "@/lib/data/receipts";

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
    const receiptUrl = await uploadReceiptIfProvided(supabase, user.id, formData);
    await createTransaction(supabase, user.id, { ...parsed.data, receiptUrl });
  } catch (error) {
    console.error("[action:transactions] createTransaction failed", {
      userId: user.id,
      action: "createTransaction",
      error: error instanceof Error ? error.message : String(error),
      ts: new Date().toISOString(),
    });
    return { status: "error", message: receiptErrorMessage(error) };
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

  // Ownership of `id` is enforced by RLS (auth.uid() = user_id on the transactions table), not by
  // an explicit check here — do not "optimize" this by switching to a service-role client, which
  // would bypass that check silently.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: "error", message: "Your session expired. Please sign in again." };
  }

  try {
    const receiptUrl = await uploadReceiptIfProvided(supabase, user.id, formData);
    await updateTransaction(supabase, id, { ...parsed.data, receiptUrl });
  } catch (error) {
    console.error("[action:transactions] updateTransaction failed", {
      userId: user.id,
      transactionId: id,
      action: "updateTransaction",
      error: error instanceof Error ? error.message : String(error),
      ts: new Date().toISOString(),
    });
    return { status: "error", message: receiptErrorMessage(error) };
  }

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  return { status: "idle" };
}

export async function deleteTransactionAction(id: string): Promise<void> {
  try {
    // Ownership of `id` is enforced by RLS, same as updateTransactionAction above.
    const supabase = await createClient();
    await deleteTransaction(supabase, id);
    revalidatePath("/transactions");
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("[action:transactions] deleteTransaction failed", {
      transactionId: id,
      action: "deleteTransaction",
      error: error instanceof Error ? error.message : String(error),
      ts: new Date().toISOString(),
    });
    throw error;
  }
}

function flattenFieldErrors(error: ZodError) {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !result[key]) result[key] = issue.message;
  }
  return result;
}

/** Empty file inputs still submit a zero-byte File in FormData — size>0 is how "no file chosen" is told apart from a real upload. */
async function uploadReceiptIfProvided(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  formData: FormData,
): Promise<string | undefined> {
  const file = formData.get("receipt");
  if (!(file instanceof File) || file.size === 0) return undefined;
  return uploadReceipt(supabase, userId, file);
}

function receiptErrorMessage(error: unknown): string {
  // uploadReceipt throws a plain Error with a user-facing message for validation failures
  // (wrong type, too large) — everything else (a real DB/storage error) gets a generic message,
  // same as every other catch block in this file.
  if (error instanceof Error && (error.message.includes("JPEG") || error.message.includes("5 MB"))) {
    return error.message;
  }
  return "Could not save the transaction. Please try again.";
}
