"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePasswordSchema, type UpdatePasswordValues } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UpdatePasswordForm() {
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordValues>({ resolver: zodResolver(updatePasswordSchema) });

  async function onSubmit(values: UpdatePasswordValues) {
    setFormError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: values.password });

    if (error) {
      setFormError(
        error.message.includes("session")
          ? "This reset link has expired. Request a new one from the sign-in page."
          : error.message,
      );
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div>
        <Label htmlFor="password">New password</Label>
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

      {formError ? (
        <p role="alert" aria-live="polite" className="text-sm text-danger">
          {formError}
        </p>
      ) : null}

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        Update password
      </Button>
    </form>
  );
}
