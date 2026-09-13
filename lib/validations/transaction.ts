import { z } from "zod";

export const transactionTypeSchema = z.enum(["expense", "income", "transfer"]);

export const transactionFormSchema = z.object({
  type: transactionTypeSchema,
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  accountId: z.string().uuid("Choose an account"),
  categoryId: z.string().uuid("Choose a category").nullable(),
  merchant: z.string().trim().max(120).optional(),
  note: z.string().trim().max(500).optional(),
  occurredAt: z.string().refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date"),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
