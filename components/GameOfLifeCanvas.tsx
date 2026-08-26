"use client";

import { useEffect, useRef } from "react";

const CELL_SIZE = 8;
const GAP = 1;
const PITCH = CELL_SIZE + GAP;
const STEP_MS = 280;
const DEAD_ALPHA = 0.03;
const LIVE_ALPHA = 0.22;
/** Per-frame ease rate toward the current target opacity — codedgar's own. */
const EASE = 0.08;
const MAX_GENERATIONS = 300;
const FADE_OUT_MS = 400;
const FADE_IN_MS = 600;
const SEED_DENSITY = 0.4;
/** --ink, #0d0d0d — Riem's near-black in place of codedgar's #191818. */
const COLOR = "13, 13, 13";

type Phase = "running" | "fading-out" | "fading-in";

function seed(cols: number, rows: number) {
  const alive = new Uint8Array(cols * rows);
  for (let i = 0; i < alive.length; i++) alive[i] = Math.random() < SEED_DENSITY ? 1 : 0;
  return alive;
}

function step(alive: Uint8Array, cols: number, rows: number) {
  const next = new Uint8Array(cols * rows);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let neighbors = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          neighbors += alive[nr * cols + nc];
        }
      }
      const i = r * cols + c;
      next[i] = alive[i] === 1 ? (neighbors === 2 || neighbors === 3 ? 1 : 0) : neighbors === 3 ? 1 : 0;
    }
  }
  return next;
}

function sameGrid(a: Uint8Array, b: Uint8Array) {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function population(alive: Uint8Array) {
  let n = 0;
  for (let i = 0; i < alive.length; i++) n += alive[i];
  return n;
}

/**
 * codedgar.com's dot-grid "world map" — not a fixed image, a live Conway's
 * Game of Life. Ported from its shipped source: 8px cells, 1px gap, dead
 * cells drawn at ~3% opacity and live ones at ~22% so the "continent" shape
 * is whatever the simulation currently looks like, not fixed coordinates.
 * Steps every 280ms; each cell's opacity eases toward its target every
 * frame (`+= (target - current) * 0.08`) for a soft flicker rather than a
 * hard on/off flip. Reseeds — fade out, reseed, fade in — once a run
 * stabilizes, dies out, or passes ~300 generations.
 *
 * Unlike codedgar's own bordered container, this one is deliberately
 * borderless (see the Contact page) — `overflow: hidden` stays, purely so
 * the canvas itself still clips to its box.
 */
export default function GameOfLifeCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let alive = new Uint8Array(0);
    let opacity = new Float32Array(0);
    let target = new Float32Array(0);
    let fadeFrom = new Float32Array(0);
    let phase: Phase = "fading-in";
    let phaseStart = 0;
    let phasePending = true;
    let generation = 0;
    let lastStep = 0;
    let prevAlive: Uint8Array | null = null;
    let stableFor = 0;
    let frame = 0;
    let visible = true;

    const setTargets = () => {
      for (let i = 0; i < alive.length; i++) target[i] = alive[i] ? LIVE_ALPHA : DEAD_ALPHA;
    };

    const reseed = () => {
      alive = seed(cols, rows);
      prevAlive = null;
      stableFor = 0;
      generation = 0;
      setTargets();
      phase = "fading-in";
      phasePending = true;
      fadeFrom = opacity.slice();
    };

    const beginFadeOut = () => {
      phase = "fading-out";
      phasePending = true;
      fadeFrom = opacity.slice();
    };

    const layout = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      const dpr = Math.min(2, window.devicePixelRatio || 1);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.max(1, Math.floor(width / PITCH));
      rows = Math.max(1, Math.floor(height / PITCH));
      alive = seed(cols, rows);
      opacity = new Float32Array(cols * rows).fill(0);
      target = new Float32Array(cols * rows);
      setTargets();
      fadeFrom = new Float32Array(cols * rows).fill(0);
      phase = "fading-in";
      phasePending = true;
      prevAlive = null;
      stableFor = 0;
      generation = 0;
      lastStep = 0;
    };

    const render = (now: number) => {
      if (phasePending) {
        phaseStart = now;
        phasePending = false;
      }

      if (phase === "running") {
        if (now - lastStep >= STEP_MS) {
          lastStep = now;
          const next = step(alive, cols, rows);
          generation += 1;

          if (prevAlive && sameGrid(next, prevAlive)) stableFor += 1;
          else stableFor = 0;
          prevAlive = alive;
          alive = next;
          setTargets();

          const pop = population(alive);
          if (pop === 0 || stableFor >= 3 || generation >= MAX_GENERATIONS) beginFadeOut();
        }
        for (let i = 0; i < opacity.length; i++) opacity[i] += (target[i] - opacity[i]) * EASE;
      } else if (phase === "fading-out") {
        const t = Math.min(1, (now - phaseStart) / FADE_OUT_MS);
        for (let i = 0; i < opacity.length; i++) opacity[i] = fadeFrom[i] * (1 - t);
        if (t >= 1) reseed();
      } else if (phase === "fading-in") {
        const t = Math.min(1, (now - phaseStart) / FADE_IN_MS);
        for (let i = 0; i < opacity.length; i++)
          opacity[i] = fadeFrom[i] + (target[i] - fadeFrom[i]) * t;
        if (t >= 1) phase = "running";
      }

      ctx.clearRect(0, 0, width, height);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const a = opacity[i];
          if (a <= 0.001) continue;
          ctx.fillStyle = `rgba(${COLOR}, ${a})`;
          ctx.fillRect(c * PITCH, r * PITCH, CELL_SIZE, CELL_SIZE);
        }
      }
    };

    const draw = (now: number) => {
      frame = window.requestAnimationFrame(draw);
      render(now);
    };

    const run = () => {
      window.cancelAnimationFrame(frame);
      if (reduced.matches) {
        for (let i = 0; i < opacity.length; i++) opacity[i] = target[i];
        render(performance.now());
        return;
      }
      if (!visible) return;
      frame = window.requestAnimationFrame(draw);
    };

    layout();
    run();

    const onResize = () => {
      layout();
      run();
    };
    window.addEventListener("resize", onResize);
    reduced.addEventListener("change", run);

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) run();
        else window.cancelAnimationFrame(frame);
      },
      { threshold: 0 },
    );
    observer.observe(host);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      reduced.removeEventListener("change", run);
      observer.disconnect();
    };
  }, []);

  return (
    // h-full w-full, not left to intrinsic sizing — the only child is the
    // absolutely-positioned canvas, which contributes nothing to this div's
    // own height, so without an explicit size this collapses to 0px and the
    // canvas gets floored to a 1px-tall buffer. The parent (PageIntro's
    // `headlineAside` slot) always gives this a real, definite box to fill.
    <div
      aria-hidden="true"
      role="presentation"
      className={`relative h-full w-full overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
