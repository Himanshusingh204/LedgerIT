import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata: Metadata = {
  title: {
    template: "%s | LedgerIT Admin",
    default: "Admin Portal | LedgerIT",
  },
  description: "Enterprise administration, platform telemetry, user management, and feedback triage for LedgerIT.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AdminShell userEmail={user?.email}>{children}</AdminShell>;
}
