import type { Metadata } from "next";
import CTABanner from "@/components/CTABanner";
import MetricGrid from "@/components/MetricGrid";
import PageIntro from "@/components/PageIntro";
import RevealSection from "@/components/RevealSection";
import SectionHeader from "@/components/SectionHeader";
import { Fade, RevealLines } from "@/components/RevealText";
import { principles, process } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Riem Labs is a small, senior design and engineering studio in Nairobi working on interfaces and the systems underneath them.",
};

const TEAM = [
  { name: "Practice lead", role: "Direction, typography, client strategy", since: "2017" },
  { name: "Systems lead", role: "Architecture, design systems, front-end", since: "2019" },
  { name: "Motion & interaction", role: "Choreography, prototyping, performance", since: "2021" },
  { name: "Production", role: "QA, accessibility, delivery", since: "2022" },
];

export default function AboutPage() {
  return (
    <>
      <PageIntro
        index="02"
        label="Studio"
        lines={["A small studio", "with a long", "attention span."]}
        lede="We are four people who would rather do six projects properly than twenty adequately. Founded in Nairobi, working with teams across fourteen countries."
        meta={[
          { label: "Founded", value: `${site.founded} — ${site.city}` },
          { label: "Team", value: "4 senior practitioners" },
          { label: "Engagements", value: "6–8 per year" },
          { label: "Availability", value: "Q3 2026" },
        ]}
      />

      {/* ── 02.1 / Story ───────────────────────────────────────────── */}
      <RevealSection className="bg-canvas">
        <div className="shell py-section">
          <SectionHeader index="01" label="Story" aside={<span>Why we exist</span>} />

          <div className="mt-16 grid gap-x-gutter gap-y-12 md:grid-cols-12">
            <RevealLines
              as="h2"
              lines={["We started because", "good work kept", "dying in handover."]}
              className="text-headline font-medium md:col-span-6"
            />

            <div className="space-y-6 text-base leading-relaxed text-ink/60 md:col-span-5 md:col-start-8">
              <Fade as="p">
                {site.name} began in {site.founded} after years of watching carefully made
                designs arrive at engineering as a folder of images. The intent survived the
                pitch and died in the build.
              </Fade>
              <Fade as="p">
                So we stopped separating the two. Every engagement here is run by people who
                design the thing and then write the code that ships it. The typographic scale
                is a token file. The grid is a layout primitive. The motion spec is a timeline
                you can read.
              </Fade>
              <Fade as="p">
                That makes us slower to start and considerably faster to finish. It also means
                what launches is what was agreed — not an approximation of it.
              </Fade>
              <Fade as="p" className="text-ink">
                We take on six to eight engagements a year. That number is a constraint, not a
                target.
              </Fade>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ── 02.2 / Principles ──────────────────────────────────────── */}
      <RevealSection className="bg-bone">
        <div className="shell py-section">
          <SectionHeader
            index="02"
            label="Operating Principles"
            lines={["Four rules we", "do not trade away."]}
            description="These are not values on a wall. Each one changes what we will and won't agree to in a scope document."
          />

          <div className="mt-20 grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
            {principles.map((p) => (
              <Fade key={p.index} className="bg-canvas p-8 lg:p-12">
                <span className="micro tnum text-accent">{p.index}</span>
                <h3 className="mt-8 text-title font-medium">{p.title}</h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/55">{p.body}</p>
              </Fade>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── 02.3 / Metrics ─────────────────────────────────────────── */}
      <RevealSection className="bg-canvas">
        <div className="shell py-section">
          <SectionHeader
            index="03"
            label="By the numbers"
            aside={<span>Updated Q2 2026</span>}
          />
          <div className="mt-16">
            <MetricGrid />
          </div>
        </div>
      </RevealSection>

      {/* ── 02.4 / Practice ────────────────────────────────────────── */}
      <RevealSection className="bg-bone">
        <div className="shell py-section">
          <SectionHeader
            index="04"
            label="Practice"
            lines={["Who does", "the work."]}
            description="Four seats, all senior. Every engagement is staffed by the same people from kickoff to handover."
          />

          <div className="mt-20 border-t border-hairline">
            {TEAM.map((member, i) => (
              <Fade key={member.name}>
                <div className="group grid grid-cols-12 items-baseline gap-x-gutter gap-y-2 border-b border-hairline py-7 transition-colors duration-400 ease-expo hover:text-accent">
                  <span className="micro tnum col-span-2 text-ink/30 transition-colors duration-400 ease-expo group-hover:text-accent md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="col-span-10 text-title font-medium md:col-span-4">
                    {member.name}
                  </h3>
                  <p className="col-span-10 col-start-3 text-sm text-ink/55 transition-colors duration-400 ease-expo group-hover:text-accent md:col-span-5 md:col-start-6">
                    {member.role}
                  </p>
                  <span className="meta tnum col-span-12 text-ink/30 md:col-span-2 md:text-right">
                    Since {member.since}
                  </span>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── 02.5 / Process ─────────────────────────────────────────── */}
      <RevealSection className="bg-canvas">
        <div className="shell py-section">
          <SectionHeader
            index="05"
            label="Process"
            lines={["How an engagement", "actually runs."]}
            description="Four phases, each with a defined exit. You always know which one you're in and what ends it."
          />

          <div className="mt-20 grid gap-x-gutter gap-y-14 md:grid-cols-4">
            {process.map((step) => (
              <Fade key={step.index} className="border-t border-hairline pt-6">
                <span className="micro tnum text-accent">{step.index}</span>
                <h3 className="mt-6 text-title font-medium">{step.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ink/55">{step.body}</p>
              </Fade>
            ))}
          </div>
        </div>
      </RevealSection>

      <CTABanner
        index="06"
        label="Contact"
        lines={["Think we'd be", "a good fit?"]}
      />
    </>
  );
}
