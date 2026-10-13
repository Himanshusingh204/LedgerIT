import { Hero } from "@/components/marketing/hero";
import { ProductTour } from "@/components/marketing/product-tour";
import { FeatureHighlights } from "@/components/marketing/feature-highlights";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Principles } from "@/components/marketing/principles";
import { PricingSection } from "@/components/marketing/pricing";
import { Faq, faqItems } from "@/components/marketing/faq";
import { FinalCta } from "@/components/marketing/final-cta";
import { FeedbackSection } from "@/components/marketing/feedback-section";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${baseUrl}/#webapp`,
      name: "Clearledger",
      applicationCategory: "FinanceApplication",
      operatingSystem: "All modern web browsers",
      description: "Track everyday spending, understand your habits, and manage budgets with confidence.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: "Clearledger",
      url: baseUrl,
      logo: `${baseUrl}/icon.png`,
    },
    {
      "@type": "FAQPage",
      "@id": `${baseUrl}/#faq`,
      mainEntity: faqItems.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function MarketingHomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero />
      <ProductTour />
      <FeatureHighlights />
      <HowItWorks />
      <Principles />
      <PricingSection />
      <Faq />
      <FinalCta />
      <FeedbackSection />
    </>
  );
}
