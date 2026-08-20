import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import RevealSection from "@/components/RevealSection";
import { Fade } from "@/components/RevealText";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${site.name} handles the information you share with us.`,
};

const SECTIONS = [
  {
    index: "01",
    title: "What we collect",
    body: "Only what you send us. The project inquiry form records your name, email, an optional company, the budget and scope you select, and the brief you write. We do not run advertising trackers or sell data to anyone.",
  },
  {
    index: "02",
    title: "Why we hold it",
    body: "To reply to your enquiry and, if we work together, to run the engagement. Nothing more.",
  },
  {
    index: "03",
    title: "How long we keep it",
    body: "Enquiries that do not become projects are deleted within twelve months. Project records are retained for the period our contract and local tax law require.",
  },
  {
    index: "04",
    title: "Your rights",
    body: `Ask us for a copy of what we hold, or ask us to delete it, by writing to ${site.email}. We will action the request within thirty days.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        index="06"
        label="Privacy"
        lines={["What we do", "with your", "information."]}
        lede="A short policy, because we collect very little. If anything here is unclear, email us and we will answer plainly."
        meta={[
          { label: "Last updated", value: "August 2026" },
          { label: "Contact", value: site.email },
        ]}
      />

      <RevealSection className="bg-canvas">
        <div className="shell pb-section">
          <div className="border-t border-hairline">
            {SECTIONS.map((section) => (
              <Fade key={section.index}>
                <div className="grid grid-cols-12 items-start gap-x-gutter gap-y-4 border-b border-hairline py-10">
                  <span className="micro tnum col-span-2 text-accent md:col-span-1">
                    {section.index}
                  </span>
                  <h2 className="col-span-10 text-title font-medium md:col-span-4">
                    {section.title}
                  </h2>
                  <p className="col-span-12 text-sm leading-relaxed text-ink/55 md:col-span-6 md:col-start-7">
                    {section.body}
                  </p>
                </div>
              </Fade>
            ))}
          </div>

          <Fade as="p" className="meta mt-10 text-ink/35">
            This is a starting point, not legal advice — have counsel review it before launch.
          </Fade>
        </div>
      </RevealSection>
    </>
  );
}
