import { z } from "zod";

export const accountTypeSchema = z.enum(["cash", "bank", "debit_card", "credit_card", "other"]);

export const accountFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  type: accountTypeSchema,
  currency: z.string().length(3).default("USD"),
  lastFour: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "Enter exactly 4 digits")
    .optional()
    .or(z.literal("")),
  openingBalance: z.coerce.number().min(0).default(0),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;
