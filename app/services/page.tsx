import type { Metadata } from "next";
import CTABanner from "@/components/CTABanner";
import Marquee from "@/components/Marquee";
import PageIntro from "@/components/PageIntro";
import RevealSection from "@/components/RevealSection";
import SectionHeader from "@/components/SectionHeader";
import ServiceAccordion from "@/components/ServiceAccordion";
import { Fade } from "@/components/RevealText";
import { process, services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Visual direction, web systems, technical execution, and maintainable design systems — the four ways Riem Labs works with teams.",
};

const ENGAGEMENTS = [
  {
    index: "01",
    title: "Project",
    price: "From $18k",
    body: "A defined scope with a fixed end date. Direction through launch, documentation included.",
    fit: "New sites, product launches, rebuilds",
  },
  {
    index: "02",
    title: "Retainer",
    price: "From $7k / month",
    body: "Standing design and front-end capacity. A shared board, a weekly cadence, no re-scoping every sprint.",
    fit: "Teams shipping continuously",
  },
  {
    index: "03",
    title: "Audit",
    price: "From $4k",
    body: "Two weeks reading your system — accessibility, performance, consistency — ending in a prioritised plan you own.",
    fit: "Inherited or drifting codebases",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        index="03"
        label="Services"
        lines={["What we do,", "and what you", "get for it."]}
        lede="Four disciplines that usually run as one track. Expand any of them for the deliverables, the stack, and how long it typically takes."
        meta={[
          { label: "Disciplines", value: "4 core offerings" },
          { label: "Engagement", value: "Project, retainer, or audit" },
          { label: "Handover", value: "Documented, always" },
          { label: "Lead time", value: "4–6 weeks to start" },
        ]}
      />

      {/* ── 03.1 / Offerings ───────────────────────────────────────── */}
      <RevealSection className="bg-canvas">
        <div className="shell pb-section">
          <SectionHeader
            index="01"
            label="Offerings"
            aside={<span>Select to expand</span>}
            className="mb-14"
          />
          <ServiceAccordion services={services} />
        </div>
      </RevealSection>

      <Marquee
        items={[
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
          "GSAP",
          "ScrollTrigger",
          "Lenis",
          "Storybook",
          "Vercel",
        ]}
      />

      {/* ── 03.2 / Engagement models ───────────────────────────────── */}
      <RevealSection className="bg-bone">
        <div className="shell py-section">
          <SectionHeader
            index="02"
            label="Engagement models"
            lines={["Three ways to", "start working", "together."]}
            description="Prices are starting points, not quotes. We give a fixed number after a paid discovery, and we hold to it."
          />

          <div className="mt-20 grid gap-px border border-hairline bg-hairline lg:grid-cols-3">
            {ENGAGEMENTS.map((model) => (
              <Fade
                key={model.index}
                className="flex h-full flex-col justify-between gap-12 bg-canvas p-8 transition-colors duration-600 ease-expo hover:bg-bone lg:p-12"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="micro tnum text-accent">{model.index}</span>
                    <span className="meta text-ink/35">{model.price}</span>
                  </div>
                  <h3 className="mt-8 text-title font-medium">{model.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-ink/55">{model.body}</p>
                </div>

                <div className="border-t border-hairline pt-5">
                  <p className="meta text-ink/35">Best for</p>
                  <p className="mt-2 text-sm text-ink/70">{model.fit}</p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── 03.3 / Process ─────────────────────────────────────────── */}
      <RevealSection className="bg-canvas">
        <div className="shell py-section">
          <SectionHeader
            index="03"
            label="Process"
            lines={["Every engagement", "runs the same", "four phases."]}
            description="No matter the model, the shape is identical. Each phase has one exit condition, agreed before it starts."
          />

          <div className="mt-20 border-t border-hairline">
            {process.map((step) => (
              <Fade key={step.index}>
                <div className="grid grid-cols-12 items-start gap-x-gutter gap-y-4 border-b border-hairline py-10">
                  <span className="micro tnum col-span-2 text-accent md:col-span-1">
                    {step.index}
                  </span>
                  <h3 className="col-span-10 text-title font-medium md:col-span-4">
                    {step.title}
                  </h3>
                  <p className="col-span-12 col-start-1 text-sm leading-relaxed text-ink/55 md:col-span-6 md:col-start-7">
                    {step.body}
                  </p>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </RevealSection>

      <CTABanner
        index="04"
        label="Contact"
        lines={["Tell us which", "one you need."]}
        note="Not sure which model fits? Describe the problem in the brief and we'll recommend a shape — including telling you when you don't need us."
      />
    </>
  );
}
