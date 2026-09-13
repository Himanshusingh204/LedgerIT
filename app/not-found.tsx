import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-surface-muted text-foreground-muted">
        <Compass className="h-6 w-6" aria-hidden />
      </span>
      <div>
        <h1 className="text-lg font-semibold text-foreground">Page not found</h1>
        <p className="mt-1 text-sm text-foreground-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      </div>
      <Link href="/" className="text-sm font-medium text-primary hover:underline">
        Back to home
      </Link>
    </div>
  );
}
