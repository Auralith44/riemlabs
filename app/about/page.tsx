import type { Metadata } from "next";
import CTABanner from "@/components/CTABanner";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import GlyphPanel from "@/components/GlyphPanel";
import PageIntro from "@/components/PageIntro";
import RevealSection from "@/components/RevealSection";
import SectionHeader from "@/components/SectionHeader";
import { Fade, RevealLines } from "@/components/RevealText";
import { choreographies } from "@/lib/glyphChoreographies";
import { aboutProcess, principles } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Riem Labs is a small, senior design and engineering studio in Nairobi working on interfaces and the systems underneath them.",
};

export default function AboutPage() {
  return (
    <>
      <PageIntro
        index="02"
        label="Studio"
        lines={["A focused studio", "with a long-term", "commitment."]}
        lede="We are an independent studio that builds software, data systems, and digital infrastructure for growing businesses. Based in Nairobi, we stay embedded alongside our clients from initial launch through long-term scale."
        showClock={false}
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
              lines={["We started because", "most agencies stop", "where real value begins."]}
              className="text-headline font-medium md:col-span-6"
            />

            <div className="space-y-6 text-base leading-relaxed text-ink/60 md:col-span-5 md:col-start-8">
              <Fade as="p">
                {site.name} began in {site.founded} after watching company after company get
                stuck with static, transactional websites that couldn&apos;t scale. Most agencies
                ship a visual shell, collect a final payment, and disappear—leaving businesses to
                manage fragmented spreadsheets, manual workflows, and disconnected software.
              </Fade>
              <Fade as="p">
                We built {site.name} to bridge that exact gap. We don&apos;t just build
                high-conversion web platforms; we architect the underlying custom software,
                automated business systems, data analytics, and AI workflows that power actual
                day-to-day operations.
              </Fade>
              <Fade as="p">
                By uniting modern web engineering with data science, we ensure every system we
                ship is modular, automated, and built to adapt as your company grows.
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
            lines={["Operating standards", "engineered for long-term", "system health."]}
            description="These are not generic agency values on a wall. Every rule directly governs how we architect software, structure databases, and stay embedded with clients post-launch."
          />

          <div className="mt-20 grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
            {principles.map((p, i) => (
              <GlyphPanel
                key={p.index}
                choreography={choreographies[i % choreographies.length]}
                color="orange"
                className="bg-canvas p-8 transition-colors duration-600 ease-expo hover:bg-bone lg:p-12"
              >
                <h3 className="mt-8 text-title font-medium">{p.title}</h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/55">{p.body}</p>
              </GlyphPanel>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── 02.3 / Experience ──────────────────────────────────────── */}
      <RevealSection className="bg-bone">
        <div className="shell py-section">
          <SectionHeader
            index="03"
            label="Experience"
            lines={["Built one engagement", "at a time."]}
            description="A running record of the studio itself — from founding through the systems currently in production."
          />

          <div className="mt-20">
            <ExperienceTimeline />
          </div>
        </div>
      </RevealSection>

      {/* ── 02.4 / Process ─────────────────────────────────────────── */}
      <RevealSection className="bg-canvas">
        <div className="shell py-section">
          <SectionHeader
            index="04"
            label="Process"
            lines={["How we engineer", "and evolve your", "digital infrastructure."]}
            description="We eliminate black-box development. Every phase has defined milestones, clear code previews, and direct post-launch support to adapt as your business expands."
          />

          <div className="mt-20 grid gap-x-gutter gap-y-14 md:grid-cols-4">
            {aboutProcess.map((step, i) => (
              <GlyphPanel
                key={step.index}
                choreography={choreographies[i % choreographies.length]}
                color="black"
                glyphClassName="h-7 w-7"
                className="border-t border-hairline pt-6"
              >
                <h3 className="mt-6 text-title font-medium">{step.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ink/55">{step.body}</p>
              </GlyphPanel>
            ))}
          </div>
        </div>
      </RevealSection>

      <CTABanner
        index="05"
        label="Contact"
        lines={["Let's engineer your next", "digital milestone."]}
        note="Whether you need a high-conversion web platform or an integrated data and automation system, we're ready to help you plan the roadmap. Tell us what you're building, and we'll outline a direct path forward within 24 hours."
      />
    </>
  );
}
