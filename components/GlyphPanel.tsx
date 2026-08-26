"use client";

import { useRef, useState, type ReactNode } from "react";
import Glyph, { type GlyphColor, type GlyphHandle } from "@/components/Glyph";
import type { Choreography } from "@/lib/glyphChoreographies";

type GlyphPanelProps = {
  choreography: Choreography;
  color?: GlyphColor;
  /** Applied to the hoverable wrapper — carries whatever card/row styling
   *  (background, borders, padding) the section already used. */
  className?: string;
  glyphClassName?: string;
  children: ReactNode;
};

/**
 * A section item whose plain index number has been replaced by the
 * animated 3×3 Glyph, choreographed on hover — the same mechanism already
 * shipped on the Services cards (see ServiceCard.tsx), generalized here so
 * every section in the site-wide glyph rollout shares one hover-tracking
 * implementation instead of six near-identical copies. `data-reveal-fade`
 * is set directly (rather than wrapping in `Fade`) so this can still be a
 * plain client component and keep the same scroll-in behavior every other
 * section item gets.
 */
export default function GlyphPanel({
  choreography,
  color,
  className = "",
  glyphClassName = "h-8 w-8",
  children,
}: GlyphPanelProps) {
  const glyphRef = useRef<GlyphHandle>(null);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      data-reveal-fade
      onMouseEnter={() => {
        setHovered(true);
        glyphRef.current?.play();
      }}
      onMouseLeave={() => {
        setHovered(false);
        glyphRef.current?.reset();
      }}
      className={className}
    >
      <Glyph
        ref={glyphRef}
        choreography={choreography}
        color={color}
        glow="soft"
        hovered={hovered}
        className={glyphClassName}
      />
      {children}
    </div>
  );
}
