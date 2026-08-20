import Link from "next/link";
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
 * The capability card keeps ONE treatment throughout — dark panel, light ink —
 * in every layer. It does not invert with the wipe and it does not disappear
 * behind it: the clip edge sweeping through it reveals identical pixels either
 * side, so there is no seam to see.
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
  const eyebrowLink = isReveal ? "text-canvas/70" : "text-ink/50";

  // The card is the one element the wipe does not recolour. It keeps its own
  // dark panel and light ink whatever is behind it — blue mid-wipe, white once
  // the blue has gone — so it stays put through the whole passage instead of
  // dropping out of the layout when the section returns to white.
  //
  // Identical in all three layers is what makes that safe: the clip edge can
  // cut straight through the card and both sides match.
  const cardSurface = "bg-ink text-canvas";
  const cardMuted = "text-canvas/50";
  const cardBody = "text-canvas/80";
  const cardRule = "border-canvas/15";
  const cardFaint = "text-canvas/40";
  const cardStatus = "text-canvas/70";

  return (
    <Shell className={isMirror ? "" : "wipe-base bg-canvas"}>
      <div className="shell py-section">
        {/* Eyebrow row */}
        <div
          className={`flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-t pt-5 ${ruleTone}`}
        >
          <p className="meta flex items-baseline gap-2">
            <span className={`tnum ${eyebrowIdx}`}>01</span>
            <span className={eyebrowSlash}>/</span>
            <span className={headTone}>About Us</span>
          </p>
          {isMirror ? (
            <span className={`meta inline-flex items-center gap-2 ${eyebrowLink}`}>
              Full Studio <span aria-hidden="true">→</span>
            </span>
          ) : (
            <Link
              href="/about"
              className="meta group inline-flex items-center gap-2 text-ink/50 transition-colors duration-400 ease-expo hover:text-accent"
            >
              Full Studio
              <span
                aria-hidden="true"
                className="transition-transform duration-400 ease-expo group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          )}
        </div>

        <div className="mt-16 grid gap-x-gutter gap-y-14 lg:grid-cols-5">
          {/* ── Left: copy, stats, CTA ─────────────────────────────── */}
          <div className="lg:col-span-3">
            <Block as="h2" className={`max-w-[18ch] text-headline font-medium ${headTone}`}>
              From first pixel to shipped product — we build it right.
            </Block>

            <Block as="p" className={`mt-8 max-w-intro text-lede ${bodyTone}`}>
              Riem Labs is a small studio based in Nairobi. We design and build full-stack
              products, design systems, and technical execution for teams who need it done
              properly the first time.
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

            <Block className="mt-12">
              {/* The real link spends the whole blue phase underneath an opaque
                  veil, so its own :hover paints nothing anyone can see — and on
                  the light background it is deliberately inert to the pointer.
                  `data-about-cta` lets the stylesheet mirror the hover onto the
                  white copy and invert it to a filled panel, the one treatment
                  that cannot dissolve into the field behind it. */}
              {isMirror ? (
                <span
                  data-about-cta={isReveal ? "reveal" : undefined}
                  className={`inline-flex items-center gap-3 border px-7 py-4 font-mono text-sm uppercase tracking-[0.1em] transition-colors duration-400 ease-expo ${ruleTone} ${headTone}`}
                >
                  Read Our Story
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-400 ease-expo"
                  >
                    →
                  </span>
                </span>
              ) : (
                <Link
                  href="/about"
                  data-about-cta="base"
                  className="group inline-flex items-center gap-3 border border-hairline px-7 py-4 font-mono text-sm uppercase tracking-[0.1em]"
                >
                  Read Our Story
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-400 ease-expo"
                  >
                    →
                  </span>
                </Link>
              )}
            </Block>
          </div>

          {/* ── Right: capability card ─────────────────────────────── */}
          <Block className="lg:col-span-2">
            <div
              className={`flex min-h-[28rem] flex-col p-10 lg:min-h-[30rem] lg:p-12 ${cardSurface}`}
            >
              <p
                className="font-medium tracking-[-0.05em]"
                style={{ fontSize: "clamp(4rem, 7vw, 7.5rem)", lineHeight: "0.9" }}
              >
                RL
              </p>
              <p className={`micro mt-5 ${cardMuted}`}>Riem Labs</p>

              <ul className="mt-12 space-y-4">
                {services.map((service) => (
                  <li key={service.index} className="flex items-baseline gap-4 text-sm">
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
