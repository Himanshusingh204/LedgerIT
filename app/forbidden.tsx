import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Forbidden() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-danger/10 text-danger">
        <ShieldX className="h-6 w-6" aria-hidden />
      </span>
      <div>
        <h1 className="text-lg font-semibold text-foreground">Access forbidden</h1>
        <p className="mt-1 text-sm text-foreground-muted">
          You do not have permission to view this page. Sign in with an authorized account or go back home.
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/sign-in">
          <Button variant="primary">Sign in</Button>
        </Link>
        <Link href="/">
          <Button variant="ghost">Back to home</Button>
        </Link>
      </div>
    </div>
  );
}