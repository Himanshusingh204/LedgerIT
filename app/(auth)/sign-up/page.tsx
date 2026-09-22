import type { Metadata } from "next";
import { headers } from "next/headers";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a free Clearledger account to start tracking everyday spending, managing budgets, and organizing household finances.",
};

export default async function SignUpPage() {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return (
    <div className="rounded-[var(--radius-surface)] border border-border bg-surface p-6 sm:p-8">
      <h1 className="text-xl font-semibold text-foreground">Create your account</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Start tracking your spending in a few minutes.
      </p>
      <div className="mt-6">
        <SignUpForm nonce={nonce} />
      </div>
    </div>
  );
}
