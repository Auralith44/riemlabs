"use client";

import { useEffect, useRef } from "react";

type Stat = { target: number; suffix: string; label: string };

const STATS: Stat[] = [
  { target: 100, suffix: "%", label: "On-Time Delivery" },
  { target: 10, suffix: "+", label: "Clients Served" },
  { target: 2, suffix: "", label: "Continents Reached" },
  { target: 2022, suffix: "", label: "Building Since" },
];

const DURATION = 1600;

/**
 * Dark stats strip between About Us and Work.
 *
 * Figures count up on first entry, driven by one IntersectionObserver reading
 * `data-target` / `data-suffix` off each cell.
 */
export default function StatsBar() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cells = Array.from(root.querySelectorAll<HTMLElement>("[data-target]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const paint = (el: HTMLElement, value: number) => {
      el.textContent = `${Math.round(value)}${el.dataset.suffix ?? ""}`;
    };

    if (reduced) {
      cells.forEach((el) => paint(el, Number(el.dataset.target)));
      return;
    }

    // Start at zero so the first frame doesn't flash the final figure.
    cells.forEach((el) => paint(el, 0));

    const frames = new Map<HTMLElement, number>();

    const run = (el: HTMLElement) => {
      const target = Number(el.dataset.target) || 0;
      const started = performance.now();

      const step = (now: number) => {
        const t = Math.min(1, (now - started) / DURATION);
        // easeOutExpo — matches the system curve.
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        paint(el, target * eased);
        if (t < 1) frames.set(el, requestAnimationFrame(step));
      };

      frames.set(el, requestAnimationFrame(step));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          run(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.4 },
    );

    cells.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      frames.forEach((id) => cancelAnimationFrame(id));
    };
  }, []);

  return (
    <section className="border-y border-hairline bg-ink text-canvas">
      <div ref={rootRef} className="shell">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`py-12 lg:py-16 ${
                // Right rule between columns; bottom rule where the grid wraps.
                i < STATS.length - 1 ? "lg:border-r lg:border-canvas/15" : ""
              } ${i % 2 === 0 ? "border-r border-canvas/15 lg:border-r" : ""} ${
                i < 2 ? "border-b border-canvas/15 lg:border-b-0" : ""
              } ${i % 2 === 1 ? "pl-6 lg:pl-10" : "pr-6"} ${i % 2 === 0 ? "lg:pl-10 lg:first:pl-0" : ""}`}
            >
              <p
                data-target={stat.target}
                data-suffix={stat.suffix}
                className="tnum font-medium tracking-[-0.03em]"
                style={{ fontSize: "clamp(2.8rem, 5vw, 5rem)", lineHeight: "1" }}
              >
                0{stat.suffix}
              </p>
              <p className="micro mt-5 text-canvas/45">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
