import { defineConfig } from "vitest/config";
import { loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  // Unlike Next.js, Vite/Vitest don't auto-load .env.local — needed so
  // tests/integration/*.test.ts can see NEXT_PUBLIC_SUPABASE_URL etc. and actually run against the
  // local Supabase stack instead of silently skipping (see CLAUDE.md §9 to start that stack).
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.test.tsx", "tests/integration/**/*.test.ts"],
    env: loadEnv("", process.cwd(), ""),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
