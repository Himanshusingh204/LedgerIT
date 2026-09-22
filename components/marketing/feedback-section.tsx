import { FeedbackForm } from "@/components/marketing/feedback-form";

export function FeedbackSection() {
  return (
    <section id="feedback" className="border-y border-border bg-surface">
      <div className="mx-auto max-w-[720px] px-4 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Tell us what&apos;s missing
          </h2>
          <p className="mt-4 text-base text-foreground-muted">
            No support ticket queue, no bot — messages here go straight to the person building
            this.
          </p>
        </div>
        <div className="mt-10">
          <FeedbackForm />
        </div>
      </div>
    </section>
  );
}
