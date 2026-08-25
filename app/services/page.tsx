import type { Metadata } from "next";
import CTABanner from "@/components/CTABanner";
import LogoMarquee from "@/components/LogoMarquee";
import PageIntro from "@/components/PageIntro";
import RevealSection from "@/components/RevealSection";
import SectionHeader from "@/components/SectionHeader";
import ServiceAccordion from "@/components/ServiceAccordion";
import { Fade } from "@/components/RevealText";
import { process, services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Web & software development, business systems & automation, data science & analytics, and AI & intelligent solutions — the four ways Riem Labs works with teams.",
};

const ENGAGEMENTS = [
  {
    index: "01",
    title: "Fixed Project Build",
    price: "From $18k",
    tagline: "Defined scope, guaranteed timeline, complete execution.",
    body: "End-to-end architecture and build of a custom web platform, automated system, or business application. We define clear milestones from day one and handle everything from schema design to production deployment and post-launch handover.",
    fit: "Product launches, custom web apps, complete system rebuilds, and automated workflow rollouts.",
  },
  {
    index: "02",
    title: "Embedded Capacity (Retainer)",
    price: "From $7k / month",
    tagline: "Dedicated senior engineering depth without full-time hiring overhead.",
    body: "Ongoing monthly capacity embedded alongside your team. Operating on a transparent sprint cadence, we handle continuous feature rollouts, database optimization, backend scaling, and AI capabilities as your business grows.",
    fit: "Fast-moving teams needing continuous technical momentum, system expansion, and ongoing technical advisory.",
  },
  {
    index: "03",
    title: "System & Code Audit",
    price: "From $4k",
    tagline: "Diagnostic teardown and actionable technical roadmap.",
    body: "A focused multi-week audit examining your software architecture, database query bottlenecks, security vulnerabilities, and code quality. We deliver a prioritized, non-jargon remediation blueprint you own outright.",
    fit: "Fragile or drifting codebases, performance degradation, tech-debt cleanup, or pre-scale system assessments.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        index="04"
        label="Services"
        lines={["Digital systems built", "for speed, scale, and", "operational utility."]}
        lede="Four specialized technical capabilities designed to advance your digital infrastructure. Explore our core offerings across full-stack engineering, workflow automation, data science, and intelligent systems."
        showClock={false}
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

      <LogoMarquee />

      {/* ── 03.2 / Engagement models ───────────────────────────────── */}
      <RevealSection className="bg-bone">
        <div className="shell py-section">
          <SectionHeader
            index="02"
            label="Engagement models"
            lines={["Flexible engagement", "tailored to your technical", "roadmap."]}
            description="Every engagement is defined by explicit milestones, clean code delivery, and zero hidden costs. We establish fixed project pricing after initial discovery so you retain total control over your roadmap."
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
                  <p className="mt-3 text-sm font-medium text-ink/70">{model.tagline}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/55">{model.body}</p>
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
            lines={["Every engagement follows", "a strict four-stage", "engineering loop."]}
            description="We eliminate ambiguity and black-box delivery. Every phase has a single defined exit condition agreed upon before code is written, ensuring you interact with live software early and retain complete system ownership."
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
        lines={["Ready to scope your", "next engineering build?"]}
        note="Not sure which service line or engagement model fits best? Outline your operational bottleneck or technical requirements, and we'll recommend an exact build structure and transparent estimate within 24 hours."
      />
    </>
  );
}
