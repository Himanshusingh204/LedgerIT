import type { Metadata } from "next";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default async function SignInPage({
  searchParams,
}: PageProps<"/sign-in">) {
  const params = await searchParams;
  const redirectToParam = params.redirectTo;
  const redirectTo = typeof redirectToParam === "string" ? redirectToParam : "/dashboard";
  const hasCallbackError = params.error === "auth-callback-failed";

  return (
    <div className="rounded-[var(--radius-surface)] border border-border bg-surface p-6 sm:p-8">
      <h1 className="text-xl font-semibold text-foreground">Welcome back</h1>
      <p className="mt-1 text-sm text-foreground-muted">Sign in to continue to your dashboard.</p>
      {hasCallbackError ? (
        <p role="alert" className="mt-4 rounded-[var(--radius-control)] bg-danger/10 px-3 py-2 text-sm text-danger">
          That confirmation link is no longer valid. Please sign in or request a new one.
        </p>
      ) : null}
      <div className="mt-6">
        <SignInForm redirectTo={redirectTo} />
      </div>
    </div>
  );
}
