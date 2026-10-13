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
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">Create your account</h1>
      <p className="mt-2 text-sm text-foreground-muted">
        Start tracking your spending in a few minutes.
      </p>
      <div className="mt-8">
        <SignUpForm nonce={nonce} />
      </div>
    </div>
  );
}
