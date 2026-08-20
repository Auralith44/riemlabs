import type { ElementType, ReactNode } from "react";

type RevealLinesProps = {
  /** Each string becomes one masked line that slides up independently. */
  lines: string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
};

/**
 * Pre-split heading. Lines are authored rather than measured at runtime, which
 * keeps the break points intentional and avoids a layout pass before reveal.
 */
export function RevealLines({
  lines,
  as: Tag = "h2",
  className = "",
  lineClassName = "",
}: RevealLinesProps) {
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span
          key={`${line}-${i}`}
          data-reveal-line
          className={`reveal-line ${lineClassName}`}
        >
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}

/** Marks an independent animation group inside a RevealSection. */
export function RevealBlock({
  children,
  className = "",
  onLoad = false,
}: {
  children: ReactNode;
  className?: string;
  /** Play on mount instead of waiting for the scroll trigger. */
  onLoad?: boolean;
}) {
  return (
    <div data-reveal-block={onLoad ? "load" : ""} className={className}>
      {children}
    </div>
  );
}

/** Fades and rises on reveal. */
export function Fade({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag data-reveal-fade className={className}>
      {children}
    </Tag>
  );
}
