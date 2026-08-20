import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import RevealSection from "@/components/RevealSection";
import { Fade } from "@/components/RevealText";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description: `The terms covering work carried out by ${site.name}.`,
};

const SECTIONS = [
  {
    index: "01",
    title: "Scope and change",
    body: "Every engagement starts from a written scope. Work outside that scope is quoted separately before it begins — we do not bill for surprises.",
  },
  {
    index: "02",
    title: "Payment",
    body: "Project work is invoiced in stages against the schedule in your scope document. Retainers are invoiced monthly in advance. Invoices are due within fourteen days.",
  },
  {
    index: "03",
    title: "Ownership",
    body: "On final payment, all delivered design files, source code, and documentation transfer to you. We retain the right to describe the work publicly unless the engagement is under NDA.",
  },
  {
    index: "04",
    title: "Ending an engagement",
    body: "Either side may end an engagement with thirty days' written notice. You pay for work completed to that point; we hand over everything produced so far.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageIntro
        index="07"
        label="Terms"
        lines={["How we", "work, in", "writing."]}
        lede="The commercial terms behind every Riem Labs engagement. Your signed scope document takes precedence wherever the two differ."
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
