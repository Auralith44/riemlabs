"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import HeaderBar from "@/components/HeaderBar";
import { EXIT_END } from "@/components/SectionWipe";
import { useSmoothScroll } from "@/components/SmoothScrollProvider";
import { ScrollTrigger } from "@/lib/gsap";
import { legalLinks, navigation } from "@/lib/site";

/** Panel geometry, mirrored from the --overlay-axis-* tokens. */
const AXIS_CLOSED = "calc(100% - 7rem)";
const AXIS_OPEN = "calc(100% - 25rem)";

/**
 * Scroll distance the bar is driven over, in px.
 *
 * Kept equal to --nav-travel (6.5rem) so the bar moves exactly one pixel per
 * pixel of scroll. That 1:1 relationship is the whole point: it makes the bar
 * read as part of the page rather than an element playing an animation, and
 * scrolling back up reverses it for free because it is the same mapping.
 */
const NAV_TRAVEL = 104;

/** Where the scroll-spy decides a section has become the current one. */
const SPY_LINE = 45;

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [navGone, setNavGone] = useState(false);
  /** Which menu entry the home page is currently scrolled into. */
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const { stop, start } = useSmoothScroll();

  const panelRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const goneRef = useRef(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => setOpen(false), [pathname]);

  /**
   * Freeze the page and flag the open state on <html>.
   *
   * The flag is what both reveal layers key off to suppress themselves, so
   * nothing is left tracking the pointer or sweeping behind the scrim while
   * the drawer is up. Lenis is stopped and the body is locked so the page
   * underneath cannot move at all — the drawer is the only thing on screen.
   */
  useEffect(() => {
    if (!open) {
      delete document.documentElement.dataset.menuOpen;
      start();
      return;
    }

    document.documentElement.dataset.menuOpen = "true";
    stop();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    const first = panelRef.current?.querySelector<HTMLAnchorElement>("a[href]");
    first?.focus();

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);

      // Never leave focus stranded inside a panel that is about to become
      // aria-hidden and non-interactive.
      if (panelRef.current?.contains(document.activeElement)) {
        toggleRef.current?.focus({ preventScroll: true });
      }
    };
  }, [open, stop, start]);

  /**
   * Where the bar is, as a 0-to-1 scroll progress on --nav-exit.
   *
   * Published on <html> and read by BOTH the real bar and its inverted reveal
   * copy, so the two can never travel by different amounts or in different
   * frames. Everything the bar contains moves as one piece.
   *
   * The home page has three regions. Through the hero the bar rises with the
   * page, one pixel per pixel, and is gone before the headline reaches the
   * top. It stays gone for the whole of About Us, whose accent field owns the
   * screen there. It docks again the moment that field finishes lifting, and
   * from then on it is simply the page's bar — content scrolls up under it and
   * is cut off at its rule. Scrolling back up reverses each region in turn.
   *
   * Interior pages have no hero and no wipe, so the bar is always docked.
   *
   * The React state is only for `inert`; it flips once per region rather than
   * on every scroll frame, so this does not re-render the drawer at 60fps.
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

    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) {
      apply(0);
      return () => {
        root.style.removeProperty("--nav-exit");
      };
    }

    // A zero-length trigger used purely to read the scroll position where the
    // veil finishes receding. Sharing EXIT_END with SectionWipe is what keeps
    // "the bar docks when the blue has gone" true rather than approximately
    // true — one string, one number, no drift if the wipe is ever retimed.
    const about = document.querySelector<HTMLElement>("#about");
    const dock = about
      ? ScrollTrigger.create({ trigger: about, start: EXIT_END, end: EXIT_END })
      : null;

    const at = (y: number) => {
      if (y <= NAV_TRAVEL) return y / NAV_TRAVEL;
      const docked = dock?.start;
      if (docked == null || y <= docked) return 1;
      return Math.max(0, 1 - (y - docked) / NAV_TRAVEL);
    };

    const driver = ScrollTrigger.create({
      start: 0,
      end: "max",
      invalidateOnRefresh: true,
      onUpdate: (self) => apply(at(self.scroll())),
      onRefresh: (self) => apply(at(self.scroll())),
    });

    apply(at(window.scrollY));

    return () => {
      driver.kill();
      dock?.kill();
      root.style.removeProperty("--nav-exit");
    };
  }, [pathname]);

  /**
   * Scroll-spy for the drawer's resting cue.
   *
   * The cue beside each entry marks where you actually are. On an interior
   * page that is just the route, but the home page carries every section at
   * once, so the entry has to follow the section crossing the middle of the
   * screen rather than sit permanently on the first one.
   */
  useEffect(() => {
    if (pathname !== "/") {
      setActiveKey(null);
      return;
    }

    const targets = navigation
      .map((item) => {
        const el =
          item.href === "/"
            ? document.querySelector<HTMLElement>("[data-hero]")
            : document.querySelector<HTMLElement>(`#${item.href.slice(1)}`);
        return el ? { href: item.href, el } : null;
      })
      .filter((t): t is { href: string; el: HTMLElement } => t !== null);

    if (targets.length === 0) return;

    const triggers = targets.map(({ href, el }) =>
      ScrollTrigger.create({
        trigger: el,
        start: `top ${SPY_LINE}%`,
        end: `bottom ${SPY_LINE}%`,
        onToggle: (self) => {
          if (self.isActive) setActiveKey(href);
        },
      }),
    );

    // onToggle only reports transitions, so seed from whatever is already
    // under the line — otherwise a mid-page reload shows the wrong entry.
    const seeded = triggers.findIndex((t) => t.isActive);
    setActiveKey(targets[seeded === -1 ? 0 : seeded].href);

    return () => triggers.forEach((t) => t.kill());
  }, [pathname]);

  // On the home page the current entry is whichever section you are in; on an
  // interior page it is the route. Index never matches a sub-route, or it
  // would light up on every page.
  const isActive = (href: string) => {
    if (pathname === "/") return href === (activeKey ?? "/");
    return href !== "/" && pathname.startsWith(href);
  };

  // Every entry is a real page now, so navigation is an ordinary link
  // traversal — nothing to intercept.

  // The drawer's accent panel appears only when the drawer is actually open.
  // It used to also peek out as a 7rem band on hover, which parked a blue
  // stripe against the bar on every page and cut across the availability
  // badge. The accent belongs to the cursor band in the hero, where it is a
  // surprise, not to a permanent affordance.
  const bandVisible = open;

  // `inert` follows the travel so a keyboard user never tabs into a bar that
  // has scrolled off the top. Never while the drawer is open — the toggle has
  // to stay reachable to close it.
  const hidden = navGone && !open;
  const chromeState = hidden ? "pointer-events-none" : "";

  const barProps = {
    open,
    bandVisible,
    onToggle: () => setOpen((v) => !v),
    buttonRef: toggleRef,
  };

  return (
    <>
      {/* The bar is opaque and carries a rule along its bottom edge. That
          rule is the site's horizon: everything scrolling up runs under the
          bar and is cut off there rather than fading out in open space, and
          everything scrolling back down emerges from it. */}
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
