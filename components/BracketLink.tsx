"use client";

import Link from "next/link";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

/**
 * `inline` is the bracketed text link — [ Let's talk ] — and keeps its
 * brackets. `boxed` is the bordered button: no brackets at all, because the
 * border already does the job they were doing, and a box wrapped in brackets
 * reads as two containers for one control. `framed` and `solid` are the older
 * treatments, kept for the forms and the not-found page.
 */
type Variant = "inline" | "boxed" | "framed" | "solid";
type Size = "sm" | "md" | "lg";
/**
 * `dark` inverts the label for use on the ink surface. `reveal` is the
 * white-on-accent tone used by the reveal layers, where every part of the
 * control — label and both brackets — is a single mist value.
 */
type Tone = "light" | "dark" | "reveal";

type BracketLinkProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  size?: Size;
  tone?: Tone;
  disabled?: boolean;
  /** Brackets splay and scale on hover, and drift toward the pointer. */
  magnetic?: boolean;
  /**
   * Render as an inert `<span>` instead of a link or button.
   *
   * Reveal layers duplicate the real control so the two stay in pixel
   * register; the copy must never be focusable, announced, or clickable.
   * Rendering it from this component rather than by hand is what guarantees
   * the register — a hand-rolled mirror drifts the moment either side's
   * padding, tracking, or gap changes.
   */
  asStatic?: boolean;
  className?: string;
};

/** Peak bracket drift, in px, at the edges of the button. */
const MAGNET_X = 5;
const MAGNET_Y = 4;

const sizes: Record<Size, string> = {
  sm: "text-[0.6875rem] tracking-[0.14em] gap-1.5",
  md: "text-xs tracking-[0.12em] gap-2",
  lg: "text-sm tracking-[0.1em] gap-2.5",
};

const framePadding: Record<Size, string> = {
  sm: "px-3 py-2",
  md: "px-5 py-3",
  lg: "px-7 py-4",
};

/**
 * The studio's primary call to action: `[ Start a project ]`.
 * On hover the brackets push outward and the label takes the accent colour.
 */
export default function BracketLink({
  children,
  href,
  onClick,
  type = "button",
  variant = "inline",
  size = "md",
  tone = "light",
  disabled = false,
  magnetic = false,
  asStatic = false,
  className = "",
}: BracketLinkProps) {
  const dark = tone === "dark";
  const reveal = tone === "reveal";
  const boxed = variant === "boxed";

  /**
   * Writes the offsets the .magnetic rules in globals.css read from.
   *
   * The same pair is published on :root under --mirror-bracket-*, because a
   * reveal layer duplicating this control cannot see these inline values —
   * `.magnetic` resets --site-button-bracket-* to 0px on every element that
   * carries the class, the mirror included. Both layers therefore drift from
   * one source, written once per pointer event, and cannot fall out of step.
   */
  const setOffsets = (x: string, y: string, el: HTMLElement) => {
    el.style.setProperty("--site-button-bracket-x", x);
    el.style.setProperty("--site-button-bracket-y", y);
    document.documentElement.style.setProperty("--mirror-bracket-x", x);
    document.documentElement.style.setProperty("--mirror-bracket-y", y);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    setOffsets(`${dx * MAGNET_X}px`, `${dy * MAGNET_Y}px`, el);
  };

  const onPointerLeave = (event: ReactPointerEvent<HTMLElement>) => {
    setOffsets("0px", "0px", event.currentTarget);
  };

  // The static mirror is pointer-inert, so magnetic tracking would never fire
  // on it anyway — but the `magnetic` class stays, because the base control
  // carries it and both layers must resolve to the same box.
  const magnetProps = magnetic && !asStatic ? { onPointerMove, onPointerLeave } : {};

  const base = [
    "group relative inline-flex items-center justify-center font-mono uppercase",
    "transition-colors duration-400 ease-expo",
    magnetic && "magnetic",
    sizes[size],
    // Corner brackets are for bordered boxes only — the inline bracketed CTA
    // keeps its magnetic spread and never gets them.
    variant === "framed" &&
      `cta-box border ${reveal ? "border-mist/20" : "hover:border-accent"} ${
        dark ? "border-canvas/20" : reveal ? "" : "border-hairline"
      } ${framePadding[size]}`,
    // Outlined at rest, solid on hover, with the type inverting to whatever
    // the fill is not. Each tone names the surface it sits on: `light` is the
    // white page, `dark` the ink banner, `reveal` the accent field.
    boxed &&
      `border ${framePadding[size]} ${
        reveal
          ? "border-mist text-mist hover:bg-mist hover:text-accent"
          : dark
            ? "border-canvas/40 text-canvas hover:bg-canvas hover:text-ink"
            : "border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-canvas"
      }`,
    variant === "solid" &&
      `hover:bg-accent ${dark ? "bg-canvas text-ink hover:text-canvas" : "bg-ink text-canvas"} ${framePadding[size]}`,
    disabled && "pointer-events-none opacity-40",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const labelColor =
    boxed || variant === "solid"
      ? ""
      : reveal
        ? "text-mist"
        : `${dark ? "text-canvas" : "text-ink"} transition-colors duration-400 ease-expo group-hover:text-accent`;
  const bracketColor = reveal
    ? "text-mist"
    : variant === "solid"
      ? dark
        ? "text-ink/50"
        : "text-canvas/70"
      : "text-accent";

  // When magnetic, the splay + scale come from the .magnetic rules so the
  // pointer offset and the hover transform compose in one transform.
  const bracketMotion = magnetic
    ? ""
    : "transition-transform duration-400 ease-expo";

  const inner = boxed ? (
    children
  ) : (
    <>
      <span
        aria-hidden="true"
        data-bracket="open"
        className={`${bracketColor} ${bracketMotion} ${
          magnetic ? "" : "group-hover:-translate-x-1"
        }`}
      >
        [
      </span>
      <span data-bracket-label className={labelColor}>
        {children}
      </span>
      <span
        aria-hidden="true"
        data-bracket="close"
        className={`${bracketColor} ${bracketMotion} ${
          magnetic ? "" : "group-hover:translate-x-1"
        }`}
      >
        ]
      </span>
    </>
  );

  if (asStatic) {
    return <span className={base}>{inner}</span>;
  }

  if (href) {
    const external = /^(https?:|mailto:|tel:)/.test(href);

    if (external) {
      return (
        <a
          href={href}
          className={base}
          {...magnetProps}
          {...(href.startsWith("http")
            ? { target: "_blank", rel: "noreferrer noopener" }
            : {})}
        >
          {inner}
        </a>
      );
    }

    return (
      <Link href={href} className={base} {...magnetProps}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={base}
      {...magnetProps}
    >
      {inner}
    </button>
  );
}
