"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register once, on the client only. Module-level state survives fast-refresh
// re-evaluation, which keeps GSAP from warning about duplicate registration.
let registered = false;

if (typeof window !== "undefined" && !registered) {
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/**
 * GSAP's nearest equivalent to the system easing curve
 * `cubic-bezier(0.16, 1, 0.3, 1)` used by every CSS transition.
 */
export const EASE = "expo.out";

export const DURATION = {
  line: 1.05,
  fade: 0.9,
  fast: 0.45,
} as const;

export { gsap, ScrollTrigger };
