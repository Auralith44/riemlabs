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

/**
 * Home-page studio summary, rendered twice.
 *
 * `base` is the real, interactive section. `reveal` is a visually identical
 * copy living inside the wipe's accent veil.
 *
 * The headline, lede and stats deliberately do NOT flip colour between the two
 * layers. The base copy is marked `wipe-copy-base` and never paints at all on
 * viewports that get the wipe, so the veil's white mirror is the only visible
 * copy of that text: the words exist exactly where the blue is and nowhere
 * else. The base copy stays in the DOM — hidden with opacity, not removed — so
 * assistive tech and no-JS visitors still read the real section.
 *
 * The capability card is the standing exception and does not participate at
 * all: one light card with dark ink, identical in both layers, so the wipe's
 * clip edge can sweep straight through it without splitting it in two.
 *
 * The reveal copy is static: no RevealSection, no Fade. Its scroll animation
 * would run on a separate timeline from the base layer's and tear the two
 * apart mid-wipe.
 */
export default function AboutSection({
  variant = "base",
}: {
  variant?: "base" | "reveal";
}) {
  const isReveal = variant === "reveal";

  // Fade on the base layer, a plain div on the mirror.
  const Block = ({
    children,
    className = "",
    as,
  }: {
    children: ReactNode;
    className?: string;
    as?: ElementType;
  }) => {
    if (isReveal) {
      const Tag = as ?? "div";
      return <Tag className={className}>{children}</Tag>;
    }
    return (
      <Fade as={as} className={className}>
        {children}
      </Fade>
    );
  };

  const Shell = isReveal ? "div" : RevealSection;

  // Copy that lives only inside the veil. The base layer keeps its dark tone
  // purely as the fallback for viewports the wipe never runs on; where the
  // wipe IS running, `wipe-copy-base` zeroes its opacity outright.
  const onlyInWipe = isReveal ? "" : "wipe-copy-base";

  const headTone = isReveal ? "text-canvas" : "text-ink";
  const bodyTone = isReveal ? "text-canvas/80" : "text-ink/55";
  const statTone = isReveal ? "text-canvas" : "text-ink";
  const statLabel = isReveal ? "text-canvas/60" : "text-ink/45";
  const ruleTone = isReveal ? "border-canvas/20" : "border-hairline";
  const eyebrowIdx = isReveal ? "text-canvas" : "text-accent";
  const eyebrowSlash = isReveal ? "text-canvas/40" : "text-ink/25";
  const eyebrowLink = isReveal ? "text-canvas/70" : "text-ink/50";

  // The standing exception to the colour inversion: one light card with dark
  // ink, in BOTH layers. It used to be a dark card on the base and a light one
  // on the mirror, so the exit's clip edge cut it into a black top half and a
  // white bottom half as it swept down through the card's own box. Identical
  // on both sides, that seam has nothing left to reveal.
  //
  // The hairline border is what keeps it reading as a card once the blue has
  // lifted entirely and it sits white-on-white against the canvas.
  const cardSurface = "border border-hairline bg-canvas text-ink";
  const cardMuted = "text-ink/50";
  const cardBody = "text-ink/80";
  const cardRule = "border-ink/15";
  const cardFaint = "text-ink/40";
  const cardStatus = "text-ink/70";

  return (
    <Shell className={isReveal ? "" : "bg-canvas"}>
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
          {isReveal ? (
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
            <Block
              as="h2"
              className={`max-w-[18ch] text-headline font-medium ${headTone} ${onlyInWipe}`}
            >
              From first pixel to shipped product — we build it right.
            </Block>

            <Block as="p" className={`mt-8 max-w-intro text-lede ${bodyTone} ${onlyInWipe}`}>
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
                    className={`font-medium tracking-[-0.03em] ${statTone} ${onlyInWipe}`}
                    style={{ fontSize: "clamp(2.2rem, 3.5vw, 3.2rem)", lineHeight: "1" }}
                  >
                    {stat.value}
                  </p>
                  <p className={`micro mt-4 ${statLabel} ${onlyInWipe}`}>{stat.label}</p>
                </div>
              ))}
            </Block>

            <Block className="mt-12">
              {/* The real link sits under an opaque veil for as long as the
                  section is blue, so its own :hover paints nothing anyone can
                  see. `data-about-cta` lets the stylesheet mirror the hover
                  onto this white copy and invert it to a filled panel — the one
                  treatment that cannot dissolve into the field behind it, the
                  way hovering to the accent colour did. */}
              {isReveal ? (
                <span
                  data-about-cta="reveal"
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
                  className="cta-box group inline-flex items-center gap-3 border border-hairline px-7 py-4 font-mono text-sm uppercase tracking-[0.1em] transition-colors duration-400 ease-expo hover:border-accent hover:text-accent"
                >
                  Read Our Story
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-400 ease-expo group-hover:translate-x-1"
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
