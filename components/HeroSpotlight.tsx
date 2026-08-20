"use client";

import { useEffect, useRef } from "react";
import HeroContent from "@/components/HeroContent";

/** How much of the gap to close each frame — lower trails the cursor further. */
const LERP = 0.12;
/** Band width while active — 7rem, matching --reveal-axis-width. */
const ACTIVE_PX = 112;
/**
 * Collapse is timed, not lerped. A per-frame lerp decays asymptotically, so on
 * a slow frame rate it strands a few visible pixels of band indefinitely — the
 * "stuck blue line". A fixed duration reaches exactly 0 regardless of fps.
 */
const COLLAPSE_MS = 380;
/** Pointer must rest this long before the band collapses to a hairline. */
const IDLE_DELAY = 680;
/** Half of --reveal-axis-width (7rem), used to clamp against the edges. */
const HALF_BAND = 56;

/** Desktop, real cursor only. */
const ENABLE_QUERY = "(min-width: 64rem) and (hover: hover) and (pointer: fine)";

export default function HeroSpotlight() {
  const layerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const hero = sectionRef.current;
    if (!layer || !hero) return;

    const root = document.documentElement;
    const enabled = window.matchMedia(ENABLE_QUERY);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let frame = 0;
    let idleTimer: number | undefined;
    let currentPosition = 50;
    let targetPosition = 50;
    let currentWidth = 0;
    let targetWidth = 0;
    let collapseFrom = 0;
    let collapseStart = 0;
    let anchorEl: Element | null = null;
    let running = false;

    // Layout width, excluding the scrollbar — `--reveal-position` is a `%` that
    // resolves against the hero's content box, so measuring the pointer against
    // window.innerWidth (which includes the scrollbar) offsets the band.
    const layoutWidth = () =>
      hero.clientWidth || document.documentElement.clientWidth || window.innerWidth;

    const clampPosition = (pct: number) => {
      // Keep the band inside the viewport rather than letting it clip off-edge.
      const halfPct = (HALF_BAND / layoutWidth()) * 100;
      return Math.min(100 - halfPct, Math.max(halfPct, pct));
    };

    // One tick writes both properties, so the band's geometry and the content
    // it clips can never be a frame out of step with each other.
    const tick = (now: number) => {
      // The band — and the header's inverted copy, which is fixed to the top of
      // the viewport — only exist while the hero is on screen. Without this the
      // header copy paints a blue block over Work, Practice and everything
      // below whenever the band has any width.
      if (hero.getBoundingClientRect().bottom > 0) root.dataset.revealReady = "true";
      else delete root.dataset.revealReady;

      // While the section wipe owns the transition it drives --reveal-position
      // and --reveal-width itself, so the band and the veil stay one shape.
      if (paused) {
        frame = window.requestAnimationFrame(tick);
        return;
      }

      currentPosition += (targetPosition - currentPosition) * LERP;

      if (targetWidth === 0) {
        const t = Math.min(1, (now - collapseStart) / COLLAPSE_MS);
        const eased = t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
        currentWidth = t >= 1 ? 0 : collapseFrom * (1 - eased);
      } else {
        currentWidth += (targetWidth - currentWidth) * LERP;
      }

      root.style.setProperty("--reveal-position", `${currentPosition.toFixed(3)}%`);
      root.style.setProperty("--reveal-width", `${currentWidth.toFixed(3)}px`);
      frame = window.requestAnimationFrame(tick);
    };

    const goIdle = () => {
      if (targetWidth === 0) return;
      root.dataset.revealActive = "false";
      collapseFrom = currentWidth;
      collapseStart = performance.now();
      targetWidth = 0;
    };

    const markActive = () => {
      root.dataset.revealActive = "true";
      targetWidth = ACTIVE_PX;
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(goIdle, IDLE_DELAY);
    };

    // While the section wipe owns the transition, the band freezes rather than
    // fighting it for the same screen space.
    let paused = false;

    const onRevealPause = () => {
      paused = true;
      window.clearTimeout(idleTimer);
    };

    const onRevealResume = (event: Event) => {
      paused = false;
      const detail = (event as CustomEvent<{ centrePct?: number }>).detail;

      if (typeof detail?.centrePct === "number" && Number.isFinite(detail.centrePct)) {
        // Pick up exactly where the scroll motion left the band. Width stays at
        // zero — the band is collapsed at rest anyway, so the next pointermove
        // opens it in place with no jump.
        currentPosition = clampPosition(detail.centrePct);
        targetPosition = currentPosition;
      }

      currentWidth = 0;
      targetWidth = 0;
      root.style.setProperty("--reveal-width", "0px");
      root.dataset.revealActive = "false";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (paused) return;
      if (anchorEl) {
        const rect = anchorEl.getBoundingClientRect();
        targetPosition = clampPosition(((rect.left + rect.width / 2) / layoutWidth()) * 100);
      } else {
        targetPosition = clampPosition((event.clientX / layoutWidth()) * 100);
      }
      markActive();
    };

    // Delegated: the anchor (menu button) lives in the header, mounted apart.
    const anchorFrom = (node: EventTarget | null) =>
      node instanceof Element ? node.closest("[data-reveal-anchor]") : null;

    const onPointerOver = (event: PointerEvent) => {
      if (paused) return;
      const found = anchorFrom(event.target);
      if (!found) return;
      anchorEl = found;
      const rect = found.getBoundingClientRect();
      targetPosition = clampPosition(((rect.left + rect.width / 2) / layoutWidth()) * 100);
      markActive();
    };

    const onPointerOut = (event: PointerEvent) => {
      const found = anchorFrom(event.target);
      if (!found || found !== anchorEl) return;
      if (event.relatedTarget instanceof Node && found.contains(event.relatedTarget)) return;
      anchorEl = null;
      markActive();
    };

    // Scrolling moves content under a stationary cursor, so the band would
    // otherwise hang around as a stray sliver at its last position. Collapse
    // it immediately; the next real pointermove re-opens it.
    const onScroll = () => {
      // Never collapse while the wipe is driving the band — that is what made
      // the stripe disappear from the hero mid-transition.
      if (paused) return;
      window.clearTimeout(idleTimer);
      anchorEl = null;
      if (root.dataset.revealActive === "true") goIdle();
    };

    const start = () => {
      if (running) return;
      running = true;
      root.dataset.revealReady = "true";
      root.dataset.revealActive = "false";
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("site:reveal-pause", onRevealPause);
      window.addEventListener("site:reveal-resume", onRevealResume);
      document.addEventListener("pointerover", onPointerOver);
      document.addEventListener("pointerout", onPointerOut);
      frame = window.requestAnimationFrame(tick);
    };

    const stop = () => {
      if (!running) return;
      running = false;
      delete root.dataset.revealReady;
      root.dataset.revealActive = "false";
      targetWidth = 0;
      currentWidth = 0;
      root.style.setProperty("--reveal-width", "0px");
      window.clearTimeout(idleTimer);
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("site:reveal-pause", onRevealPause);
      window.removeEventListener("site:reveal-resume", onRevealResume);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
    };

    const sync = () => (enabled.matches && !reduced.matches ? start() : stop());

    sync();
    enabled.addEventListener("change", sync);
    reduced.addEventListener("change", sync);

    return () => {
      stop();
      enabled.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-hero
      className="relative isolate overflow-hidden bg-mist"
    >
      {/* Layer 1 — the real, interactive hero. */}
      <div className="relative z-0">
        <HeroContent variant="base" />
      </div>

      {/* Laid out to the band's live geometry so its getBoundingClientRect()
          reports the band's real, currently-rendered position. The band itself
          is a clip-path, whose border box is the whole hero and therefore
          useless to measure. */}
      <div
        data-reveal-band-marker
        aria-hidden="true"
        className="pointer-events-none absolute top-0 h-px opacity-0"
        style={{
          left: "calc(var(--reveal-position) - var(--reveal-width) / 2)",
          width: "var(--reveal-width)",
        }}
      />

      {/* Layer 2 — inverted mirror, clipped to the band. */}
      <div
        ref={layerRef}
        aria-hidden="true"
        inert
        className="reveal-clip reveal-layer pointer-events-none absolute inset-0 z-20 bg-accent"
      >
        <HeroContent variant="reveal" />
      </div>
    </section>
  );
}
