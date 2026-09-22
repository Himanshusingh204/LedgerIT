"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { categoryFormSchema } from "@/lib/validations/category";
import { archiveCategory, createCategory, updateCategory } from "@/lib/data/categories";

export interface CategoryActionState {
  status: "idle" | "error";
  message?: string;
}

export async function createCategoryAction(
  _prevState: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const parsed = categoryFormSchema.safeParse({
    name: formData.get("name"),
    kind: formData.get("kind"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid category." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { status: "error", message: "Your session expired. Please sign in again." };
  }

  try {
    await createCategory(supabase, user.id, parsed.data);
  } catch (error) {
    console.error("[action:categories] createCategory failed", {
      userId: user.id,
      name: parsed.data.name,
      action: "createCategory",
      error: error instanceof Error ? error.message : String(error),
      ts: new Date().toISOString(),
    });
    return { status: "error", message: "Could not create the category. You may already have one with this name." };
  }

  revalidatePath("/settings");
  revalidatePath("/transactions");
  revalidatePath("/budgets");
  return { status: "idle" };
}

export async function renameCategoryAction(id: string, name: string): Promise<void> {
  try {
    const supabase = await createClient();
    await updateCategory(supabase, id, name);
    revalidatePath("/settings");
    revalidatePath("/transactions");
    revalidatePath("/budgets");
  } catch (error) {
    console.error("[action:categories] renameCategory failed", {
      categoryId: id,
      name,
      action: "renameCategory",
      error: error instanceof Error ? error.message : String(error),
      ts: new Date().toISOString(),
    });
    throw error;
  }
}

export async function archiveCategoryAction(id: string): Promise<void> {
  try {
    const supabase = await createClient();
    await archiveCategory(supabase, id);
    revalidatePath("/settings");
    revalidatePath("/transactions");
    revalidatePath("/budgets");
  } catch (error) {
    console.error("[action:categories] archiveCategory failed", {
      categoryId: id,
      action: "archiveCategory",
      error: error instanceof Error ? error.message : String(error),
      ts: new Date().toISOString(),
    });
    throw error;
  }
}
