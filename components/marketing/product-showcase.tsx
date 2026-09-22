import { ProductCarousel } from "@/components/marketing/product-carousel";

export function ProductShowcase() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Four screens, one habit
        </h2>
        <p className="mt-4 text-base text-foreground-muted">
          The same real transaction data, viewed the way you actually need it that day.
        </p>
      </div>
      <div className="mt-12 flex justify-center">
        <ProductCarousel />
      </div>
    </section>
  );
}
