import { z } from "zod";

export const budgetFormSchema = z.object({
  categoryId: z.string().uuid("Choose a category"),
  monthStart: z.string().regex(/^\d{4}-\d{2}-01$/, "Invalid month"),
  amount: z.coerce.number().positive("Budget must be greater than zero"),
});

export type BudgetFormValues = z.infer<typeof budgetFormSchema>;
