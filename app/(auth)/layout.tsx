import Link from "next/link";
import { Wallet, ShieldCheck, TrendingUp, Lock } from "lucide-react";

const FEATURES = [
  { icon: TrendingUp, text: "Track spending across every account in one place" },
  { icon: ShieldCheck, text: "Bank-grade encryption with row-level security" },
  { icon: Lock, text: "Your data stays private. Always." },
];

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left branded panel */}
      <aside className="relative hidden w-[42%] overflow-hidden lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a5c3f] via-[#1a4d3a] to-[#0d2818]" />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 20% 20%, rgba(201, 162, 39, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 80%, rgba(45, 122, 86, 0.20) 0%, transparent 50%)
            `,
          }}
        />
        <div aria-hidden="true" className="absolute inset-0 grain-overlay" />

        <div className="relative z-10 p-12">
          <Link href="/" className="inline-flex items-center gap-2.5 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/15 backdrop-blur-sm">
              <Wallet className="h-4.5 w-4.5" />
            </span>
            <span className="text-lg font-semibold tracking-tight">Clearledger</span>
          </Link>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center px-12 pb-8">
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight tracking-tight">
            Know where your money goes.
          </h2>
          <p className="mt-4 text-base text-white/70 max-w-sm leading-relaxed">
            Simple, honest expense tracking built for real life. No spreadsheets. No gimmicks.
          </p>

          <ul className="mt-10 space-y-5">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/12 backdrop-blur-sm">
                  <Icon className="h-4 w-4 text-[#c9a227]" />
                </span>
                <span className="text-sm text-white/85">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 p-12">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} Clearledger. All rights reserved.
          </p>
        </div>
      </aside>

      {/* Right form panel */}
      <main className="flex flex-1 flex-col">
        {/* Mobile header */}
        <header className="flex items-center justify-between px-6 py-5 lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2 font-semibold text-foreground">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Wallet className="h-4 w-4" />
            </span>
            Clearledger
          </Link>
          <Link href="/" className="text-sm text-foreground-muted hover:text-foreground">
            Back to home
          </Link>
        </header>

        <div className="flex flex-1 items-center justify-center px-6 pb-16 sm:px-10">
          <div className="w-full max-w-[420px]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
