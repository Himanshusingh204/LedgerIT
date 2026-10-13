"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface DeleteAccountState {
  status: "idle" | "error";
  message?: string;
}

const BUCKET = "receipts";
const PAGE = 1000;

/**
 * Permanently deletes the signed-in user. Order matters:
 *  1. Remove receipt files from Storage (not covered by DB cascades), using the
 *     user's own session so RLS limits deletes to their folder.
 *  2. Delete the auth user with the service role. profiles → accounts, transactions,
 *     budgets, categories, admins and feedback cascade from there.
 */
export async function deleteAccountAction(
  _prevState: DeleteAccountState,
  formData: FormData,
): Promise<DeleteAccountState> {
  if (formData.get("confirm") !== "DELETE") {
    return { status: "error", message: 'Type DELETE in the box to confirm.' };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: "error", message: "Your session expired. Please sign in again." };
  }

  try {
    for (;;) {
      const { data: files, error: listError } = await supabase.storage
        .from(BUCKET)
        .list(user.id, { limit: PAGE });
      if (listError) throw listError;
      if (!files || files.length === 0) break;

      const { error: removeError } = await supabase.storage
        .from(BUCKET)
        .remove(files.map((f) => `${user.id}/${f.name}`));
      if (removeError) throw removeError;
      if (files.length < PAGE) break;
    }

    const admin = createAdminClient();
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
    if (deleteError) throw deleteError;
  } catch {
    return { status: "error", message: "We could not delete your account. Please try again." };
  }

  await supabase.auth.signOut();
  redirect("/?account=deleted");
}
