import type { Project } from "@/lib/projects";

const INK = "#0D0D0D";
const HAIRLINE = "#E0E0DC";
const ACCENT = "#1B17FF";
const BONE = "#F4F4F0";

/**
 * Generated cover art.
 *
 * The studio ships no stock photography, so each project gets a constructed
 * plate drawn from the same primitives as the layout: hairlines, the grid, and
 * exactly one accent element.
 */
export default function ProjectVisual({
  variant,
  className = "",
}: {
  variant: Project["visual"];
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
      className={className}
    >
      <rect width="800" height="600" fill={BONE} />

      {/* Shared substrate: the same quarter-column grid used by the layout. */}
      <g stroke={HAIRLINE} strokeWidth="1">
        {[200, 400, 600].map((x) => (
          <line key={x} x1={x} y1="0" x2={x} y2="600" />
        ))}
        {[150, 300, 450].map((y) => (
          <line key={y} x1="0" y1={y} x2="800" y2={y} />
        ))}
      </g>

      {variant === "grid" && (
        <g>
          <rect x="120" y="120" width="360" height="360" fill={INK} />
          <rect x="320" y="240" width="360" height="240" fill={BONE} stroke={INK} />
          <rect x="560" y="120" width="120" height="120" fill={ACCENT} />
        </g>
      )}

      {variant === "arc" && (
        <g>
          <path d="M120 480 A 240 240 0 0 1 600 480 Z" fill={INK} />
          <path
            d="M240 480 A 120 120 0 0 1 480 480"
            fill="none"
            stroke={BONE}
            strokeWidth="2"
          />
          <circle cx="640" cy="180" r="56" fill={ACCENT} />
        </g>
      )}

      {variant === "stack" && (
        <g>
          {[
            { y: 140, w: 560, fill: INK },
            { y: 220, w: 400, fill: INK },
            { y: 300, w: 480, fill: ACCENT },
            { y: 380, w: 280, fill: INK },
          ].map((bar) => (
            <rect key={bar.y} x="120" y={bar.y} width={bar.w} height="44" fill={bar.fill} />
          ))}
          <rect x="120" y="140" width="560" height="284" fill="none" stroke={INK} />
        </g>
      )}

      {variant === "orbit" && (
        <g>
          {[200, 148, 96].map((r) => (
            <circle key={r} cx="400" cy="300" r={r} fill="none" stroke={INK} strokeWidth="1" />
          ))}
          <circle cx="400" cy="300" r="44" fill={INK} />
          <circle cx="400" cy="100" r="18" fill={ACCENT} />
          <line x1="400" y1="0" x2="400" y2="600" stroke={HAIRLINE} />
        </g>
      )}

      {variant === "rule" && (
        <g>
          <line x1="120" y1="480" x2="680" y2="120" stroke={INK} strokeWidth="2" />
          <line x1="120" y1="120" x2="680" y2="480" stroke={HAIRLINE} strokeWidth="2" />
          <rect x="120" y="120" width="560" height="360" fill="none" stroke={INK} />
          <rect x="368" y="268" width="64" height="64" fill={ACCENT} />
        </g>
      )}

      {variant === "column" && (
        <g>
          {[160, 260, 360, 460, 560].map((x, i) => {
            const height = [280, 180, 340, 120, 220][i];
            return (
              <rect
                key={x}
                x={x}
                y={480 - height}
                width="56"
                height={height}
                fill={i === 2 ? ACCENT : INK}
              />
            );
          })}
          <line x1="120" y1="480" x2="680" y2="480" stroke={INK} strokeWidth="2" />
        </g>
      )}
    </svg>
  );
}
