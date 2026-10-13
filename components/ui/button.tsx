import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

const variantClasses = {
  primary: "bg-primary hover:bg-primary-light text-primary-foreground shadow-sm font-semibold active:scale-[0.98]",
  ghost: "text-foreground-muted hover:bg-surface-muted hover:text-foreground active:scale-[0.98]",
  outline: "border border-border bg-surface text-foreground hover:bg-surface-muted active:scale-[0.98]",
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
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] text-sm font-medium transition-[transform,background-color,opacity] duration-200 disabled:pointer-events-none disabled:opacity-60",
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
