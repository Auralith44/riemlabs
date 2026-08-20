"use client";

import { useMemo, useSyncExternalStore } from "react";
import { site } from "@/lib/site";

/** `reveal` is the inert white-on-accent mirror painted inside a reveal layer. */
type Tone = "base" | "reveal";

type LiveClockProps = {
  /** Leading label, e.g. "BASED IN NAIROBI". Pass null to show time only. */
  label?: string | null;
  /** Include seconds and tick every second. */
  seconds?: boolean;
  tone?: Tone;
  className?: string;
};

function format(seconds: boolean) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    ...(seconds ? { second: "2-digit" as const } : {}),
    hour12: false,
    timeZone: site.timeZone,
  });
}

const placeholderFor = (seconds: boolean) => (seconds ? "--:--:--" : "--:--");

/**
 * One ticker shared by every mounted clock of the same precision.
 *
 * The hero renders this component twice — the real clock and the reveal
 * layer's mirror — stacked in pixel register. Two independent intervals can
 * fire on opposite sides of a second boundary and print different times, which
 * reads on screen as the two layers tearing apart. A single source, read by
 * every instance in the same React commit, cannot desync.
 */
type Clock = { value: string; listeners: Set<() => void>; timer?: number };

const clocks = new Map<boolean, Clock>();

function clockFor(seconds: boolean): Clock {
  let clock = clocks.get(seconds);
  if (!clock) {
    clock = { value: placeholderFor(seconds), listeners: new Set() };
    clocks.set(seconds, clock);
  }
  return clock;
}

function subscribeTo(seconds: boolean) {
  return (onChange: () => void) => {
    const clock = clockFor(seconds);
    clock.listeners.add(onChange);

    if (clock.timer === undefined) {
      const formatter = format(seconds);
      // Seed without notifying — useSyncExternalStore re-reads the snapshot
      // immediately after subscribing, so the first value lands either way.
      clock.value = formatter.format(new Date());
      clock.timer = window.setInterval(() => {
        const next = formatter.format(new Date());
        if (next === clock.value) return;
        clock.value = next;
        clock.listeners.forEach((listener) => listener());
      }, seconds ? 1000 : 15000);
    }

    return () => {
      clock.listeners.delete(onChange);
      if (clock.listeners.size === 0) {
        window.clearInterval(clock.timer);
        clock.timer = undefined;
      }
    };
  };
}

/**
 * Live local-time ticker for the studio's timezone.
 *
 * Renders a fixed-width placeholder on the server so the first paint matches
 * hydration — the real time only appears once we're client-side.
 */
export default function LiveClock({
  label = `Based in ${site.city}`,
  seconds = false,
  tone = "base",
  className = "",
}: LiveClockProps) {
  const subscribe = useMemo(() => subscribeTo(seconds), [seconds]);
  const time = useSyncExternalStore(
    subscribe,
    () => clockFor(seconds).value,
    () => placeholderFor(seconds),
  );

  const isReveal = tone === "reveal";
  const muted = isReveal ? "text-mist/70" : "text-ink/50";
  const figure = isReveal ? "text-mist" : "text-accent";

  return (
    <span className={`meta inline-flex items-center gap-2 whitespace-nowrap ${className}`}>
      {label ? <span className={muted}>{label}</span> : null}
      <span className={`tnum ${figure}`} suppressHydrationWarning>
        {time}
      </span>
      <span className={muted}>{site.timeZoneLabel}</span>
    </span>
  );
}
