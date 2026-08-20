import BracketLink from "@/components/BracketLink";
import LiveClock from "@/components/LiveClock";

export const HERO_HEADLINE =
  "Digital presence, built to last — from first design to long-term growth.";

export const HERO_INTRO =
  "An independent digital practice shaping product thinking, visual direction and technical execution into working systems.";

/**
 * Hero content, rendered twice.
 *
 * `base` is the real, interactive layer. `reveal` is a visually identical copy
 * living inside the clipped accent layer — it must never be focusable or
 * announced, so its heading degrades to a <p> and its CTA to a static span.
 * Both variants share every layout class, which is what keeps the two layers
 * in pixel register as the band sweeps across.
 */
export default function HeroContent({ variant }: { variant: "base" | "reveal" }) {
  const isReveal = variant === "reveal";

  const Heading = isReveal ? "p" : "h1";
  const headingTone = isReveal ? "text-mist" : "text-graphite";
  const introTone = isReveal ? "text-mist/75" : "text-stone";
  const metaTone = isReveal ? "text-mist/70" : "text-stone";

  return (
    <div className="flex h-full min-h-[100svh] flex-col px-gutter pb-8 pt-[var(--header-h)]">
      {/* Centred in the space above the footer row, then biased down 8vh so it
          reads as lower-middle. translate-y is a pure paint offset, so it
          can't shift the footer row or the centring maths.

          Nothing scroll-driven touches this. The copy holds its position for
          the whole hero and only ever changes colour, as the band sweeps
          across it — and because both layers are laid out identically, the
          black half and the white half stay in step by construction. */}
      <div className="flex flex-1 flex-col justify-center">
        <div className="translate-y-[8vh]">
          <Heading
            className={`hero-rise hero-headline max-w-[24ch] ${headingTone}`}
            style={{ animationDelay: "0.08s" }}
          >
            {HERO_HEADLINE}
          </Heading>

          <p
            className={`hero-rise hero-description mt-6 max-w-intro ${introTone}`}
            style={{ animationDelay: "0.2s" }}
          >
            {HERO_INTRO}
          </p>
        </div>
      </div>

      {/* Bottom anchors: clock left, scroll cue centred, CTA right. */}
      <div
        className="hero-rise grid grid-cols-3 items-end gap-4"
        style={{ animationDelay: "0.34s" }}
      >
        <div className="flex items-center gap-2">
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full animate-pulse-dot ${
              isReveal ? "bg-mist" : "bg-accent"
            }`}
          />
          {/* Both layers render the same clock, from one shared ticker. The
              mirror used to be a bare "Based in Nairobi" label with no time and
              no timezone, so wherever the accent field covered this corner it
              painted over the live figure and left it cropped. */}
          <LiveClock seconds tone={variant} />
        </div>

        <p className={`meta col-start-2 flex items-center justify-center gap-2 ${metaTone}`}>
          <span
            className={`h-1.5 w-1.5 rounded-full animate-pulse-dot ${
              isReveal ? "bg-mist" : "bg-accent"
            }`}
          />
          Scroll to begin
        </p>

        {/* One component renders both copies, so the mirror cannot drift out
            of register with the real control. `data-hero-cta` is the hook the
            stylesheet uses to replay the base's hover splay on the mirror. */}
        <div className="col-start-3 justify-self-end" data-hero-cta={variant}>
          <BracketLink
            href="/contact"
            size="lg"
            magnetic
            asStatic={isReveal}
            tone={isReveal ? "reveal" : "light"}
          >
            Let&apos;s talk
          </BracketLink>
        </div>
      </div>
    </div>
  );
}
