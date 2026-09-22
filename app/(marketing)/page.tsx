import { Hero } from "@/components/marketing/hero";
import { ProductShowcase } from "@/components/marketing/product-showcase";
import { ValueProps } from "@/components/marketing/value-props";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { FeatureHighlights } from "@/components/marketing/feature-highlights";
import { PricingSection } from "@/components/marketing/pricing";
import { Testimonials } from "@/components/marketing/testimonials";
import { FinalCta } from "@/components/marketing/final-cta";
import { FeedbackSection } from "@/components/marketing/feedback-section";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${baseUrl}/#webapp`,
      "name": "Clearledger",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All modern web browsers",
      "description":
        "Track everyday spending, understand your habits, and manage budgets with confidence.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "featureList": [
        "Full transaction ledger",
        "Category spending breakdowns",
        "Monthly budget status & progress bars",
        "Multiple accounts management",
        "CSV export with custom filters",
        "Receipt image uploads",
      ],
    },
    {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": "Clearledger",
      "url": baseUrl,
      "logo": `${baseUrl}/icon.png`,
    },
    {
      "@type": "FAQPage",
      "@id": `${baseUrl}/#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is Clearledger really free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes. Clearledger offers unlimited transactions, accounts, and budgets completely free with no hidden charges or ads.",
          },
        },
        {
          "@type": "Question",
          "name": "Is my financial data secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Clearledger uses Postgres Row-Level Security (RLS) and strong encryption so only you can access your transactions and accounts.",
          },
        },
        {
          "@type": "Question",
          "name": "Can I export my transactions for tax purposes?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Yes. Clearledger includes full CSV export that respects your active date, category, and account filters.",
          },
        },
      ],
    },
  ],
};

export default function MarketingHomePage() {
  return (
    <>
      {/* Structured data for Search Engines (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <ProductShowcase />
      <ValueProps />
      <HowItWorks />
      <FeatureHighlights />
      <PricingSection />
      <Testimonials />
      <FinalCta />
      <FeedbackSection />
    </>
  );
}
