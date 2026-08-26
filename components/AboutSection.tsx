import BracketLink from "@/components/BracketLink";
import RevealSection from "@/components/RevealSection";
import { Fade } from "@/components/RevealText";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import type { ElementType, ReactNode } from "react";

const STATS = [
  { value: "5+", label: "Years Experience" },
  { value: "10+", label: "Projects Shipped" },
  { value: "0", label: "Missed Deadlines" },
];

type Variant = "base" | "reveal" | "trail";

/**
 * Home-page studio summary, rendered three times — one layer per phase of the
 * wipe's passage over it.
 *
 *   base    the real, interactive section. Defines the section's height and
 *           carries the real links and headings for assistive tech. While the
 *           wipe is running it is held at opacity 0 (see `.wipe-base`) and
 *           never paints; it is still hit-testable, which is what lets the
 *           reveal copy mirror its hover. On any viewport the wipe does not
 *           run on — narrow, short, reduced-motion — the flag is absent and
 *           this is simply the section, painted normally.
 *
 *   reveal   the white-on-accent mirror inside the veil. Visible only in the
 *            band the blue currently covers.
 *
 *   trail    a dark mirror clipped to the region the blue has already vacated,
 *            so copy the wipe has finished with returns to normal dark-on-light
 *            instead of staying blank. Without it the exit left the stat rules
 *            standing over empty columns.
 *
 * The net effect for every element: nothing before the blue arrives, white
 * while it is overhead, dark once it has gone.
 *
 * The capability card inverts against whatever field is behind it: a light
 * panel with dark ink where the blue is, a dark panel with light ink where the
 * page is white. That is the same flip the rest of the section's copy makes, so
 * the card reads as part of it rather than an exception — and like the copy, it
 * is present in all three layers and never drops out of the layout.
 *
 * Both mirrors are static: no RevealSection, no Fade. Their scroll animations
 * would run on separate timelines from the base layer's and tear the layers
 * apart mid-wipe.
 */
