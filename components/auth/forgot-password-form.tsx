"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });

  async function onSubmit(values: ForgotPasswordValues) {
    setFormError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/callback?redirectTo=/update-password`,
    });

    if (error) {
      setFormError(error.message);
      return;
    }

    setSubmittedEmail(values.email);
  }

  if (submittedEmail) {
    return (
      <div className="rounded-[var(--radius-surface)] border border-border bg-surface p-6 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-surface-muted">
          <MailCheck className="h-6 w-6 text-primary" aria-hidden />
        </div>
        <h1 className="mt-4 text-lg font-semibold text-foreground">Check your email</h1>
        <p className="mt-2 text-sm text-foreground-muted">
          If an account exists for <span className="font-medium text-foreground">{submittedEmail}</span>, we sent a
          link to reset your password.
        </p>
        <Link href="/sign-in" className="mt-6 inline-block text-sm font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          hasError={!!errors.email}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          {...register("email")}
        />
        {errors.email ? (
          <p id="email-error" className="mt-1.5 text-sm text-danger">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      {formError ? (
        <p role="alert" aria-live="polite" className="text-sm text-danger">
          {formError}
        </p>
      ) : null}

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Send reset link
      </Button>

      <p className="text-center text-sm text-foreground-muted">
        <Link href="/sign-in" className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
