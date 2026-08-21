"use client";

import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import logoSrc from "@/public/riem-labs-logo.png";

type HeaderBarProps = {
  variant: "base" | "reveal";
  open: boolean;
  /** True when the accent drawer sits behind the bar. */
  bandVisible: boolean;
  /** True while the page is at rest at the very top. */
  atTop: boolean;
  onToggle?: () => void;
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
  atTop,
  onToggle,
  buttonRef,
}: HeaderBarProps) {
  const isReveal = variant === "reveal";

  // Inside the band everything is white. Outside it the bar now paints its own
  // opaque row, so the label stays dark whatever the drawer is doing — going
  // white on `bandVisible` left "Close" as white-on-white once the row stopped
  // letting the accent panel show through from behind.
  const labelTone = isReveal ? "text-mist" : "text-graphite";
  const markTone = isReveal ? "bg-mist" : "bg-accent";
  const badgeTone = isReveal ? "text-mist" : bandVisible ? "text-mist" : "text-stone";
  const badgeDot = isReveal ? "bg-mist" : "bg-accent";

  // The four marks slide together into a single square on hover. The rule
  // that moves them lives in globals.css and is keyed off :has(), so it fires
  // on this copy AND on the reveal mirror from one hover — a `group-hover`
  // here would only ever reach the copy the pointer is actually over.
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
            data-nav-mark={i}
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

  // The bar is not a chrome slab sitting on top of the page — it IS the page,
  // painted in the same surface, with a rule under it. Two things follow from
  // that and both matter:
  //
  //   the fill is `mist`, the hero's own colour, so the top of the site reads
  //   as one field rather than a white strip laid over a warm one;
  //
  //   the rule is drawn by a pseudo-element inset to the page gutter, not a
  //   `border-b` on the row. A border spans the whole viewport edge to edge; a
  //   rule that starts and stops on the same margin as the wordmark and the
  //   headline belongs to the grid, and holds those endpoints at every scroll
  //   position and every viewport width because the inset is the same clamp
  //   the gutter itself uses.
  return (
    <div
      className={`relative flex h-[var(--header-h)] items-center justify-between gap-6 px-gutter after:absolute after:bottom-0 after:left-gutter after:right-gutter after:h-px after:content-[''] ${
        isReveal ? "bg-accent after:bg-mist/25" : "bg-mist after:bg-hairline"
      }`}
    >
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

      <div className="flex flex-col items-end">
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
            data-nav-toggle=""
            onClick={onToggle}
            aria-expanded={open}
            aria-controls="menu-drawer"
            className={toggleClass}
          >
            {menuLabel}
            {icon}
          </button>
        )}

      </div>

      {/* Availability note.
          Positioned against the ROW rather than the toggle, so it clears the
          rule instead of straddling it — it belongs to the band between the
          bar and the page, on the same right margin the rule ends on.

          That band is only empty while nothing has scrolled up into it, so the
          note is shown at rest at the top and withdrawn as soon as the page
          moves. Left up, it would sit on top of whatever body copy happened to
          be passing under the rule. */}
      <span
        className={`pointer-events-none absolute right-gutter top-full mt-3 hidden items-center gap-2 whitespace-nowrap transition-opacity duration-400 ease-expo sm:inline-flex ${
          atTop ? "opacity-100" : "opacity-0"
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
  );
}
