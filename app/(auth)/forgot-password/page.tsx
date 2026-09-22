import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Reset your Clearledger password and regain access to your expense tracking account.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="rounded-[var(--radius-surface)] border border-border bg-surface p-6 sm:p-8">
      <h1 className="text-xl font-semibold text-foreground">Reset your password</h1>
      <p className="mt-1 text-sm text-foreground-muted">
        Enter your email and we&apos;ll send you a link to set a new password.
      </p>
      <div className="mt-6">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
