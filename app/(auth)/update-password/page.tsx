import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export const metadata: Metadata = {
  title: "Set a new password",
};

export default function UpdatePasswordPage() {
  return (
    <div className="rounded-[var(--radius-surface)] border border-border bg-surface p-6 sm:p-8">
      <h1 className="text-xl font-semibold text-foreground">Set a new password</h1>
      <p className="mt-1 text-sm text-foreground-muted">Choose a new password for your account.</p>
      <div className="mt-6">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
