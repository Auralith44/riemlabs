"use client";

import { useCountUp } from "@/hooks/useReveal";
import { metrics } from "@/lib/services";

function Metric({
  value,
  suffix,
  label,
  note,
}: {
  value: string;
  suffix: string;
  label: string;
  note: string;
}) {
  const ref = useCountUp(Number(value));

  return (
    <div className="border-t border-hairline pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 lg:first:border-l-0 lg:first:pl-0">
      <p className="flex items-baseline gap-1 text-headline font-medium">
        <span ref={ref} className="tnum">
          {value}
        </span>
        <span className="text-accent">{suffix}</span>
      </p>
      <p className="meta mt-5 text-ink">{label}</p>
      <p className="mt-2 text-sm text-ink/45">{note}</p>
    </div>
  );
}

/** Four-column agency metric grid; each figure counts up on entry. */
export default function MetricGrid() {
  return (
    <div className="grid gap-x-gutter gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m) => (
        <Metric key={m.label} {...m} />
      ))}
    </div>
  );
}
