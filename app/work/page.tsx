import type { Metadata } from "next";
import CTABanner from "@/components/CTABanner";
import GlyphPanel from "@/components/GlyphPanel";
import PageIntro from "@/components/PageIntro";
import RevealSection from "@/components/RevealSection";
import SectionHeader from "@/components/SectionHeader";
import WorkGallery from "@/components/WorkGallery";
import { choreographies } from "@/lib/glyphChoreographies";
import { projects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects from Riem Labs — product systems, studio sites, commerce, and design systems shipped in production.",
};

export default function WorkPage() {
  const years = projects.map((p) => Number(p.year));
  const span = `${Math.min(...years)}–${Math.max(...years)}`;

  return (
    <>
      <PageIntro
        index="03"
        label="Work"
        lines={["Real infrastructure", "powering actual", "business operations."]}
        lede="Every project in our index represents an active digital system built to solve real operational bottlenecks. From B2B product catalogues to custom platforms, we build for longevity and ongoing performance."
        showClock={false}
        meta={[
          { label: "Projects", value: `${projects.length} in the public index` },
          { label: "Span", value: span },
          { label: "Categories", value: "5 disciplines" },
          { label: "Status", value: "All in production" },
        ]}
      />

      <RevealSection className="bg-canvas">
        <div className="shell pb-section">
          <SectionHeader
            index="01"
            label="Index"
            aside={<span>Filter by discipline</span>}
            className="mb-10"
          />
          <WorkGallery />
        </div>
      </RevealSection>

      <RevealSection className="bg-bone">
        <div className="shell py-section">
          <SectionHeader
            index="02"
            label="Engagement"
            lines={["Engagements tailored", "to complex operational", "challenges."]}
            description="A significant portion of our work involves internal management portals, proprietary workflows, and non-disclosure agreements. If your specific technical challenge isn't represented in our public index, we engineer custom solutions to fit your exact setup."
          />

          <div className="mt-16 grid gap-x-gutter gap-y-10 md:grid-cols-3">
            {[
              {
                index: "01",
                title: "Confidential & Custom Software",
                body: "Internal operational tools, proprietary business portals, and B2B platforms built under strict NDA. References and architectural walk-throughs are available upon request.",
              },
              {
                index: "02",
                title: "Retained System Evolution",
                body: "Ongoing engineering capacity for growing businesses. We stay embedded post-launch to continuously expand your stack into custom web applications, workflow automation, data analytics, and AI.",
              },
              {
                index: "03",
                title: "Codebase & System Rescues",
                body: "Inheriting fragile, unmaintained, or technical-debt-heavy codebases. We perform a complete structural audit, stabilize backend infrastructure, fix performance bottlenecks, and properly document the stack.",
              },
            ].map((item, i) => (
              <GlyphPanel
                key={item.index}
                choreography={choreographies[i % choreographies.length]}
                color="green"
                glyphClassName="h-7 w-7"
                className="border-t border-hairline pt-6"
              >
                <h3 className="mt-6 text-title font-medium">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ink/55">{item.body}</p>
              </GlyphPanel>
            ))}
          </div>
        </div>
      </RevealSection>

      <CTABanner
        index="03"
        label="Contact"
        lines={["Your platform could", "be the next system", "we engineer."]}
        note="Every system in our index started with a single operational bottleneck. Whether you need a high-performance web platform, a confidential internal portal, or a codebase rescue, tell us what you're building and we'll outline a direct technical roadmap within 24 hours."
      />
    </>
  );
}
