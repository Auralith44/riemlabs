"use client";

import Image from "next/image";
import Link from "next/link";
import type { PointerEvent as ReactPointerEvent, FocusEvent as ReactFocusEvent } from "react";
import { site } from "@/lib/site";
import logoSrc from "@/public/riem-labs-logo.png";

type HeaderBarProps = {
  variant: "base" | "reveal";
  open: boolean;
  /** True when the blue drawer band sits behind the bar. */
  bandVisible: boolean;
  onToggle?: () => void;
  onPointerEnter?: (e: ReactPointerEvent<HTMLButtonElement>) => void;
  onPointerLeave?: (e: ReactPointerEvent<HTMLButtonElement>) => void;
  onFocus?: (e: ReactFocusEvent<HTMLButtonElement>) => void;
  onBlur?: (e: ReactFocusEvent<HTMLButtonElement>) => void;
  buttonRef?: React.Ref<HTMLButtonElement>;
};

/**
 * The header's visual content, rendered twice.
 *
 * `base` is interactive. `reveal` is an inert white-on-accent copy living
 * inside the clipped band layer, so header text and icons invert wherever the
 * cursor band sweeps under them — the same base/reveal pairing the hero uses.
 * Every layout class must stay identical between the two.
 */
export default function HeaderBar({
  variant,
  open,
  bandVisible,
  onToggle,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  buttonRef,
}: HeaderBarProps) {
  const isReveal = variant === "reveal";

  // Inside the band everything is white; outside it follows the drawer state.
  const labelTone = isReveal ? "text-mist" : bandVisible ? "text-mist" : "text-graphite";
  const markTone = isReveal ? "bg-mist" : "bg-accent";
  const badgeTone = isReveal ? "text-mist" : bandVisible ? "text-mist" : "text-stone";
  const badgeDot = isReveal ? "bg-mist" : "bg-accent";

  const icon = (
    <span aria-hidden="true" className="relative block h-4 w-4">
      <span
        className={`absolute inset-0 grid grid-cols-2 gap-[3px] transition-all duration-400 ease-expo ${
          open ? "scale-50 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            data-header-mark={isReveal ? undefined : ""}
            className={`block h-1.5 w-1.5 rounded-none ${markTone}`}
          />
        ))}
      </span>

      <span
        className={`absolute inset-0 transition-all duration-400 ease-expo ${
          open ? "rotate-0 scale-100 opacity-100" : "-rotate-45 scale-75 opacity-0"
        }`}
      >
        <span
          data-header-mark={isReveal ? undefined : ""}
          className={`absolute left-0 top-1/2 h-px w-full -translate-y-1/2 rotate-45 ${markTone}`}
        />
        <span
          data-header-mark={isReveal ? undefined : ""}
          className={`absolute left-0 top-1/2 h-px w-full -translate-y-1/2 -rotate-45 ${markTone}`}
        />
      </span>
    </span>
  );

  const toggleClass = `group -mr-1 flex items-center gap-3 px-1 py-2 transition-colors duration-400 ease-expo ${labelTone}`;

  // 16px, normal tracking — deliberately not the `.meta` scale used elsewhere.
  const menuLabel = (
    <span
      data-header-tone={isReveal ? undefined : ""}
      className="font-mono text-base uppercase tracking-normal"
    >
      {open ? "Close" : "Menu"}
    </span>
  );

  return (
    <div className="flex h-[var(--header-h)] items-center justify-between gap-6 px-gutter">
      {isReveal ? (
        <span className="flex items-center">
          {/* brightness-0 invert renders the mark and wordmark pure white. */}
          <Image
            src={logoSrc}
            alt=""
            priority
            className="h-7 w-auto brightness-0 invert sm:h-8"
          />
        </span>
      ) : (
        <Link href="/" aria-label={`${site.name} — home`} className="flex items-center">
          <Image
            src={logoSrc}
            alt={site.name}
            priority
            data-header-logo=""
            className="h-7 w-auto sm:h-8"
          />
        </Link>
      )}

      <div className="relative flex flex-col items-end">
        {isReveal ? (
          <span className={toggleClass}>
            {menuLabel}
            {icon}
          </span>
        ) : (
          <button
            ref={buttonRef}
            type="button"
            data-reveal-anchor="menu"
            onClick={onToggle}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            onFocus={onFocus}
            onBlur={onBlur}
            aria-expanded={open}
            aria-controls="menu-drawer"
            className={toggleClass}
          >
            {menuLabel}
            {icon}
          </button>
        )}

        {/* Availability badge — stacked directly under the Menu toggle. */}
        <span
          className={`pointer-events-none absolute right-0 top-full mt-2 hidden items-center gap-2 whitespace-nowrap transition-opacity duration-400 ease-expo sm:inline-flex ${
            open ? "opacity-0" : "opacity-100"
          }`}
        >
          <span
            data-header-mark={isReveal ? undefined : ""}
            className={`h-1.5 w-1.5 rounded-full animate-pulse-dot ${badgeDot}`}
          />
          <span data-header-tone={isReveal ? undefined : ""} className={`micro ${badgeTone}`}>
            Available for Hire
          </span>
        </span>
      </div>
    </div>
  );
}
