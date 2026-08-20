import BracketLink from "@/components/BracketLink";
import LiveClock from "@/components/LiveClock";
import RevealSection from "@/components/RevealSection";
import { Fade, RevealBlock, RevealLines } from "@/components/RevealText";

export default function NotFound() {
  return (
    <RevealSection>
      <div className="shell flex min-h-[80svh] flex-col justify-center py-section">
        <RevealBlock onLoad>
          <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 hairline-b pb-5">
            <p className="meta flex items-baseline gap-2">
              <span className="tnum text-accent">404</span>
              <span className="text-ink/25">/</span>
              <span>Not found</span>
            </p>
            <LiveClock />
          </div>

          <RevealLines
            as="h1"
            lines={["This page isn't", "part of the system."]}
            className="mt-14 text-display font-medium"
          />

          <Fade className="mt-14 flex flex-wrap items-center gap-8">
            <BracketLink href="/" variant="framed" size="lg">
              Back to index
            </BracketLink>
            <BracketLink href="/work" size="sm">
              View the work
            </BracketLink>
          </Fade>
        </RevealBlock>
      </div>
    </RevealSection>
  );
}
