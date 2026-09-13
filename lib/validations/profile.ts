import { z } from "zod";

export const profileFormSchema = z.object({
  displayName: z.string().trim().min(1, "Name is required").max(80),
  currency: z.string().trim().length(3, "Use a 3-letter currency code").toUpperCase(),
  timezone: z.string().trim().min(1, "Timezone is required"),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
