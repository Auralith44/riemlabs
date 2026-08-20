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

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [hash, setHash] = useState("");
  const [pastHero, setPastHero] = useState(false);
  const { stop, start, scrollTo } = useSmoothScroll();

  const panelRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => setOpen(false), [pathname]);

  /**
   * The bar belongs to the hero, not to the document.
   *
   * It stays `fixed` so it can sit over the hero's own reveal band, but it is
   * only *present* while the hero is on screen — scroll past and it goes, the
   * same as any other content that has scrolled out of view, and it comes back
   * only on returning to the hero itself.
   *
   * Pages with no hero (`[data-hero]` is the home page's alone) keep the bar
   * throughout, because they have no equivalent section to bound it to and
   * would otherwise be left with no navigation at all.
   */
  useEffect(() => {
    setPastHero(false);

    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) return;

    const trigger = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      invalidateOnRefresh: true,
      onLeave: () => setPastHero(true),
      onEnterBack: () => setPastHero(false),
      onLeaveBack: () => setPastHero(false),
    });

    // A mid-page reload starts already past the hero, and ScrollTrigger only
    // reports transitions — not the state it began in.
    setPastHero(hero.getBoundingClientRect().bottom <= 0);

    return () => trigger.kill();
  }, [pathname]);

  useEffect(() => {
    const read = () => setHash(window.location.hash);
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [pathname]);

  // Freeze the page, wire Escape, and flag the open state on <html> so both
  // reveal layers suppress themselves behind the scrim.
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

  // Hidden bar, hidden band: the inverted copy is painted from the same
  // geometry, so leaving it behind would park a blue slab over the sections
  // below. `inert` follows the opacity so a keyboard user never tabs into a
  // bar that is not on screen.
  const hidden = pastHero && !open;
  const chromeState = hidden
    ? "pointer-events-none -translate-y-full opacity-0"
    : "translate-y-0 opacity-100";
  const chromeMotion =
    "transition-[opacity,transform] duration-520 ease-expo will-change-transform";

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
        className={`fixed inset-x-0 top-0 z-50 ${chromeMotion} ${chromeState}`}
      >
        <HeaderBar variant="base" {...barProps} />
      </header>

      {/* Inverted header copy, clipped to the cursor band. */}
      <div
        aria-hidden="true"
        inert
        className={`reveal-clip pointer-events-none fixed inset-x-0 top-0 z-[51] bg-accent pb-14 ${chromeMotion} ${chromeState}`}
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
