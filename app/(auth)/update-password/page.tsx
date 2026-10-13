import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export const metadata: Metadata = {
  title: "Set a new password",
};

export default function UpdatePasswordPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Set a new password</h1>
      <p className="mt-2 text-sm text-foreground-muted">Choose a new password for your account.</p>
      <div className="mt-8">
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
