import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { shortLinkSchema } from "@/lib/validations/short-link";

function code(length = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = shortLinkSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const url = parsed.data.url;
  const supabase = await createClient();

  for (let attempt = 0; attempt < 5; attempt++) {
    const c = code();
    const { error } = await supabase
      .from("short_links")
      .insert({ code: c, original_url: url, user_id: null });
    if (error) {
      if (error.code === "23505") continue;
      return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
    }
    const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    return NextResponse.json({ code: c, shortUrl: `${base}/s/${c}` }, { status: 201 });
  }

  return NextResponse.json({ error: "Could not generate unique code" }, { status: 500 });
}