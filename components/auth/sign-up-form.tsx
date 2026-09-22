"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { signUpSchema, type SignUpValues } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    onTurnstileVerify?: (token: string) => void;
    onTurnstileExpire?: () => void;
  }
}

export function SignUpForm({ nonce }: { nonce?: string }) {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({ resolver: zodResolver(signUpSchema) });

  // Turnstile calls these by name (data-callback/data-expired-callback), so they have to live on
  // window rather than as plain React closures — the widget is rendered outside React's control.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    window.onTurnstileVerify = (token: string) => setCaptchaToken(token);
    window.onTurnstileExpire = () => setCaptchaToken(null);
    return () => {
      delete window.onTurnstileVerify;
      delete window.onTurnstileExpire;
    };
  }, []);

  async function onSubmit(values: SignUpValues) {
    setFormError(null);

    if (TURNSTILE_SITE_KEY && !captchaToken) {
      setFormError("Please complete the verification challenge.");
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: { display_name: values.displayName },
        emailRedirectTo: `${window.location.origin}/callback`,
        captchaToken: captchaToken ?? undefined,
      },
    });

    if (error) {
      setFormError(
        error.message.includes("already registered")
          ? "An account with this email already exists."
          : error.message,
      );
      return;
    }

    // Supabase returns a live session immediately when email confirmation is disabled (e.g. this
    // project's local stack) — in that case there's nothing to "check email" for, so go straight
    // in instead of showing a confirmation screen that would never resolve.
    if (data.session) {
      router.replace("/dashboard");
      router.refresh();
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
          We sent a confirmation link to <span className="font-medium text-foreground">{submittedEmail}</span>.
          Confirm your address to finish creating your account.
        </p>
        <Link
          href="/sign-in"
          className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <Label htmlFor="displayName">Name</Label>
        <Input
          id="displayName"
          type="text"
          autoComplete="name"
          hasError={!!errors.displayName}
          aria-invalid={!!errors.displayName}
          aria-describedby={errors.displayName ? "displayName-error" : undefined}
          {...register("displayName")}
        />
        {errors.displayName ? (
          <p id="displayName-error" className="mt-1.5 text-sm text-danger">
            {errors.displayName.message}
          </p>
        ) : null}
      </div>

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

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          hasError={!!errors.password}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "password-error" : undefined}
          {...register("password")}
        />
        {errors.password ? (
          <p id="password-error" className="mt-1.5 text-sm text-danger">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      {TURNSTILE_SITE_KEY ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer nonce={nonce} />
          <div
            className="cf-turnstile"
            data-sitekey={TURNSTILE_SITE_KEY}
            data-callback="onTurnstileVerify"
            data-expired-callback="onTurnstileExpire"
          />
        </>
      ) : null}

      {formError ? (
        <p role="alert" aria-live="polite" className="text-sm text-danger">
          {formError}
        </p>
      ) : null}

      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={!!TURNSTILE_SITE_KEY && !captchaToken}
        className="w-full"
      >
        Create account
      </Button>

      <p className="text-center text-sm text-foreground-muted">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
