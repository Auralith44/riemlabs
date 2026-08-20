"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Same gate specia1ne uses for its hero→work motion. */
const ENABLE_QUERY =
  "(min-width: 48rem) and (min-height: 37.5rem) and (prefers-reduced-motion: no-preference)";

/**
 * How much of the viewport still shows About Us once the blue has fully lifted.
 * The recede finishes here rather than at the section boundary, so the section's
 * real light background is on screen for a beat before the dark stats bar.
 */
const EXIT_END = "bottom 40%";

const clamp = (min: number, max: number, v: number) => Math.min(max, Math.max(min, v));

/**
 * Scroll-driven colour wipe on the hero → About Us seam, plus a custom recede
 * on the About Us → Work seam.
 *
 * Entrance follows specia1ne's handoff: pause the pointer band, measure its
 * live rect, and interpolate that rect out to the full viewport.
 *
 * Exit has no counterpart in specia1ne's source — its hero→work trigger is
 * entrance-only and simply holds at full coverage. This is custom motion built
 * with the same technique in reverse.
 */
export default function SectionWipe({
  children,
  reveal,
  className = "",
  id,
}: {
  children: ReactNode;
  /** Inverted mirror of `children`, painted inside the accent veil. */
  reveal?: ReactNode;
  className?: string;
  id?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const veil = veilRef.current;
    if (!section || !veil) return;

    const root = document.documentElement;
    const gate = window.matchMedia(ENABLE_QUERY);
    if (!gate.matches) return;

    let cancelled = false;
    let teardown = () => {};

    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      // Tells the stylesheet the veil is under scroll control on this
      // viewport. Section copy that renders *only* inside the veil keys off
      // this, so a viewport that never gets the wipe — narrow, short, or
      // reduced-motion — still shows its own base copy normally.
      root.dataset.sectionWipe = "true";

      const setClip = (top: number, right: number, bottom: number, left: number) => {
        veil.style.setProperty("--section-clip-top", `${top.toFixed(2)}px`);
        veil.style.setProperty("--section-clip-right", `${right.toFixed(2)}px`);
        veil.style.setProperty("--section-clip-bottom", `${bottom.toFixed(2)}px`);
        veil.style.setProperty("--section-clip-left", `${left.toFixed(2)}px`);
      };

      /**
       * Point the hero's pointer band at the same horizontal span as the veil.
       *
       * The hero layer and this veil are each `absolute inset-0` inside their
       * own adjacent sections, so an identical band in both reads as one
       * continuous vertical stripe running across the section boundary — the
       * expansion starts in the hero and carries down, instead of vanishing
       * there and restarting inside About Us.
       */
      /**
       * The layout width, excluding the scrollbar.
       *
       * `window.innerWidth` INCLUDES the scrollbar, but the veil's px insets
       * and the band's `%` position both resolve against the element's content
       * box, which excludes it. Mixing the two put the band ~1.1% off the veil
       * — a ~10px step on each side at the section boundary.
       */
      const layoutWidth = () =>
        section.clientWidth || document.documentElement.clientWidth || window.innerWidth;

      const setBand = (left: number, width: number) => {
        const viewport = layoutWidth() || 1;
        root.style.setProperty(
          "--reveal-position",
          `${(((left + width / 2) / viewport) * 100).toFixed(3)}%`,
        );
        root.style.setProperty("--reveal-width", `${width.toFixed(2)}px`);
      };

      const collapse = () => {
        veil.style.setProperty("--section-clip-top", "0px");
        veil.style.setProperty("--section-clip-right", "50%");
        veil.style.setProperty("--section-clip-bottom", "0px");
        veil.style.setProperty("--section-clip-left", "50%");
        delete root.dataset.wipeCover;
      };

      const syncHeaderCover = (visible: boolean, fieldTopViewport: number) => {
        const rect = section.getBoundingClientRect();
        const headerH =
          Number.parseFloat(getComputedStyle(root).getPropertyValue("--header-h")) || 0;
        const covered = visible && fieldTopViewport < headerH && rect.bottom > 0;
        if (covered) root.dataset.wipeCover = "true";
        else delete root.dataset.wipeCover;
      };

      // ── Pointer-band handoff ───────────────────────────────────────────
      // The band is a clip-path, so its own border box is the whole hero and
      // getBoundingClientRect() can't report it. HeroSpotlight renders a 1px
      // marker laid out to the band's live geometry; that rect is the real,
      // currently-rendered position — never a cached custom-property string.
      let startLeft = 0;
      let startWidth = 0;
      let captured = false;

      const pauseBand = () => window.dispatchEvent(new CustomEvent("site:reveal-pause"));

      const captureBand = () => {
        const marker = document.querySelector<HTMLElement>("[data-reveal-band-marker]");
        const viewport = layoutWidth();
        const rect = marker?.getBoundingClientRect();

        if (rect && rect.width > 0) {
          startWidth = rect.width;
          startLeft = rect.left;
        } else {
          // Band idle (zero width) — start from a seam at its centre.
          startWidth = 0;
          startLeft = rect ? rect.left : viewport / 2;
        }

        captured = true;
        pauseBand();
      };

      /**
       * Re-entering from below (scrolling up) must NOT re-measure the band —
       * it is full-bleed at that moment, so capturing it would make progress 0
       * mean "whole hero blue" and the contraction would never play. Reuse the
       * rect captured on the way down so the scroll-up exactly reverses it.
       */
      const resumeCapture = () => {
        if (captured) pauseBand();
        else captureBand();
      };

      const resumeBand = (leftPx: number, widthPx: number) => {
        captured = false;
        // layoutWidth(), not window.innerWidth — the latter includes the
        // scrollbar, and handing the band back on that basis offset it from
        // the veil by the scrollbar's width for the frames after the handoff.
        const viewport = layoutWidth() || 1;
        window.dispatchEvent(
          new CustomEvent("site:reveal-resume", {
            detail: { centrePct: ((leftPx + widthPx / 2) / viewport) * 100 },
          }),
        );
      };

      collapse();

      // ── Entrance: band rect → full viewport ────────────────────────────
      const entrance = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "top top",
        scrub: true,
        invalidateOnRefresh: true,
        onEnter: captureBand,
        onEnterBack: resumeCapture,
        onUpdate: (self) => {
          if (!captured) captureBand();

          const p = gsap.utils.clamp(0, 1, self.progress);
          const viewport = layoutWidth();

          const left = gsap.utils.interpolate(startLeft, 0, p);
          const width = gsap.utils.interpolate(startWidth, viewport, p);
          const right = Math.max(0, viewport - (left + width));

          setClip(0, right, 0, Math.max(0, left));
          setBand(left, width);
          syncHeaderCover(width > 0, section.getBoundingClientRect().top);
        },
        onLeave: () => {
          // Fully expanded. The hero is off screen by now and its layers are
          // gated off, so hand the band back collapsed rather than full-bleed.
          setClip(0, 0, 0, 0);
          resumeBand(startLeft, startWidth);
        },
        onLeaveBack: () => {
          // Back above the hero — hand the band to the cursor again, and let
          // the next downward pass re-measure from wherever it then sits.
          collapse();
          captured = false;
          resumeBand(startLeft, startWidth);
        },
      });

      // ── Exit: the blue's top edge sweeps down through the VIEWPORT ─────
      // Driving clip-top straight from 0 → section height fails: by the time
      // this range runs, the section's top is far above the viewport, so the
      // edge recedes through off-screen space and nothing appears to change
      // until the section has almost gone. Everything below is computed from
      // the section's live viewport rect instead.
      const exit = ScrollTrigger.create({
        trigger: section,
        start: "bottom bottom",
        end: EXIT_END,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = gsap.utils.clamp(0, 1, self.progress);
          const eased = p * p * (3 - 2 * p);

          const rect = section.getBoundingClientRect();
          const height = section.offsetHeight || rect.height;
          const viewportH = window.innerHeight;

          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(viewportH, rect.bottom);

          // Where the blue's top edge should sit on screen right now.
          const fieldTop = visibleTop + eased * (visibleBottom - visibleTop);
          const clipTop = clamp(0, height, fieldTop - rect.top);

          setClip(clipTop, 0, 0, 0);
          syncHeaderCover(eased < 0.999, fieldTop);
        },
        onLeaveBack: () => {
          setClip(0, 0, 0, 0);
        },
        onLeave: () => {
          // Fully lifted — nothing painted for the rest of the section.
          setClip(section.offsetHeight, 0, 0, 0);
          delete root.dataset.wipeCover;
        },
      });

      teardown = () => {
        entrance.kill();
        exit.kill();
        collapse();
        delete root.dataset.sectionWipe;
      };
    })();

    return () => {
      cancelled = true;
      delete document.documentElement.dataset.wipeCover;
      delete document.documentElement.dataset.sectionWipe;
      teardown();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      data-wipe-root
      className={`relative overflow-hidden ${className}`}
    >
      {children}

      <div
        ref={veilRef}
        aria-hidden="true"
        inert
        className="section-sticky pointer-events-none absolute inset-0 z-20 bg-accent"
      >
        {reveal}
      </div>
    </section>
  );
}
