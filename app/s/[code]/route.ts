import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("short_links")
    .select("original_url")
    .eq("code", code)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.redirect(new URL("/not-found", process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"));
  }

  try {
    await supabase.rpc("increment_short_link_hits", { p_code: code });
  } catch {
    /* best-effort hit counting */
  }

  return NextResponse.redirect(data.original_url, 302);
}