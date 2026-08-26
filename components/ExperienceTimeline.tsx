"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { experience } from "@/lib/experience";

/**
 * Direct DOM class toggling rather than React state — this runs on every
 * scroll-scrubbed frame, and a re-render per frame for a dozen rows is the
 * kind of thing that shows up as jank. `bg-accent`/`text-accent`/etc. are
 * all already emitted classes elsewhere in the project, so Tailwind's
 * build has them regardless of never appearing as a literal string here.
 */
function setRowSpotlight(row: HTMLDivElement, on: boolean) {
  const year = row.querySelector<HTMLElement>("[data-tl-year]");
  const dot = row.querySelector<HTMLElement>("[data-tl-dot]");
  const tags = row.querySelectorAll<HTMLElement>("[data-tl-tag]");

  year?.classList.toggle("text-accent", on);
  year?.classList.toggle("text-ink/40", !on);

  // Current entries' dots are permanently accent + glow (11.2) — the
  // spotlight passing by must never revert one back to muted.
  if (dot && dot.dataset.current !== "true") {
    dot.classList.toggle("bg-accent", on);
    dot.classList.toggle("bg-ink/25", !on);
  }

  tags.forEach((tag) => {
    tag.classList.toggle("border-accent", on);
    tag.classList.toggle("text-accent", on);
    tag.classList.toggle("border-hairline", !on);
    tag.classList.toggle("text-ink/50", !on);
  });
}

/**
 * About page's `03 / Experience` timeline, modeled on muvevi.com/about's own
 * timeline — confirmed mechanism: entries themselves are static (no
 * fade/slide reveal); what animates is the vertical connector line's
 * `scaleY`, driven continuously by scroll progress, plus (11.3) a
 * traveling spotlight computed from that same scroll position — exactly
 * one entry lit at a time, the one the line's leading edge is currently
 * crossing, reusing this one ScrollTrigger rather than a second listener.
 */
export default function ExperienceTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const spotlightIndex = useRef(-1);

  useGSAP(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(line, { transformOrigin: "50% 0%" });

    const applySpotlight = (index: number) => {
      if (spotlightIndex.current === index) return;
      const previous = rowRefs.current[spotlightIndex.current];
      if (previous) setRowSpotlight(previous, false);
      const next = rowRefs.current[index];
      if (next) setRowSpotlight(next, true);
      spotlightIndex.current = index;
    };

    if (reduced) {
      gsap.set(line, { scaleY: 1 });
      return;
    }

    gsap.set(line, { scaleY: 0 });
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top 75%",
      end: "bottom 60%",
      scrub: true,
      onUpdate: (self) => {
        gsap.set(line, { scaleY: self.progress });

        // The single entry whose row the line's current leading edge has
        // reached (its top sits at or above that y) but not yet passed —
        // the last one in document order still true, so the spotlight
        // moves forward on the way down and back on the way up for free.
        const lineY = self.progress * (container.offsetHeight || 1);
        let target = -1;
        rowRefs.current.forEach((row, i) => {
          if (row && row.offsetTop <= lineY) target = i;
        });
        applySpotlight(target);
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div
        ref={lineRef}
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-[7px] top-0 w-px bg-ink/15 sm:left-[207px]"
      />

      {experience.map((entry, i) => (
        <div
          key={`${entry.year}-${entry.title}-${i}`}
          ref={(el) => {
            rowRefs.current[i] = el;
          }}
          className="relative grid grid-cols-[16px_1fr] gap-x-6 pb-16 last:pb-0 sm:grid-cols-[200px_16px_1fr] sm:gap-x-8"
        >
          <div className="hidden flex-col justify-start pr-8 pt-0.5 text-right sm:flex">
            <span data-tl-year className="tnum text-sm text-ink/40 transition-colors duration-400 ease-expo">
              {entry.year}
            </span>
          </div>

          <div className="relative flex flex-col items-center pt-1">
            {/* Two layers, matching muvevi's own .tl-dot: a solid static
                base (plus a ring outline for current entries) and, only for
                current entries, a second identically-shaped span scaled up
                via animate-ping — the expanding, fading "radar blip". The
                base itself doesn't animate; the ping layer is the whole
                effect, not a glow alongside it. */}
            <div
              data-tl-dot
              data-current={entry.current ? "true" : undefined}
              className={`relative z-10 h-3.5 w-3.5 shrink-0 rounded-full transition-colors duration-400 ease-expo ${
                entry.current ? "bg-accent ring-2 ring-offset-2 ring-offset-bone ring-accent" : "bg-ink/25"
              }`}
            >
              {entry.current ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 animate-ping rounded-full bg-accent opacity-60"
                />
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-0">
            <span className="micro text-ink/35 sm:hidden">{entry.year}</span>

            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
              <h3 className="text-title font-medium leading-tight">{entry.title}</h3>
              <span className="micro text-ink/40">{entry.subtitle}</span>
              {entry.current ? (
                <span className="micro text-accent">Current</span>
              ) : null}
            </div>

            <p className="max-w-xl text-sm leading-[1.8] text-ink/55">{entry.description}</p>

            <div className="mt-1 flex flex-wrap gap-1.5">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  data-tl-tag
                  className="micro border border-hairline px-2.5 py-1 text-ink/50 transition-colors duration-400 ease-expo"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
