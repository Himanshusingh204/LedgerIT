import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const BUCKET = "receipts";
const SIGNED_URL_TTL_SECONDS = 60;

export const RECEIPT_MAX_BYTES = 5 * 1024 * 1024;
export const RECEIPT_ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"] as const;

function extensionFor(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "application/pdf":
      return "pdf";
    default:
      return "bin";
  }
}

/**
 * Uploads a receipt to the private `receipts` bucket and returns the storage PATH (not a URL) —
 * that's what's saved in transactions.receipt_url. Bucket-level `allowed_mime_types`/
 * `file_size_limit` (supabase/migrations/0005_receipts_storage.sql) are the real enforcement;
 * this also checks client-side-controllable values before the upload so a rejected file fails
 * fast with a clear reason instead of a generic storage error.
 */
export async function uploadReceipt(
  supabase: SupabaseClient<Database>,
  userId: string,
  file: File,
): Promise<string> {
  if (!RECEIPT_ALLOWED_MIME_TYPES.includes(file.type as (typeof RECEIPT_ALLOWED_MIME_TYPES)[number])) {
    throw new Error("Receipts must be a JPEG, PNG, WEBP, or PDF file.");
  }
  if (file.size > RECEIPT_MAX_BYTES) {
    throw new Error("Receipts must be under 5 MB.");
  }

  const path = `${userId}/${crypto.randomUUID()}.${extensionFor(file.type)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
  if (error) throw error;

  return path;
}

export async function deleteReceipt(supabase: SupabaseClient<Database>, path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}

/** Never store or reuse this URL — it's generated fresh on demand and expires quickly (docs/02 §7: "Generate temporary signed URLs only when needed"). */
export async function getReceiptSignedUrl(supabase: SupabaseClient<Database>, path: string): Promise<string> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL_SECONDS);
  if (error) throw error;
  return data.signedUrl;
}
