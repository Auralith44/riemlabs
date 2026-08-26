"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import type { Choreography, TransitionStyle } from "@/lib/glyphChoreographies";

/**
 * Per-cell delay order for each transition style, transcribed from
 * codedgar.com's `Glyph.astro` source — a cell index (0-8, left-to-right
 * top-to-bottom) maps to a position in the stagger sequence, which is what
 * makes each choreography's frames read as a distinct shape of motion
 * (a sweep, a spiral, corners-first, etc.) rather than everything just
 * fading in at once.
 */
const ORDER: Record<TransitionStyle, ((i: number) => number) | Record<number, number>> = {
  "scan-diagonal": (i) => i,
  "build-up": { 6: 0, 7: 1, 8: 2, 3: 3, 4: 4, 5: 5, 0: 6, 1: 7, 2: 8 },
  radial: { 4: 0, 1: 1, 2: 2, 5: 3, 8: 4, 7: 5, 6: 6, 3: 7, 0: 8 },
  cascade: { 0: 0, 1: 1, 3: 2, 2: 3, 4: 4, 6: 5, 5: 6, 7: 7, 8: 8 },
  snake: { 0: 0, 1: 1, 2: 2, 5: 3, 8: 4, 7: 5, 6: 6, 3: 7, 4: 8 },
  columns: { 0: 0, 3: 1, 6: 2, 1: 3, 4: 4, 7: 5, 2: 6, 5: 7, 8: 8 },
  implode: { 0: 0, 2: 1, 8: 2, 6: 3, 1: 4, 5: 5, 7: 6, 3: 7, 4: 8 },
  simultaneous: () => 0,
  random: () => Math.random() * 8,
};

function orderOf(style: TransitionStyle, i: number) {
  const order = ORDER[style];
  return typeof order === "function" ? order(i) : (order[i] ?? 0);
}

const DEFAULT_CELL_DURATION = 0.08;
const DEFAULT_STAGGER = 0.02;

export type GlyphHandle = {
  /** Plays the full choreography forward, from whatever state the cells are in now. */
  play: () => void;
  /** Kills any in-flight animation and eases back to the idle pattern. */
  reset: () => void;
};

/**
 * The 3×3 animated glyph that replaces a service card's index number —
 * ported from codedgar.com's `Glyph.astro`. It has no hover listener of its
 * own: codedgar wires the choreography to the whole CARD's hover, not the
 * icon specifically (`data-parent-hover=".service-card"`), so this exposes
 * `play`/`reset` via a ref and the card triggers them from its own
 * onMouseEnter/onMouseLeave.
 */
export type GlyphColor = "blue" | "orange" | "black" | "green";

/**
 * Codedgar's three real Glyph colors, plus green as a deliberate extension
 * using the site's own existing `--status` token value rather than a
 * literal codedgar color — codedgar never applies green to this component
 * itself (see the color-variant note in globals.css, above the glow rules).
 */
const GLYPH_COLORS: Record<GlyphColor, string> = {
  blue: "#1B5DEF",
  orange: "#E25327",
  black: "#191818",
  green: "#22c55e",
};

type GlyphProps = {
  choreography: Choreography;
  className?: string;
  /** One of codedgar's Glyph colors — defaults to the site's own accent
   *  blue so the two already-shipped instances (Services, home Services)
   *  keep their exact current color when only adding glow. */
  color?: GlyphColor | "accent";
  glow?: "none" | "soft";
  /** Mirrors the parent card's own hover state — CSS `:hover` on the glyph
   *  itself is unreliable here, since a visitor typically hovers the card's
   *  title or body copy, not the small icon specifically. */
  hovered?: boolean;
};

const Glyph = forwardRef<GlyphHandle, GlyphProps>(function Glyph(
  { choreography, className = "", color = "accent", glow = "none", hovered = false },
  ref,
) {
    const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    const setFilled = (el: HTMLDivElement, bit: string) => {
      el.dataset.filled = bit === "1" ? "true" : "false";
    };

    // Idle pattern painted on mount, and whenever the assigned choreography
    // changes — instant, no tween, since this is the resting state rather
    // than a transition into it.
    useGSAP(() => {
      choreography.idlePattern.split("").forEach((bit, i) => {
        const el = cellRefs.current[i];
        if (el) {
          gsap.set(el, { opacity: bit === "1" ? 1 : 0, scale: bit === "1" ? 1 : 0.8 });
          setFilled(el, bit);
        }
      });
    }, [choreography]);

    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          timelineRef.current?.kill();
          const tl = gsap.timeline();
          // Absolute-second positions accumulate frame by frame, so each
          // frame's hold is a real gap before the next frame's cell tweens
          // begin, not just another stagger step.
          let cursor = 0;
          for (const frame of choreography.frames) {
            const cellDuration = frame.cellDuration ?? DEFAULT_CELL_DURATION;
            const staggerUnit = frame.staggerUnit ?? DEFAULT_STAGGER;
            let frameEnd = 0;
            frame.pattern.split("").forEach((bit, i) => {
              const el = cellRefs.current[i];
              if (!el) return;
              const delay = orderOf(frame.transitionStyle, i) * staggerUnit;
              tl.to(
                el,
                {
                  opacity: bit === "1" ? 1 : 0,
                  scale: bit === "1" ? 1 : 0.8,
                  duration: cellDuration,
                  ease: "power2.out",
                },
                cursor + delay,
              );
              tl.call(() => setFilled(el, bit), [], cursor + delay);
              frameEnd = Math.max(frameEnd, delay + cellDuration);
            });
            cursor += frameEnd + frame.holdDuration;
          }
          timelineRef.current = tl;
        },
        reset: () => {
          timelineRef.current?.kill();
          const tl = gsap.timeline();
          // Every cell eases to its idle target — GSAP tweens always animate
          // from the element's current actual value, so cells already at
          // idle simply don't move, regardless of exactly which frame the
          // forward choreography was interrupted on.
          choreography.idlePattern.split("").forEach((bit, i) => {
            const el = cellRefs.current[i];
            if (!el) return;
            const delay = orderOf(choreography.returnTransitionStyle, i) * DEFAULT_STAGGER;
            tl.to(
              el,
              {
                opacity: bit === "1" ? 1 : 0,
                scale: bit === "1" ? 1 : 0.8,
                duration: DEFAULT_CELL_DURATION,
                ease: "power2.out",
              },
              delay,
            );
            tl.call(() => setFilled(el, bit), [], delay);
          });
          timelineRef.current = tl;
        },
      }),
      [choreography],
    );

    const glyphColor = color === "accent" ? "var(--accent)" : GLYPH_COLORS[color];

    return (
      <div
        aria-hidden="true"
        data-glow={glow}
        data-hovered={hovered}
        className={`glyph grid grid-cols-3 grid-rows-3 gap-0.5 ${className}`}
        style={{ ["--glyph-color" as string]: glyphColor }}
      >
        {Array.from({ length: 9 }, (_, i) => (
          <div
            key={i}
            ref={(el) => {
              cellRefs.current[i] = el;
            }}
            className="glyph__cell h-full w-full rounded-[1px] bg-[var(--glyph-color)]"
          />
        ))}
      </div>
    );
  },
);

export default Glyph;
