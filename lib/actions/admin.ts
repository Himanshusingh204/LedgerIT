"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/data/admin";

export interface AdminActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function deleteFeedbackAction(feedbackId: string): Promise<AdminActionState> {
  if (!feedbackId || typeof feedbackId !== "string") {
    return { status: "error", message: "Invalid feedback ID." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: "Unauthorized. Please sign in." };
  }

  const adminAuthorized = await isAdmin(supabase, user.id);
  if (!adminAuthorized) {
    return { status: "error", message: "Forbidden: Admin privileges required." };
  }

  try {
    const { error } = await supabase
      .from("site_feedback")
      .delete()
      .eq("id", feedbackId);

    if (error) throw error;

    // Record audit event
    try {
      await supabase.from("admin_audit_logs").insert({
        admin_user_id: user.id,
        action: "delete_feedback",
        target_type: "site_feedback",
        target_id: feedbackId,
        metadata: { deleted_by: user.email ?? user.id },
      });
    } catch {
      // Non-blocking telemetry
    }

    revalidatePath("/admin");
    revalidatePath("/admin/feedback");
    return { status: "success", message: "Feedback removed successfully." };
  } catch (error) {
    console.error("[action:admin] deleteFeedbackAction failed", {
      adminUserId: user.id,
      feedbackId,
      error: error instanceof Error ? error.message : String(error),
      ts: new Date().toISOString(),
    });
    return { status: "error", message: "Failed to delete feedback." };
  }
}
