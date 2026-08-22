import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import RevealSection from "@/components/RevealSection";
import { Fade } from "@/components/RevealText";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: `How deposits, staged invoices, and cancellations are handled at ${site.name}.`,
};

const SECTIONS = [
  {
    index: "01",
    title: "Deposits",
    body: "Engagements begin on a deposit against the first stage of the schedule in your scope document. It is credited in full against that stage and is refundable up to the point work starts.",
  },
  {
    index: "02",
    title: "Work already delivered",
    body: "Staged invoices cover work completed and handed over. Those stages are not refundable once delivered — you keep the files, the source, and the documentation for everything you have paid for.",
  },
  {
    index: "03",
    title: "Cancelling mid-engagement",
    body: "Either side may end an engagement with thirty days' written notice. We invoice for work completed to that point, refund the unused balance of any stage not yet started, and hand over everything produced so far.",
  },
  {
    index: "04",
    title: "If something is wrong",
    body: `If a delivered stage does not meet the scope it was quoted against, tell us and we will correct it at no charge. Write to ${site.email} and we will respond within two working days.`,
  },
  {
    index: "05",
    title: "Retainers",
    body: "Retainers are invoiced monthly in advance and cover a block of time rather than a deliverable. Unused hours do not roll over and are not refunded; cancel before the next cycle to stop billing.",
  },
];

export default function RefundPage() {
  return (
    <>
      <PageIntro
        index="08"
        label="Refunds"
        lines={["What happens", "to the money", "if plans change."]}
        lede="How deposits, staged invoices, retainers, and cancellations are handled. Your signed scope document takes precedence wherever the two differ."
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
