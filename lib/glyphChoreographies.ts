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
 * An earlier version of this pool deduplicated on the *full* sequence —
 * idle pattern plus every frame — which is the wrong granularity: several
 * of the sourced idle patterns (four corners, a lone center dot) are
 * themselves symmetric under some or all of the grid's eight symmetry
 * operations (three rotations, the two axis mirrors, the two diagonal
 * reflections, on top of the identity), so multiple "unique" full
 * sequences still shared the exact same *resting* pattern — the one thing
 * actually visible almost all the time, since a visitor is hovering a
 * given card for a fraction of a second at most. Home `03/Work`'s four
 * cards all landing on the four-corners idle, or About Principles and home
 * Services ending up with the identical four-pattern set in a different
 * order, both trace back to that: different full sequences, same idle.
 *
 * This dedupes on the idle pattern alone instead. Every 9-cell pattern
 * that appears anywhere in the four real transcribed choreographies —
 * not just their idle patterns, every one of their real intermediate
 * frames too, all genuinely sourced motion — is put through the same
 * eight-symmetry group, keeping only the first occurrence of each
 * resulting *pattern*. That alone yields several dozen genuinely distinct
 * resting shapes, comfortably past the ~30 instances live on the site,
 * without inventing anything disconnected from the real source data.
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

const SYMMETRIES: Array<(bits: string) => string> = [
  (b) => b,
  rotate90,
  (b) => rotate90(rotate90(b)),
  (b) => rotate90(rotate90(rotate90(b))),
  mirrorH,
  mirrorV,
  transpose,
  (b) => mirrorH(mirrorV(transpose(b))),
];

// Every pattern that appears anywhere in the real, transcribed source data
// — each choreography's idle pattern, and every one of its real frames.
const sourcePatterns: string[] = (() => {
  const set = new Set<string>();
  for (const c of choreographies) {
    set.add(c.idlePattern);
    for (const f of c.frames) set.add(f.pattern);
  }
  return [...set];
})();

// Every distinct pattern reachable from that source set via the grid's own
// symmetries, keeping only the first occurrence of each result.
const uniqueIdlePatterns: string[] = (() => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const pattern of sourcePatterns) {
    for (const apply of SYMMETRIES) {
      const transformed = apply(pattern);
      if (seen.has(transformed)) continue;
      seen.add(transformed);
      out.push(transformed);
    }
  }
  return out;
})();

/**
 * One full choreography per unique idle pattern — frame sequence and
 * return style borrowed from one of the four real ones (cycled for
 * variety), since only the resting pattern needs to be unique per
 * instance; the hover motion repeating across a few instances is fine.
 * Each entry's idlePattern is, by construction, distinct from every other
 * entry's — the property CHOREO_OFFSETS below relies on to guarantee no
 * two site-wide instances render the same pattern.
 */
export const choreographyPool: Choreography[] = uniqueIdlePatterns.map((idlePattern, i) => {
  const base = choreographies[i % choreographies.length];
  return {
    name: `${base.name} · pattern ${i}`,
    idlePattern,
    frames: base.frames,
    returnTransitionStyle: base.returnTransitionStyle,
  };
});

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
