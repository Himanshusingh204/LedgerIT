import { z } from "zod";

export const categoryKindSchema = z.enum(["expense", "income"]);

export const categoryFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60),
  kind: categoryKindSchema,
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;
