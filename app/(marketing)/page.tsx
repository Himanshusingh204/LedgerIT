import { Hero } from "@/components/marketing/hero";
import { ValueProps } from "@/components/marketing/value-props";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { FeatureHighlights } from "@/components/marketing/feature-highlights";
import { FinalCta } from "@/components/marketing/final-cta";

export default function MarketingHomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <HowItWorks />
      <FeatureHighlights />
      <FinalCta />
    </>
  );
}
