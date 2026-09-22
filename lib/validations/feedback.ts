import { z } from "zod";

export const feedbackFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(255).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

export type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;
