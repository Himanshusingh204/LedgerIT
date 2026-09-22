import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, PlatformStats, Profile, Category, SiteFeedback, AdminAuditLog } from "@/types/database";

export interface AdminUserListItem extends Profile {
  is_admin: boolean;
}

export async function isAdmin(supabase: SupabaseClient<Database>, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc("is_admin", { check_user_id: userId });
    if (error) throw error;
    return data ?? false;
  } catch (error) {
    console.error("[data:admin] isAdmin check failed", {
      userId,
      error: error instanceof Error ? error.message : String(error),
      ts: new Date().toISOString(),
    });
    return false;
  }
}

export async function getAdminPlatformStats(supabase: SupabaseClient<Database>): Promise<PlatformStats> {
  try {
    const { data, error } = await supabase.rpc("get_admin_stats");
    if (error) throw error;
    return (
      data ?? {
        user_count: 0,
        transaction_count: 0,
        feedback_count: 0,
        system_categories_count: 0,
        accounts_count: 0,
        budgets_count: 0,
        generated_at: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("[data:admin] getAdminPlatformStats failed", {
      error: error instanceof Error ? error.message : String(error),
      ts: new Date().toISOString(),
    });
    // Fallback safe defaults if RPC fails or local test
    return {
      user_count: 0,
      transaction_count: 0,
      feedback_count: 0,
      system_categories_count: 0,
      accounts_count: 0,
      budgets_count: 0,
      generated_at: new Date().toISOString(),
    };
  }
}

export async function listAdminUsers(supabase: SupabaseClient<Database>): Promise<AdminUserListItem[]> {
  try {
    // 1. Fetch profiles
    const { data: profiles, error: profileErr } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profileErr) throw profileErr;
    if (!profiles || profiles.length === 0) return [];

    // 2. Fetch admin user ids
    const { data: adminRows, error: adminErr } = await supabase
      .from("admin_users")
      .select("user_id");

    if (adminErr) throw adminErr;
    const adminSet = new Set((adminRows ?? []).map((row) => row.user_id));

    return profiles.map((p) => ({
      ...p,
      is_admin: adminSet.has(p.id),
    }));
  } catch (error) {
    console.error("[data:admin] listAdminUsers failed", {
      error: error instanceof Error ? error.message : String(error),
      ts: new Date().toISOString(),
    });
    return [];
  }
}

export async function listAdminSystemCategories(supabase: SupabaseClient<Database>): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .is("user_id", null)
      .order("kind", { ascending: true })
      .order("name", { ascending: true });

    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error("[data:admin] listAdminSystemCategories failed", {
      error: error instanceof Error ? error.message : String(error),
      ts: new Date().toISOString(),
    });
    return [];
  }
}

export async function listAdminFeedback(
  supabase: SupabaseClient<Database>,
  query?: string,
): Promise<SiteFeedback[]> {
  try {
    let builder = supabase
      .from("site_feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (query && query.trim()) {
      const q = query.trim();
      builder = builder.or(`name.ilike.%${q}%,email.ilike.%${q}%,message.ilike.%${q}%`);
    }

    const { data, error } = await builder;
    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error("[data:admin] listAdminFeedback failed", {
      query,
      error: error instanceof Error ? error.message : String(error),
      ts: new Date().toISOString(),
    });
    return [];
  }
}

export async function listAdminAuditLogs(
  supabase: SupabaseClient<Database>,
  limit: number = 30,
): Promise<AdminAuditLog[]> {
  try {
    const { data, error } = await supabase
      .from("admin_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  } catch (error) {
    console.error("[data:admin] listAdminAuditLogs failed", {
      error: error instanceof Error ? error.message : String(error),
      ts: new Date().toISOString(),
    });
    return [];
  }
}
