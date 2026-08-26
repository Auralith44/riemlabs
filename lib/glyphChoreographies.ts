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
 * Four distinct idle patterns, one per card — an earlier pass reused a
 * single pattern (the four-corner mark) for all four, which is why every
 * card looked identical at rest. Paired thematically with each
 * choreography's own name below, not by any required mapping.
 */
const IDLE = {
  fourCorners: "101000101",
  topRow: "111000000",
  centerOnly: "000010000",
  diagonal: "100010001",
};

const t = { cellDuration: 0.08, staggerUnit: 0.02 };

export const choreographies: Choreography[] = [
  {
    name: "Diagnosing Complexity",
    idlePattern: IDLE.fourCorners,
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
    idlePattern: IDLE.topRow,
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
    idlePattern: IDLE.centerOnly,
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
    idlePattern: IDLE.diagonal,
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

/**
 * Site-wide pattern uniqueness.
 *
 * Only four full choreographies (idle pattern + real per-frame motion) were
 * ever transcribed from codedgar's source, and with ~30 Glyph instances now
 * live across the site, cycling those four repeatedly meant the same
 * pattern showed up both within a section and across different ones.
 *
 * Rather than inventing disconnected new shapes, every 9-cell pattern here
 * — idle and every frame — is put through the 3×3 grid's own symmetry
 * group (the eight operations that map a square onto itself: the identity,
 * three rotations, the two axis mirrors, and the two diagonal reflections).
 * Applying the same transform to a whole choreography's idle pattern and
 * every one of its frames keeps the motion internally coherent — a
 * genuinely different-looking shape, moving the same real way, rather than
 * a static pattern swap. Transition styles, durations, and stagger order
 * are left as sourced; only cell geometry moves. Four base choreographies
 * × eight symmetries is 32 candidates, more than the ~30 instances need
 * even after true duplicates (a base pattern that happens to be symmetric
 * under a given transform) are filtered out below.
 */
function toGrid(bits: string): string[][] {
  return [0, 1, 2].map((r) => [0, 1, 2].map((c) => bits[r * 3 + c]));
}
function fromGrid(g: string[][]): string {
  return g.flat().join("");
}
function rotate90(bits: string): string {
  const g = toGrid(bits);
  const out: string[][] = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) out[c][2 - r] = g[r][c];
  return fromGrid(out);
}
function mirrorH(bits: string): string {
  return fromGrid(toGrid(bits).map((row) => [...row].reverse()));
}
function mirrorV(bits: string): string {
  const g = toGrid(bits);
  return fromGrid([g[2], g[1], g[0]]);
}
function transpose(bits: string): string {
  const g = toGrid(bits);
  const out: string[][] = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) out[r][c] = g[c][r];
  return fromGrid(out);
}

const SYMMETRIES: Array<{ suffix: string; apply: (bits: string) => string }> = [
  { suffix: "", apply: (b) => b },
  { suffix: " · rot90", apply: rotate90 },
  { suffix: " · rot180", apply: (b) => rotate90(rotate90(b)) },
  { suffix: " · rot270", apply: (b) => rotate90(rotate90(rotate90(b))) },
  { suffix: " · mirror-h", apply: mirrorH },
  { suffix: " · mirror-v", apply: mirrorV },
  { suffix: " · transpose", apply: transpose },
  { suffix: " · anti-transpose", apply: (b) => mirrorH(mirrorV(transpose(b))) },
];

function transformChoreography(
  base: Choreography,
  { suffix, apply }: { suffix: string; apply: (bits: string) => string },
): Choreography {
  return {
    name: `${base.name}${suffix}`,
    idlePattern: apply(base.idlePattern),
    frames: base.frames.map((f) => ({ ...f, pattern: apply(f.pattern) })),
    returnTransitionStyle: base.returnTransitionStyle,
  };
}

function signature(c: Choreography): string {
  return `${c.idlePattern}|${c.frames.map((f) => f.pattern).join(",")}`;
}

const expanded: Choreography[] = [];
const seen = new Set<string>();
for (const base of choreographies) {
  for (const symmetry of SYMMETRIES) {
    const variant = transformChoreography(base, symmetry);
    const sig = signature(variant);
    if (seen.has(sig)) continue;
    seen.add(sig);
    expanded.push(variant);
  }
}

/**
 * The symmetry expansion above only reaches 24 unique choreographies, not
 * the 32 its 4 bases × 8 symmetries would suggest — several of the sourced
 * patterns (a checkerboard, a plus/cross, a full 3×3) are themselves
 * symmetric under one or more of these operations, so some transforms
 * collapse onto ones already generated. 24 is short of the ~30 instances
 * actually in use site-wide, so this tops the pool up using idle patterns
 * confirmed directly from codedgar's own source that the transform pass
 * above hadn't produced on its own — the batch-3 spot-check's eight
 * patterns, plus a few more pulled from mid-sequence frames of the four
 * real choreographies above (equally sourced data, just not anyone's
 * *resting* pattern until now). Each pairs with one of the four real frame
 * sequences (cycled for variety) rather than inventing new motion — only
 * the resting pattern is new here, same principle as the transform pass:
 * genuinely distinct at rest, not a disconnected new shape.
 */
const IDLE_TOP_UP = [
  "010010010",
  "101010101",
  "111101111",
  "010111010",
  "100010001",
  "101000101",
  "000111000",
  "000010000",
  "110111011",
  "101111101",
  "100110001",
  "010101010",
  "100000001",
  "000000100",
];
const usedIdles = new Set(expanded.map((c) => c.idlePattern));
let baseCursor = 0;
for (const pattern of IDLE_TOP_UP) {
  if (usedIdles.has(pattern)) continue;
  const base = choreographies[baseCursor % choreographies.length];
  baseCursor += 1;
  expanded.push({
    name: `${base.name} · idle ${pattern}`,
    idlePattern: pattern,
    frames: base.frames,
    returnTransitionStyle: base.returnTransitionStyle,
  });
  usedIdles.add(pattern);
}

/**
 * The full expanded pool. Each section on the site indexes into this with
 * its own fixed offset (see the CHOREO_OFFSETS below) rather than
 * `i % choreographies.length`, which is what caused the repeats across
 * sections in the first place.
 */
export const choreographyPool: Choreography[] = expanded;

/**
 * Fixed starting index per section, sized to that section's item count,
 * packed back-to-back through the pool — no two sections' ranges overlap,
 * so no two instances anywhere on the site draw the same choreography.
 * Total site-wide instances: 4+4+4+4+3+4+3+4 = 30, comfortably inside the
 * pool's size.
 */
export const CHOREO_OFFSETS = {
  homeWork: 0,
  homeServices: 4,
  aboutPrinciples: 8,
  aboutProcess: 12,
  workEngagement: 16,
  servicesOfferings: 19,
  servicesEngagementModels: 23,
  servicesProcess: 26,
} as const;

// The last section's last slot — an out-of-range index here would hand
// Glyph an `undefined` choreography and crash on render, not just repeat
// a pattern, so this fails at module load rather than silently.
if (choreographyPool.length < CHOREO_OFFSETS.servicesProcess + 4) {
  throw new Error(
    `glyphChoreographies: pool has ${choreographyPool.length} entries, needs at least ${CHOREO_OFFSETS.servicesProcess + 4}`,
  );
}
