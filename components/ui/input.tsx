import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

export function Input({ className, hasError, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-[var(--radius-control)] border bg-surface px-3 text-sm text-foreground placeholder:text-foreground-muted transition-colors focus-visible:outline-none",
        hasError ? "border-danger" : "border-border focus-visible:border-primary",
        className,
      )}
      {...props}
    />
  );
}
