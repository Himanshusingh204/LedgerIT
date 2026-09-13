import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const variantClasses = {
  primary: "bg-primary text-primary-foreground shadow-sm hover:opacity-90",
  ghost: "text-foreground-muted hover:bg-surface-muted hover:text-foreground",
  outline: "border border-border bg-surface text-foreground hover:bg-surface-muted",
} as const;

const sizeClasses = {
  md: "h-10 px-4",
  sm: "h-9 px-3",
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  isLoading?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] text-sm font-medium transition-opacity disabled:pointer-events-none disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
}
