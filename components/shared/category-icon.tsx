import { Circle, type LucideIcon, icons } from "lucide-react";

function toPascalCase(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export function CategoryIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon: LucideIcon = icons[toPascalCase(icon) as keyof typeof icons] ?? Circle;
  return <Icon className={className} aria-hidden />;
}
