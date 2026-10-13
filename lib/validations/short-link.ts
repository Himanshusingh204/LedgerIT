import { z } from "zod";

export const shortLinkSchema = z.object({
  url: z.string().url().max(2048),
  code: z.string().regex(/^[a-zA-Z0-9]{4,12}$/).optional(),
});

export type ShortLinkInput = z.infer<typeof shortLinkSchema>;

export function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}