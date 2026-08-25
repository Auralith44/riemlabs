/**
 * Choreography data for the service-card glyph, transcribed from
 * codedgar.com's own `Glyph.astro` source (its four real choreographies,
 * one per card — Riem has exactly four service cards too, so this maps
 * 1:1). See components/Glyph.tsx for how a choreography is played.
 */

export type TransitionStyle =
  | "scan-diagonal"
  | "build-up"
  | "radial"
  | "cascade"
  | "snake"
  | "columns"
  | "implode"
  | "simultaneous"
  | "random";

export type ChoreographyFrame = {
  /** 9-char string of 0/1, left-to-right top-to-bottom, index 0 = top-left. */
  pattern: string;
  transitionStyle: TransitionStyle;
  /** Pause, in seconds, after this frame's cell tweens finish before the next frame starts. */
  holdDuration: number;
  cellDuration?: number;
  staggerUnit?: number;
};

export type Choreography = {
  name: string;
  /** Rest-state pattern, shown before hover and animated back to on hover-out. */
  idlePattern: string;
  frames: ChoreographyFrame[];
  returnTransitionStyle: TransitionStyle;
};

/**
 * The brief's one concrete example (`data-pattern="101000101"`) is the only
 * idle pattern actually given — reused across all four cards rather than
 * invented per-card, since nothing distinguishes one card's rest state from
 * another's in the source material.
 */
const IDLE_PATTERN = "101000101";

const t = { cellDuration: 0.08, staggerUnit: 0.02 };

export const choreographies: Choreography[] = [
  {
    name: "Diagnosing Complexity",
    idlePattern: IDLE_PATTERN,
    frames: [
      { ...t, pattern: "100000001", transitionStyle: "cascade", holdDuration: 0.06 },
      { ...t, pattern: "000010000", transitionStyle: "implode", holdDuration: 0.06 },
      { ...t, pattern: "000111000", transitionStyle: "scan-diagonal", holdDuration: 0.05 },
      { ...t, pattern: "010010010", transitionStyle: "columns", holdDuration: 0.05 },
      { ...t, pattern: "010111010", transitionStyle: "radial", holdDuration: 0.06 },
      { ...t, pattern: "111010111", transitionStyle: "build-up", holdDuration: 0.06 },
      { ...t, pattern: "111111111", transitionStyle: "simultaneous", holdDuration: 0.08 },
      { ...t, pattern: "111101111", transitionStyle: "implode", holdDuration: 0.06 },
      { ...t, pattern: "010111010", transitionStyle: "radial", holdDuration: 0 },
    ],
    returnTransitionStyle: "radial",
  },
  {
    name: "Building",
    idlePattern: IDLE_PATTERN,
    frames: [
      { ...t, pattern: "000000100", transitionStyle: "build-up", holdDuration: 0.05 },
      { ...t, pattern: "000000111", transitionStyle: "build-up", holdDuration: 0.06 },
      { ...t, pattern: "100000111", transitionStyle: "columns", holdDuration: 0.05 },
      { ...t, pattern: "100000101", transitionStyle: "simultaneous", holdDuration: 0.05 },
      { ...t, pattern: "101000101", transitionStyle: "cascade", holdDuration: 0.06 },
      { ...t, pattern: "101010101", transitionStyle: "radial", holdDuration: 0.06 },
      { ...t, pattern: "111010111", transitionStyle: "build-up", holdDuration: 0.06 },
      { ...t, pattern: "111111111", transitionStyle: "scan-diagonal", holdDuration: 0.08 },
      { ...t, pattern: "111101111", transitionStyle: "implode", holdDuration: 0 },
    ],
    returnTransitionStyle: "cascade",
  },
  {
    name: "Expanding Influence",
    idlePattern: IDLE_PATTERN,
    frames: [
      { ...t, pattern: "010010010", transitionStyle: "columns", holdDuration: 0.05 },
      { ...t, pattern: "010111010", transitionStyle: "radial", holdDuration: 0.06 },
      { ...t, pattern: "110111011", transitionStyle: "cascade", holdDuration: 0.05 },
      { ...t, pattern: "111111111", transitionStyle: "radial", holdDuration: 0.08 },
      { ...t, pattern: "101010101", transitionStyle: "implode", holdDuration: 0.05 },
      { ...t, pattern: "010101010", transitionStyle: "simultaneous", holdDuration: 0.05 },
      { ...t, pattern: "111111111", transitionStyle: "radial", holdDuration: 0.06 },
      { ...t, pattern: "010111010", transitionStyle: "implode", holdDuration: 0 },
    ],
    returnTransitionStyle: "simultaneous",
  },
  {
    name: "Connecting Nodes",
    idlePattern: IDLE_PATTERN,
    frames: [
      { ...t, pattern: "100010000", transitionStyle: "simultaneous", holdDuration: 0.04 },
      { ...t, pattern: "100010001", transitionStyle: "cascade", holdDuration: 0.05 },
      { ...t, pattern: "100110001", transitionStyle: "radial", holdDuration: 0.05 },
      { ...t, pattern: "010111010", transitionStyle: "radial", holdDuration: 0.06 },
      { ...t, pattern: "101010101", transitionStyle: "cascade", holdDuration: 0.06 },
      { ...t, pattern: "111010111", transitionStyle: "build-up", holdDuration: 0.06 },
      { ...t, pattern: "111111111", transitionStyle: "simultaneous", holdDuration: 0.08 },
      { ...t, pattern: "101111101", transitionStyle: "implode", holdDuration: 0.06 },
      { ...t, pattern: "010111010", transitionStyle: "columns", holdDuration: 0 },
    ],
    returnTransitionStyle: "implode",
  },
];
