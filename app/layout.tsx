import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Clearledger — Know where your money is going",
    template: "%s · Clearledger",
  },
  description:
    "Track everyday spending, understand your habits, and make the next decision with confidence.",
  openGraph: {
    title: "Clearledger — Know where your money is going",
    description:
      "Track everyday spending, understand your habits, and make the next decision with confidence.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
