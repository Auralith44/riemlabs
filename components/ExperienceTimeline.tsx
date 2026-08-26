"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { experience } from "@/lib/experience";

/**
 * About page's `03 / Experience` timeline, modeled on muvevi.com/about's own
 * timeline — confirmed mechanism: entries themselves are static (no
 * fade/slide reveal), only the vertical connector line animates, its
 * `scaleY` driven continuously by scroll progress through the section
 * rather than a one-time IntersectionObserver trigger.
 */
export default function ExperienceTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.set(line, { transformOrigin: "50% 0%" });

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
      onUpdate: (self) => gsap.set(line, { scaleY: self.progress }),
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
          className="relative grid grid-cols-[16px_1fr] gap-x-6 pb-16 last:pb-0 sm:grid-cols-[200px_16px_1fr] sm:gap-x-8"
        >
          <div className="hidden flex-col justify-start pr-8 pt-0.5 text-right sm:flex">
            <span className="tnum text-sm text-ink/40">{entry.year}</span>
          </div>

          <div className="relative flex flex-col items-center pt-1">
            <div
              className={`relative z-10 h-3.5 w-3.5 shrink-0 rounded-full transition-colors duration-400 ease-expo ${
                entry.current ? "bg-accent" : "bg-ink/25"
              }`}
            />
          </div>

          <div className="flex flex-col gap-3 pt-0">
            <span className="micro text-ink/35 sm:hidden">{entry.year}</span>

            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1.5">
              <h3 className="text-title font-medium leading-tight">{entry.title}</h3>
              <span className="micro text-ink/40">{entry.subtitle}</span>
              {entry.current ? (
                <span className="micro flex items-center gap-1.5 text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
                  Current
                </span>
              ) : null}
            </div>

            <p className="max-w-xl text-sm leading-[1.8] text-ink/55">{entry.description}</p>

            <div className="mt-1 flex flex-wrap gap-1.5">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="micro border border-hairline px-2.5 py-1 text-ink/50"
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
