"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { profileFormSchema } from "@/lib/validations/profile";
import { updateProfile } from "@/lib/data/profile";

export interface ProfileActionState {
  status: "idle" | "error";
  message?: string;
}

export async function updateProfileAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const parsed = profileFormSchema.safeParse({
    displayName: formData.get("displayName"),
    currency: formData.get("currency"),
    timezone: formData.get("timezone"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid profile." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: "error", message: "Your session expired. Please sign in again." };
  }

  try {
    await updateProfile(supabase, user.id, {
      display_name: parsed.data.displayName,
      currency: parsed.data.currency,
      timezone: parsed.data.timezone,
    });
  } catch {
    return { status: "error", message: "Could not update your profile. Please try again." };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { status: "idle" };
}
