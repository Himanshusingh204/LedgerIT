import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

// Typography matches the Ledger-style financial-dashboard mockup: Hanken Grotesk for headings/body,
// JetBrains Mono for all numeric/currency figures (tabular ledger look).
const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f9fc" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f17" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Clearledger — Simple, Honest Expense Tracking & Budgeting",
    template: "%s | Clearledger",
  },
  description:
    "Track everyday expenses, understand your spending habits, and make financial decisions with confidence. Fast, secure, and private personal finance tracking.",
  applicationName: "Clearledger",
  authors: [{ name: "Clearledger Team" }],
  creator: "Clearledger",
  publisher: "Clearledger",
  category: "finance",
  keywords: [
    "expense tracker",
    "budgeting app",
    "personal finance",
    "money management",
    "spending tracker",
    "financial ledger",
    "receipt tracker",
    "household budget",
    "CSV expense export",
  ],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Clearledger — Simple, Honest Expense Tracking & Budgeting",
    description:
      "Track everyday expenses, understand your spending habits, and make financial decisions with confidence.",
    url: "/",
    siteName: "Clearledger",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/dashboard-overview.png",
        width: 1200,
        height: 630,
        alt: "Clearledger Financial Dashboard Overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clearledger — Simple, Honest Expense Tracking & Budgeting",
    description:
      "Track everyday expenses, understand your spending habits, and make financial decisions with confidence.",
    creator: "@clearledger",
    images: ["/images/dashboard-overview.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "US-NY",
    "geo.placename": "New York",
    "geo.position": "40.7128;-74.0060",
    "ICBM": "40.7128, -74.0060",
    "DC.title": "Clearledger",
    "geo.country": "US",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Reading the nonce here is what makes Next.js's CSP nonce pattern actually work — see
  // https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy.
  // Calling headers() also opts every route under this layout into dynamic rendering.
  await headers();

  return (
    <html lang="en" className={`${hankenGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