export default function AboutSection({
  variant = "base",
}: {
  variant?: Variant;
}) {
  const isReveal = variant === "reveal";
  // Both mirrors are inert copies: no reveal timeline, no focusable controls.
  const isMirror = variant !== "base";

  // Fade on the base layer, a plain element on the mirrors.
  const Block = ({
    children,
    className = "",
    as,
  }: {
    children: ReactNode;
    className?: string;
    as?: ElementType;
  }) => {
    if (isMirror) {
      const Tag = as ?? "div";
      return <Tag className={className}>{children}</Tag>;
    }
    return (
      <Fade as={as} className={className}>
        {children}
      </Fade>
    );
  };

  const Shell = isMirror ? "div" : RevealSection;

  const headTone = isReveal ? "text-canvas" : "text-ink";
  const bodyTone = isReveal ? "text-canvas/80" : "text-ink/55";
  const statTone = isReveal ? "text-canvas" : "text-ink";
  const statLabel = isReveal ? "text-canvas/60" : "text-ink/45";
  const ruleTone = isReveal ? "border-canvas/20" : "border-hairline";
  const eyebrowIdx = isReveal ? "text-canvas" : "text-accent";
  const eyebrowSlash = isReveal ? "text-canvas/40" : "text-ink/25";

  // The card inverts with the field behind it, the opposite way round to the
  // copy: light panel on the blue, dark panel on the white. Both the base and
  // the trail are dark, because both sit on the white page — the base before
  // the blue arrives, the trail after it has gone — and only the reveal copy,
  // which lives inside the veil, goes light.
  const cardSurface = isReveal ? "bg-canvas text-ink" : "bg-ink text-canvas";
  const cardMuted = isReveal ? "text-ink/50" : "text-canvas/50";
  const cardBody = isReveal ? "text-ink/80" : "text-canvas/80";
  const cardRule = isReveal ? "border-ink/15" : "border-canvas/15";
  const cardFaint = isReveal ? "text-ink/40" : "text-canvas/40";
  const cardStatus = isReveal ? "text-ink/70" : "text-canvas/70";

  return (
    <Shell className={isMirror ? "" : "wipe-base bg-canvas"}>
      <div className="shell py-section">
        {/* Eyebrow row */}
        <div
          className={`flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t pt-5 ${ruleTone}`}
        >
          <p className="meta flex items-baseline gap-2">
            <span className={`tnum ${eyebrowIdx}`}>02</span>
            <span className={eyebrowSlash}>/</span>
            <span className={headTone}>About Us</span>
          </p>
        </div>

        <div className="mt-16 grid gap-x-gutter gap-y-14 lg:grid-cols-5">
          {/* ── Left: copy, stats, CTA ─────────────────────────────── */}
          <div className="lg:col-span-3">
            <Block as="h2" className={`max-w-[22ch] text-headline font-medium ${headTone}`}>
              Bridging editorial visual direction with production-grade engineering.
            </Block>

            <Block as="p" className={`mt-8 max-w-intro text-lede ${bodyTone}`}>
              Based in Nairobi, Riem Labs crafts high-fidelity digital platforms and scalable
              software architectures. We build digital assets designed for exceptional user
              experience, speed, and long-term utility.
            </Block>

            <Block className={`mt-14 grid grid-cols-3 border-t ${ruleTone}`}>
              {STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`py-8 ${i > 0 ? `border-l pl-6 ${ruleTone}` : "pr-6"}`}
                >
                  <p
                    className={`font-medium tracking-[-0.03em] ${statTone}`}
                    style={{ fontSize: "clamp(2.2rem, 3.5vw, 3.2rem)", lineHeight: "1" }}
                  >
                    {stat.value}
                  </p>
                  <p className={`micro mt-4 ${statLabel}`}>{stat.label}</p>
                </div>
              ))}
            </Block>

            {/* One action for the section, in the bracketed form the rest of
                the site uses. It carries `data-about-cta` on all three layers
                so the stylesheet can replay the real link's hover on whichever
                mirror is actually on screen — the real one spends the whole
                blue phase under an opaque veil (where its own :hover paints
                nothing anyone can see) and, once scrolled past, sits behind
                the trail mirror instead, which has the exact same problem. */}
            <Block className="mt-12">
              <div data-about-cta={isReveal ? "reveal" : variant === "trail" ? "trail" : "base"}>
                <BracketLink
                  href="/about"
                  variant="boxed"
                  size="lg"
                  asStatic={isMirror}
                  tone={isReveal ? "reveal" : "light"}
                >
                  Full Studio
                </BracketLink>
              </div>
            </Block>
          </div>

          {/* ── Right: capability card ─────────────────────────────── */}
          <Block className="lg:col-span-2">
            <div
              className={`flex min-h-[28rem] flex-col p-10 lg:min-h-[30rem] lg:p-12 ${cardSurface}`}
            >
              {/* -0.05em left margin cancels the "R" glyph's own left-side
                  bearing at this size/tracking — its bounding box already
                  lines up with "Riem Labs" and "Based in" below it, but the
                  stroke itself sits far enough inside that box to read as
                  shifted right. em-relative so it scales with the fluid
                  clamp() size instead of needing per-breakpoint tuning. */}
              <p
                className="font-medium tracking-[-0.05em]"
                style={{
                  fontSize: "clamp(4rem, 7vw, 7.5rem)",
                  lineHeight: "0.9",
                  marginLeft: "-0.05em",
                }}
              >
                RL
              </p>
              <p className={`micro mt-5 ${cardMuted}`}>Riem Labs</p>

              <ul className="mt-12 space-y-4">
                {services.map((service) => (
                  <li key={service.index} className="flex items-center gap-4 text-sm">
                    <span aria-hidden="true" className="h-px w-4 shrink-0 bg-accent" />
                    <span className={cardBody}>{service.title}</span>
                  </li>
                ))}
              </ul>

              <div
                className={`mt-auto flex items-end justify-between gap-6 border-t pt-6 ${cardRule}`}
              >
                <div>
                  <p className={`micro ${cardFaint}`}>Based in</p>
                  <p className={`mt-2 text-sm ${cardBody}`}>
                    {site.city}, {site.country}
                  </p>
                </div>

                <p className={`micro flex items-center gap-2 ${cardStatus}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
                  Available
                </p>
              </div>
            </div>
          </Block>
        </div>
      </div>
    </Shell>
  );
}
