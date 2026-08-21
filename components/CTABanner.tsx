import BracketLink from "@/components/BracketLink";
import RevealSection from "@/components/RevealSection";
import { Fade, RevealLines } from "@/components/RevealText";
import { site } from "@/lib/site";

type CTABannerProps = {
  /** Anchor id, so the menu's scroll-spy can see this section. */
  id?: string;
  index?: string;
  label?: string;
  lines?: string[];
  note?: string;
};

/** Inverted closing block used at the foot of every page above the footer. */
export default function CTABanner({
  id,
  index = "05",
  label = "Contact",
  lines = ["Let's build the", "next one together."],
  note = "Currently taking on two engagements for Q3 2026. Tell us the shape of the problem and we'll tell you whether we're the right studio for it.",
}: CTABannerProps) {
  return (
    <RevealSection id={id} className="bg-ink text-canvas">
      <div className="shell py-section">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t border-canvas/15 pt-5">
          <p className="meta flex items-baseline gap-2">
            <span className="tnum text-accent">{index}</span>
            <span className="text-canvas/25">/</span>
            <span className="text-canvas">{label}</span>
          </p>
          <p className="meta text-canvas/40">{site.city.toUpperCase()} — WORLDWIDE</p>
        </div>

        <div className="mt-16 grid gap-x-gutter gap-y-12 md:grid-cols-12">
          <RevealLines
            as="h2"
            lines={lines}
            className="text-display font-medium md:col-span-8"
          />

          <div className="flex flex-col justify-end gap-8 md:col-span-4">
            <Fade as="p" className="text-sm leading-relaxed text-canvas/55">
              {note}
            </Fade>

            <Fade className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <BracketLink href="/contact" variant="framed" size="lg" tone="dark">
                Start a project
              </BracketLink>

              <a
                href={`mailto:${site.email}`}
                className="meta text-canvas/50 transition-colors duration-400 ease-expo hover:text-accent"
              >
                {site.email}
              </a>
            </Fade>
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
