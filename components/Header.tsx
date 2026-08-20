"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import HeaderBar from "@/components/HeaderBar";
import { useSmoothScroll } from "@/components/SmoothScrollProvider";
import { ScrollTrigger } from "@/lib/gsap";
import { legalLinks, navigation } from "@/lib/site";

/** Panel geometry, mirrored from the --overlay-axis-* tokens. */
const AXIS_CLOSED = "calc(100% - 7rem)";
const AXIS_OPEN = "calc(100% - 25rem)";

/**
 * Scroll distance the bar is driven over, in px.
 *
 * Kept equal to --nav-travel (6.5rem) so the bar rises exactly one pixel per
 * pixel of scroll. That 1:1 relationship is the whole point: it makes the bar
 * read as part of the hero, scrolling away with it, rather than as a fixed
 * element playing an exit animation. Scrolling back up brings it down at the
 * same rate, for free, because it is the same mapping in reverse.
 */
const NAV_TRAVEL = 104;

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [hash, setHash] = useState("");
  const [navGone, setNavGone] = useState(false);
  const { stop, start, scrollTo } = useSmoothScroll();

  const panelRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const goneRef = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => setOpen(false), [pathname]);

  /**
   * The bar leaves at scroll pace and comes back the same way.
   *
   * --nav-exit is published on <html> and read by BOTH the real bar and its
   * inverted reveal copy, so the two can never travel by different amounts or
   * in different frames. Everything the bar contains — wordmark, toggle,
   * availability badge — sits inside those two elements and therefore moves as
   * one piece.
   *
   * The React state is only for `inert`; it flips once at the end of the
   * travel rather than on every scroll frame, so this does not re-render the
   * drawer sixty times a second.
   */
  useEffect(() => {
    const root = document.documentElement;
    const write = (p: number) => root.style.setProperty("--nav-exit", p.toFixed(4));

    const settle = (value: boolean) => {
      if (goneRef.current === value) return;
      goneRef.current = value;
      setNavGone(value);
    };

    const apply = (p: number) => {
      write(p);
      settle(p > 0.98);
    };

    apply(Math.min(1, Math.max(0, window.scrollY / NAV_TRAVEL)));

    const trigger = ScrollTrigger.create({
      start: 0,
      end: NAV_TRAVEL,
      invalidateOnRefresh: true,
      onUpdate: (self) => apply(self.progress),
      // onUpdate only fires inside the range; the ends have to be pinned or the
      // bar would freeze at whatever fraction it held when it left.
      onLeave: () => apply(1),
      onLeaveBack: () => apply(0),
      onEnterBack: (self) => apply(self.progress),
    });

    return () => {
      trigger.kill();
      root.style.removeProperty("--nav-exit");
    };
  }, [pathname]);

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return pathname === "/" && hash === href.slice(1);
    if (href === "/") return pathname === "/" && hash === "";
    return pathname.startsWith(href);
  };

  const onNavClick = (event: React.MouseEvent, href: string) => {
    if (!href.startsWith("/#") || pathname !== "/") return;

    event.preventDefault();
    const target = href.slice(1);
    const headerOffset =
      -(Number.parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue("--header-h"),
      ) || 0);

    window.history.replaceState(null, "", href);
    setHash(target);
    setOpen(false);
    window.setTimeout(() => scrollTo(target, headerOffset), 180);
  };

  // The closed 7rem band is a hover/keyboard affordance only. Mouse-click
  // focus must NOT pin it open — that would leave the blue panel parked on
  // screen after the drawer closes.
  const bandVisible = open || hovered || keyboardFocus;

  // `inert` follows the travel so a keyboard user never tabs into a bar that
  // has scrolled off the top. Never while the drawer is open — the toggle has
  // to stay reachable to close it.
  const hidden = navGone && !open;
  const chromeState = hidden ? "pointer-events-none" : "";

  const barProps = {
    open,
    bandVisible,
    onToggle: () => setOpen((v) => !v),
    onPointerEnter: () => setHovered(true),
    onPointerLeave: () => setHovered(false),
    onFocus: (e: React.FocusEvent<HTMLButtonElement>) =>
      setKeyboardFocus(e.currentTarget.matches(":focus-visible")),
    onBlur: () => setKeyboardFocus(false),
    buttonRef: toggleRef,
  };

  return (
    <>
      <header
        inert={hidden}
        className={`nav-chrome fixed inset-x-0 top-0 z-50 ${chromeState}`}
      >
        <HeaderBar variant="base" {...barProps} />
      </header>

      {/* Inverted header copy, clipped to the cursor band.

          The accent fill belongs to the bar's own row, NOT to this panel. The
          panel keeps its padding because clip-path clips to the border box and
          the availability badge hangs below the row on `top-full` — without the
          padding the badge falls outside the box and is clipped away. But when
          the padding also carried `bg-accent`, those 56px painted as an opaque
          blue slab with nothing drawn in it, stretched the full width at
          z-[51]. The hero's own footer row passes under exactly that strip on
          the way into About Us, and the slab masked the top of "Based in
          Nairobi" and "Let's talk" — which is why they read as smudges rather
          than the bright white their reveal copies actually compute to.

          The badge needs no fill of its own: the band that reveals this panel
          is the same band that turns the hero (and then the veil) blue
          underneath it, so there is always accent behind the badge wherever
          this copy is visible at all. */}
      <div
        aria-hidden="true"
        inert
        className="nav-chrome reveal-clip pointer-events-none fixed inset-x-0 top-0 z-[51] pb-14"
      >
        <HeaderBar variant="reveal" open={open} bandVisible={bandVisible} />
      </div>

      {/* Translucent scrim — present only while the panel is open. */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 z-30 transition-opacity duration-520 ease-expo ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ background: "rgba(242, 241, 235, 0.78)" }}
      />

      {/* Inline clip-path panel. Full-width element, revealed by clip only. */}
      <aside
        id="menu-drawer"
        ref={panelRef}
        aria-label="Primary"
        aria-hidden={!open}
        className={`drawer-panel fixed inset-y-0 right-0 z-40 w-full bg-accent text-mist ${
          bandVisible ? "opacity-100" : "opacity-0"
        } ${open ? "" : "pointer-events-none"}`}
        style={
          {
            "--overlay-axis-left": open ? AXIS_OPEN : AXIS_CLOSED,
            "--overlay-axis-right": "0px",
          } as React.CSSProperties
        }
      >
        <div className="ml-auto flex h-full w-drawer flex-col px-10 pb-10">
          {/* Eyebrow — shares the header row with the Close control that sits
              at the opposite end, so the two align vertically. */}
          <p
            style={{ transitionDelay: open ? "120ms" : "0ms" }}
            className={`flex h-[var(--header-h)] shrink-0 items-center gap-2 text-xs uppercase tracking-[0.12em] transition-all duration-600 ease-expo ${
              open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-none bg-mist" />
            <span className="text-mist">Menu</span>
            <span aria-hidden="true" className="text-mist/50">
              /
            </span>
            <span className="text-mist/80">
              {navigation[0].index}–{navigation[navigation.length - 1].index}
            </span>
          </p>

          <nav className="menu-nav mt-12">
            <ul>
              {navigation.map((item, i) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={(event) => onNavClick(event, item.href)}
                    tabIndex={open ? 0 : -1}
                    data-current={isActive(item.href) ? "true" : "false"}
                    style={{ transitionDelay: open ? `${140 + i * 55}ms` : "0ms" }}
                    className={`menu-link group flex items-baseline gap-4 border-b border-mist/15 py-[2.34rem] transition-all duration-600 ease-expo ${
                      open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                    }`}
                  >
                    <span className="micro tnum w-6 shrink-0 text-mist/45">{item.index}</span>

                    <span className="text-title font-medium text-mist transition-transform duration-600 ease-expo group-hover:translate-x-2">
                      {item.label}
                    </span>

                    <span className="menu-cue micro ml-auto whitespace-nowrap text-mist/70">
                      [ {item.cue} ]
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div
            style={{ transitionDelay: open ? "420ms" : "0ms" }}
            className={`mt-auto flex items-center gap-3 pt-10 transition-all duration-600 ease-expo ${
              open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            {legalLinks.map((link, i) => (
              <span key={link.href} className="flex items-center gap-3">
                {i > 0 ? (
                  <span aria-hidden="true" className="micro text-mist/35">
                    /
                  </span>
                ) : null}
                <Link
                  href={link.href}
                  tabIndex={open ? 0 : -1}
                  className="micro text-mist/60 transition-opacity duration-400 ease-expo hover:opacity-100"
                >
                  {link.label}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
