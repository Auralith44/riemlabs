import type { Metadata } from "next";
import CTABanner from "@/components/CTABanner";
import PageIntro from "@/components/PageIntro";
import RevealSection from "@/components/RevealSection";
import SectionHeader from "@/components/SectionHeader";
import WorkGallery from "@/components/WorkGallery";
import { Fade } from "@/components/RevealText";
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
        lines={["Systems that", "shipped, and", "stayed shipped."]}
        lede="Every project below is live and maintained by the client's own team. Open a preview for the brief, the role we played, and what it was built on."
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
            lines={["Not seeing your", "kind of problem?"]}
            description="Roughly a third of our work never becomes a public case study. If your project sits under NDA, that's normal here."
          />

          <div className="mt-16 grid gap-x-gutter gap-y-10 md:grid-cols-3">
            {[
              {
                index: "01",
                title: "Confidential work",
                body: "Internal tools, pre-launch products, and regulated interfaces. References available on request.",
              },
              {
                index: "02",
                title: "Retained partnerships",
                body: "Ongoing design and front-end capacity for teams shipping continuously rather than in projects.",
              },
              {
                index: "03",
                title: "System rescues",
                body: "Inheriting a codebase that drifted. We audit, stabilise, and document before touching the surface.",
              },
            ].map((item) => (
              <Fade key={item.index} className="border-t border-hairline pt-6">
                <span className="micro tnum text-accent">{item.index}</span>
                <h3 className="mt-6 text-title font-medium">{item.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ink/55">{item.body}</p>
              </Fade>
            ))}
          </div>
        </div>
      </RevealSection>

      <CTABanner
        index="03"
        label="Contact"
        lines={["Your project", "could be next."]}
      />
    </>
  );
}
