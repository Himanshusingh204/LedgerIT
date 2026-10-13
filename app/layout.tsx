import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import { ServiceWorkerRegistrar } from "@/components/shared/service-worker-registrar";

// Geist for display and UI; Geist Mono for every currency figure (tabular).
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0d12" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Clearledger: expense tracking and budgeting",
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
    title: "Clearledger: expense tracking and budgeting",
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
    title: "Clearledger: expense tracking and budgeting",
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
  // Reading the nonce here is what makes Next.js's CSP nonce pattern actually work, see
  // https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy.
  // Calling headers() also opts every route under this layout into dynamic rendering.
  await headers();

  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        {children}
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
