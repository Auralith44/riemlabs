import LiveClock from "@/components/LiveClock";
import RevealSection from "@/components/RevealSection";
import { Fade, RevealBlock, RevealLines } from "@/components/RevealText";

type MetaItem = { label: string; value: string };

type PageIntroProps = {
  index: string;
  label: string;
  lines: string[];
  lede: string;
  meta?: MetaItem[];
  /** The "Based in Nairobi [time] EAT" badge on the right of the corner row. */
  showClock?: boolean;
  /** Overrides the h1's size/width from the site default (`text-display`,
   *  full-bleed) — for the one page whose headline needs to run narrower.
   *  A prop rather than an appended className: two `text-*` size utilities
   *  on the same element don't reliably override one another by string
   *  order, only by where Tailwind happens to emit them in the stylesheet,
   *  so the default has to be left out entirely rather than fought with a
   *  second class. */
  headlineClassName?: string;
  /** The site's existing bg-ink/text-canvas dark theme — Contact only.
   *  Most text here has no explicit color and just inherits from the
   *  section, but the corner rule and the handful of hardcoded text-ink/*
   *  values need their own dark-mode swap, same tokens CTABanner uses. */
  dark?: boolean;
};

/** Shared masthead for the interior pages. Corner anchors frame the type. */
export default function PageIntro({
  index,
  label,
  lines,
  lede,
  meta = [],
  showClock = true,
  headlineClassName = "text-display",
  dark = false,
}: PageIntroProps) {
  return (
    <RevealSection className={`relative ${dark ? "bg-ink text-canvas" : ""}`}>
      <div className="shell pb-16 pt-[calc(var(--header-h)+4rem)] lg:pb-24 lg:pt-[calc(var(--header-h)+7rem)]">
        <RevealBlock onLoad>
          {/* Corner anchors */}
          <div
            className={`flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b pb-5 ${
              dark ? "border-canvas/15" : "border-hairline"
            }`}
          >
            <p className="meta flex items-baseline gap-2">
              <span className="tnum text-accent">{index}</span>
              <span className={dark ? "text-canvas/25" : "text-ink/25"}>/</span>
              <span>{label}</span>
            </p>
            {showClock ? <LiveClock /> : null}
          </div>

          <RevealLines
            as="h1"
            lines={lines}
            className={`mt-14 font-medium lg:mt-20 ${headlineClassName}`}
          />

          <div className="mt-14 grid gap-x-gutter gap-y-10 md:grid-cols-12 lg:mt-20">
            <Fade
              as="p"
              className={`text-lede md:col-span-6 lg:col-span-5 ${dark ? "text-canvas/60" : "text-ink/60"}`}
            >
              {lede}
            </Fade>

            {meta.length > 0 ? (
              <dl className="grid grid-cols-2 gap-x-gutter gap-y-8 md:col-span-6 md:col-start-8 lg:col-span-4 lg:col-start-9">
                {meta.map((item) => (
                  <Fade key={item.label}>
                    <dt className={`meta ${dark ? "text-canvas/40" : "text-ink/35"}`}>
                      {item.label}
                    </dt>
                    <dd className="mt-2 text-sm">{item.value}</dd>
                  </Fade>
                ))}
              </dl>
            ) : null}
          </div>
        </RevealBlock>
      </div>
    </RevealSection>
  );
}
