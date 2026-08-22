"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import HeaderBar from "@/components/HeaderBar";
import { EXIT_END } from "@/components/SectionWipe";
import { useSmoothScroll } from "@/components/SmoothScrollProvider";
import { ScrollTrigger } from "@/lib/gsap";
import { legalLinks, navigation } from "@/lib/site";

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

/**
 * How far down still counts as "at the top", in px.
 *
 * The availability note lives in the band between the bar and the page, which
 * is empty space only while nothing has scrolled up into it yet.
 */
const TOP_ZONE = 8;

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [navGone, setNavGone] = useState(false);
  /** True while the page is at rest at the very top. */
  const [atTop, setAtTop] = useState(true);
  /** Which menu entry the home page is currently scrolled into. */
  const [activeKey, setActiveKey] = useState<string | null>(null);
  /**
   * Where the marker's open animation starts from.
   *
   * "dot" when the pointer had already collapsed the four marks to centre
   * before the click, so the cross grows straight out of that single dot;
   * "grid" when the click came cold and the marks have to gather first.
   */
  const [origin, setOrigin] = useState<"grid" | "dot" | "close">("grid");
  const { stop, start } = useSmoothScroll();

  const panelRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const goneRef = useRef(false);
  const atTopRef = useRef(true);

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

    const settleTop = (value: boolean) => {
      if (atTopRef.current === value) return;
      atTopRef.current = value;
      setAtTop(value);
    };

    const hero = document.querySelector<HTMLElement>("[data-hero]");

    // A zero-length trigger used purely to read the scroll position where the
    // veil finishes receding. Sharing EXIT_END with SectionWipe is what keeps
    // "the bar docks when the blue has gone" true rather than approximately
    // true — one string, one number, no drift if the wipe is ever retimed.
    const about = hero ? document.querySelector<HTMLElement>("#about") : null;
    const dock = about
      ? ScrollTrigger.create({ trigger: about, start: EXIT_END, end: EXIT_END })
      : null;

    const at = (y: number) => {
      if (!hero) return 0;
      if (y <= NAV_TRAVEL) return y / NAV_TRAVEL;
      const docked = dock?.start;
      if (docked == null || y <= docked) return 1;
      return Math.max(0, 1 - (y - docked) / NAV_TRAVEL);
    };

    const apply = (y: number) => {
      const p = at(y);
      write(p);
      settle(p > 0.98);
      settleTop(y <= TOP_ZONE);
    };

    const driver = ScrollTrigger.create({
      start: 0,
      end: "max",
      invalidateOnRefresh: true,
      onUpdate: (self) => apply(self.scroll()),
      onRefresh: (self) => apply(self.scroll()),
    });

    apply(window.scrollY);

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

  /**
   * The marker's hover state is published as one flag on <html>, and read from
   * CSS by both the real bar and its reveal mirror. One writer, so the two
   * layers cannot disagree about whether the marks are gathered.
   *
   * It lives here rather than in the pointer-band driver because that driver
   * only runs on the home page, behind a desktop media query — the marker has
   * to react on every page the bar appears on.
   */
  const markAnchor = useCallback((active: boolean) => {
    const root = document.documentElement;
    if (active) root.dataset.revealAnchorActive = "menu";
    else if (root.dataset.revealAnchorActive === "menu") delete root.dataset.revealAnchorActive;
  }, []);

  useEffect(() => () => markAnchor(false), [markAnchor]);

  const onToggle = () => {
    const next = !open;
    setOrigin(
      next
        ? document.documentElement.dataset.revealAnchorActive === "menu"
          ? "dot"
          : "grid"
        : "close",
    );
    setOpen(next);
  };

  // `inert` follows the travel so a keyboard user never tabs into a bar that
  // has scrolled off the top. Never while the drawer is open — the toggle has
  // to stay reachable to close it.
  const hidden = navGone && !open;
  const chromeState = hidden ? "pointer-events-none" : "";

  const barProps = {
    open,
    bandVisible,
    atTop,
    origin,
    onToggle,
    onAnchor: markAnchor,
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
        <HeaderBar
          variant="reveal"
          open={open}
          bandVisible={bandVisible}
          atTop={atTop}
          origin={origin}
        />
      </div>

      {/* One fixed overlay root; the backdrop and the panel are absolute
          inside it. The panel used to be revealed by clip-path, which opened
          it as a widening slot — this slides the whole panel in from the edge
          instead, which is what the reference does and what reads as a drawer
          rather than a reveal. */}
      <div
        className="site-overlay fixed inset-0 z-[60]"
        data-overlay-state={open ? "open" : "closed"}
      >
        <button
          type="button"
          onClick={close}
          tabIndex={-1}
          aria-hidden="true"
          className="site-overlay__backdrop"
        />

        <aside
          id="menu-drawer"
          ref={panelRef}
          aria-label="Primary"
          aria-hidden={!open}
          className="site-overlay__panel bg-accent text-mist"
        >
          <div className="flex h-full flex-col px-gutter pb-8 sm:px-10 sm:pb-10">
          {/* The drawer carries its own bar. It sits above the site's, which is
              covered while this is open, so Close has to live in here — on a
              phone the panel is full-bleed and the real toggle is underneath
              it entirely. */}
          <div className="site-overlay__eyebrow flex h-[var(--header-h)] shrink-0 items-center justify-between gap-4">
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.12em]">
              <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-none bg-mist" />
              <span className="text-mist">Menu</span>
              <span aria-hidden="true" className="text-mist/50">
                /
              </span>
              <span className="text-mist/80">
                {navigation[0].index}–{navigation[navigation.length - 1].index}
              </span>
            </p>

            <button
              type="button"
              onClick={close}
              tabIndex={open ? 0 : -1}
              className="flex items-center gap-3 font-mono text-base uppercase tracking-normal text-mist"
            >
              Close
              <span aria-hidden="true" className="relative block h-4 w-4">
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 rotate-45 bg-mist" />
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 -rotate-45 bg-mist" />
              </span>
            </button>
          </div>

          <nav className="site-overlay__menu menu-nav mt-8 sm:mt-12">
            <ul>
              {navigation.map((item, i) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    tabIndex={open ? 0 : -1}
                    data-current={isActive(item.href) ? "true" : "false"}
                    className="menu-link group flex items-baseline gap-4 border-b border-mist/15 py-5 sm:py-[2.34rem]"
                  >
                    <span className="micro tnum w-6 shrink-0 text-mist/45">{item.index}</span>

                    <span className="text-title font-medium text-mist transition-transform duration-600 ease-expo group-hover:translate-x-2">
                      {item.label}
                    </span>

                    <span className="menu-cue micro ml-3 whitespace-nowrap text-mist/70 sm:ml-auto">
                      [ {item.cue} ]
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-overlay__footer mt-auto flex items-center gap-3 pt-8 sm:pt-10">
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
      </div>
    </>
  );
}
