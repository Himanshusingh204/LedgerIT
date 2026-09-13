import type { Metadata } from "next";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Create account",
};

export default function SignUpPage() {
  return (
    <div className="rounded-[var(--radius-surface)] border border-border bg-surface p-6 sm:p-8">
      <h1 className="text-xl font-semibold text-foreground">Create your account</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Start tracking your spending in a few minutes.
      </p>
      <div className="mt-6">
        <SignUpForm />
      </div>
    </div>
  );
}
