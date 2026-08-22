import type { ReactNode } from "react";

type Logo = { name: string; svg: ReactNode };

/**
 * Monochrome marks, drawn inline rather than fetched.
 *
 * They inherit `currentColor`, so the row's own tone controls every logo at
 * once and there is no second palette to keep in step with the site's. These
 * are simplified interpretations of each brand mark, not the official assets —
 * accurate enough to read at 24px in a moving row, and worth swapping for the
 * real files if the brands' own SVGs are ever licensed in.
 */
const LOGOS: Logo[] = [
  {
    name: "Next.js",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10.25" />
        <path d="M8 7v10M8 7l8 10M16 7v6.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "React",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    name: "TypeScript",
    svg: (
      <svg viewBox="0 0 24 24" fill="none">
        <rect x="1.5" y="1.5" width="21" height="21" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <text
          x="12"
          y="16.5"
          fontFamily="Arial, sans-serif"
          fontWeight="700"
          fontSize="10"
          fill="currentColor"
          textAnchor="middle"
        >
          TS
        </text>
      </svg>
    ),
  },
  {
    name: "Tailwind CSS",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 9c.8-3 2.6-4.5 5.5-4.5 3.7 0 4.4 2.6 6 3 1.1.3 2-.1 2.7-1-.8 3-2.6 4.5-5.5 4.5-3.7 0-4.4-2.6-6-3-1.1-.3-2 .1-2.7 1z" />
        <path d="M.5 15.5c.8-3 2.6-4.5 5.5-4.5 3.7 0 4.4 2.6 6 3 1.1.3 2-.1 2.7-1-.8 3-2.6 4.5-5.5 4.5-3.7 0-4.4-2.6-6-3-1.1-.3-2 .1-2.7 1z" />
      </svg>
    ),
  },
  {
    name: "GSAP",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 8a6 6 0 1 0 1.5 6h-4.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Node.js",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2 21 7v10l-9 5-9-5V7z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Figma",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <circle cx="15" cy="6" r="3" />
        <path d="M9 3h3v6H9a3 3 0 1 1 0-6z" />
        <path d="M9 9h3v6H9a3 3 0 1 1 0-6z" />
        <circle cx="9" cy="18" r="3" />
        <path d="M12 9h3a3 3 0 1 1 0 6h-3z" opacity=".6" />
      </svg>
    ),
  },
  {
    name: "Vercel",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 3 22 20H2z" />
      </svg>
    ),
  },
  {
    name: "Docker",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="10" width="4" height="4" />
        <rect x="7" y="10" width="4" height="4" />
        <rect x="12" y="10" width="4" height="4" />
        <rect x="7" y="5" width="4" height="4" />
        <rect x="12" y="5" width="4" height="4" />
        <path d="M22 11c-1-2-3-2-3-2s-1 3-4 3H1s0 6 6 6c7 0 12-3 13.5-7 1.2.1 2-.3 2.5-1z" />
      </svg>
    ),
  },
  {
    name: "Python",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c-3 0-3 1.8-3 1.8v2h6v.8H6s-3 0-3 5 2.6 4.8 2.6 4.8h1.6v-2.2s0-2.6 2.6-2.6h4s2.4 0 2.4-2.4V4.4S16.5 2 12 2zm-1.7 1.6a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6z" />
        <path d="M12 22c3 0 3-1.8 3-1.8v-2H9v-.8h9s3 0 3-5-2.6-4.8-2.6-4.8h-1.6v2.2s0 2.6-2.6 2.6h-4s-2.4 0-2.4 2.4v3.8S7.5 22 12 22zm1.7-1.6a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6z" />
      </svg>
    ),
  },
];

/**
 * One track, its contents listed twice.
 *
 * The animation travels exactly -50% — the width of one full copy — so the
 * frame where it snaps back to 0 is identical to the frame before it and the
 * seam cannot be seen. `linear` is not a preference: any easing varies the
 * speed across the cycle, and the discontinuity at the wrap becomes visible as
 * a hitch.
 */
function Strip({
  direction = "normal",
  duration = 34,
}: {
  direction?: "normal" | "reverse";
  duration?: number;
}) {
  const track = [...LOGOS, ...LOGOS];

  return (
    <div className="logo-marquee">
      <div
        className="logo-marquee__track flex w-max items-center gap-12"
        style={{ animationDuration: `${duration}s`, animationDirection: direction }}
      >
        {track.map((logo, i) => (
          <div
            key={`${logo.name}-${i}`}
            /* The duplicate half is decoration; only the first pass is read. */
            aria-hidden={i >= LOGOS.length ? "true" : undefined}
            className="flex shrink-0 items-center gap-3 text-graphite/40 transition-colors duration-400 ease-expo hover:text-graphite"
          >
            <span className="block h-6 w-6 shrink-0">{logo.svg}</span>
            <span className="font-mono text-sm uppercase tracking-[0.08em]">{logo.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Tech-stack ticker. Sits directly under Work on the home page. */
export default function LogoMarquee() {
  return (
    <section aria-label="Tech stack" className="border-y border-hairline bg-canvas py-10">
      <Strip />
    </section>
  );
}
