import type { Metadata } from "next";
import { PricingSection } from "@/components/marketing/pricing";
import { Faq } from "@/components/marketing/faq";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Clearledger is free. One plan, every feature, no ads.",
};

export default function PricingPage() {
  return (
    <>
      <div className="gradient-mesh pt-20 sm:pt-28" />
      <PricingSection />
      <Faq />
    </>
  );
}
