"use server";

import { createClient } from "@/lib/supabase/server";
import { feedbackFormSchema } from "@/lib/validations/feedback";
import { createFeedback } from "@/lib/data/feedback";

export interface FeedbackActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function submitFeedbackAction(
  _prevState: FeedbackActionState,
  formData: FormData,
): Promise<FeedbackActionState> {
  const parsed = feedbackFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid feedback." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    await createFeedback(supabase, {
      name: parsed.data.name,
      email: parsed.data.email || undefined,
      message: parsed.data.message,
      userId: user?.id,
    });
  } catch (error) {
    console.error("[action:feedback] submitFeedback failed", {
      userId: user?.id,
      name: parsed.data.name,
      action: "createFeedback",
      error: error instanceof Error ? error.message : String(error),
      ts: new Date().toISOString(),
    });
    return { status: "error", message: "Could not send your feedback. Please try again." };
  }

  return { status: "success", message: "Thanks — we read every message." };
}
