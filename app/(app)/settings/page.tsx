import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/data/profile";
import { listAccounts } from "@/lib/data/accounts";
import { listCategories } from "@/lib/data/categories";
import { ProfileForm } from "@/components/settings/profile-form";
import { AccountList } from "@/components/settings/account-list";
import { CategoryList } from "@/components/settings/category-list";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-danger">Your session expired. Please sign in again.</p>
      </div>
    );
  }

  let loadError = false;
  let profile: Awaited<ReturnType<typeof getProfile>> | null = null;
  let accounts: Awaited<ReturnType<typeof listAccounts>> = [];
  let categories: Awaited<ReturnType<typeof listCategories>> = [];

  try {
    [profile, accounts, categories] = await Promise.all([
      getProfile(supabase, user.id),
      listAccounts(supabase, user.id),
      listCategories(supabase),
    ]);
  } catch {
    loadError = true;
  }

  if (loadError || !profile) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-danger">
          Something went wrong loading your settings. Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-foreground">Settings</h1>

      <section className="mt-6 rounded-[var(--radius-surface)] border border-border bg-surface p-5">
        <h2 className="text-sm font-medium text-foreground-muted">Profile</h2>
        <div className="mt-4">
          <ProfileForm profile={profile} />
        </div>
      </section>

      <section className="mt-4">
        <AccountList accounts={accounts} />
      </section>

      <section className="mt-4">
        <CategoryList categories={categories} />
      </section>
    </div>
  );
}
