import type { ReactNode } from "react";
import { Fade, RevealLines } from "@/components/RevealText";

type SectionHeaderProps = {
  /** Decimal section index, e.g. "02". */
  index: string;
  /** Section name shown beside the index, e.g. "Selected Work". */
  label: string;
  /** Headline, pre-split into masked lines. */
  lines?: string[];
  description?: string;
  /** Right-aligned metadata or a CTA. */
  aside?: ReactNode;
  className?: string;
};

/**
 * The recurring section frame: hairline rule, decimal index, headline.
 * Every major container on the site opens with one of these.
 */
export default function SectionHeader({
  index,
  label,
  lines,
  description,
  aside,
  className = "",
}: SectionHeaderProps) {
  return (
    <header className={`hairline-t pt-5 ${className}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3">
        <p className="meta flex items-baseline gap-2">
          <span className="tnum text-accent">{index}</span>
          <span className="text-ink/25">/</span>
          <span className="text-ink">{label}</span>
        </p>
        {aside ? <div className="meta text-ink/50">{aside}</div> : null}
      </div>

      {lines || description ? (
        <div className="mt-12 grid gap-x-gutter gap-y-8 md:grid-cols-12 lg:mt-16">
          {lines ? (
            <RevealLines
              as="h2"
              lines={lines}
              className="text-headline font-medium md:col-span-7 lg:col-span-8"
            />
          ) : null}

          {description ? (
            <Fade
              as="p"
              className="text-lede text-ink/55 md:col-span-5 md:pt-1 lg:col-span-4"
            >
              {description}
            </Fade>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
