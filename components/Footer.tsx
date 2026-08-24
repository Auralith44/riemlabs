"use client";

import Link from "next/link";
import BracketLink from "@/components/BracketLink";
import SocialIcon from "@/components/SocialIcon";
import { useSmoothScroll } from "@/components/SmoothScrollProvider";
import { services } from "@/lib/services";
import { legalLinks, navigation, site, socials } from "@/lib/site";

/**
 * One column of the right-hand navigation grid.
 *
 * `anchorLast` stretches the column to the row's full height and pins its
 * final item to the bottom of that box via `margin-top: auto`, rather than
 * leaving the whole column top-anchored at its own natural height. Every
 * column in the footer's top row uses it, alongside the same pattern on the
 * headline block, so every column's last link lands on one shared bottom
 * line regardless of which column's own content happens to be tallest —
 * a plain top-anchored column only guarantees that by coincidence, when it
 * happens to be the tallest thing in the row. The column's own header stays
 * exactly where it always was either way, since nothing above the list is
 * touched.
 */
function Column({
  title,
  children,
  anchorLast = false,
}: {
  title: string;
  children: React.ReactNode;
  anchorLast?: boolean;
}) {
  return (
    <nav
      aria-label={title}
      className={`w-40 shrink-0 sm:w-48 ${anchorLast ? "flex flex-col self-stretch" : ""}`}
    >
      <p className="font-mono text-[13px] uppercase tracking-[0.14em] text-ink/35">{title}</p>
      <ul
        className={`mt-5 space-y-2.5 ${
          anchorLast ? "flex flex-1 flex-col [&>li:last-child]:!mt-auto" : ""
        }`}
      >
        {children}
      </ul>
    </nav>
  );
}

const linkClass =
  "text-[14px] text-ink/70 transition-colors duration-400 ease-expo hover:text-accent";

export default function Footer() {
  const { scrollTo } = useSmoothScroll();
  const year = new Date().getFullYear();

  return (
    <footer className="hairline-t bg-bone">
      <div className="shell">
        {/* The band is deliberately shallow. Everything in it sits down against
            the rule below rather than floating in the middle of a tall block,
            so the wordmark under that rule reads as the floor of the page. */}
        <div className="pb-5 pt-14 lg:pt-16">
          {/* One flat row, four siblings — the headline block, then the
              three nav columns — sharing a single uniform `gap-x-12`, so the
              gap from the headline to Index is the same width as
              Index-to-Services and Services-to-Legal. That rules out
              `justify-between`, which pours all leftover space into one gap
              and leaves the other two cramped by comparison; the headline
              block instead grows via `flex-1` to soak up the row's
              remaining width itself, up to its own cap.

              All four siblings now share the same `self-stretch` +
              last-item-`mt-auto` shape: each fills the row's full height and
              pins its own bottom-most element there, whichever sibling
              actually establishes that height. That's what keeps every
              column's TOP in sync (nothing above the list is touched, so
              "Available for new projects" and the three column headers all
              still start flush at the row's top) while also keeping every
              column's BOTTOM-most element — the social icons on the left,
              Contact/the last Services link/Refund Policy on the right — on
              one shared line, regardless of which column's natural content
              happens to be tallest at a given viewport. */}
          <div className="flex flex-wrap items-start gap-x-12 gap-y-10">
            <div className="flex min-w-[16rem] max-w-[50rem] flex-1 flex-col self-stretch">
              <div>
                <p className="meta inline-flex items-center gap-2.5 text-ink/45">
                  <span className="status-dot" aria-hidden="true" />
                  Available for new projects
                </p>

                {/* Authored lines, not measured ones — same convention the
                    reveal headings use elsewhere (see README). A width-driven
                    wrap can land the break wherever the container happens to
                    be at a given viewport; this pins it at "the" every time —
                    but only once the wrapper is actually wide enough to hold
                    "Engineered systems for the" on one line at this size.
                    `hyphens-none break-keep` stops CSS's automatic
                    hyphenation, but the "-" already sitting inside
                    "performance-obsessed." is a real character, not a
                    hyphenation point — browsers treat it as a soft-wrap
                    opportunity regardless, so that line also gets its own
                    `whitespace-nowrap`.

                    Sized as an arbitrary value rather than jumping a full
                    Tailwind step (5xl → 6xl is 48px → 60px, a 25% jump) — a
                    smaller, deliberate bump that stays clear of the width
                    this row actually has left after widening the nav
                    columns. */}
                <h2 className="mt-5 text-[2.375rem] font-medium leading-none tracking-[-0.035em] hyphens-none break-keep lg:text-[3.25rem]">
                  <span className="block">Engineered systems for the</span>
                  <span className="block whitespace-nowrap">performance-obsessed.</span>
                </h2>
              </div>

              {/* Pure marks, no bounding box — and `!mt-auto` (not just
                  `mt-8`) is what pins them to the bottom of the stretched
                  column, on the same line the nav columns' last links land
                  on, rather than just trailing a fixed distance under the
                  headline. */}
              <ul className="mt-8 flex items-center gap-5 !mt-auto">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={s.label}
                      className="flex items-center justify-center text-ink/50 transition-colors duration-400 ease-expo hover:text-accent"
                    >
                      <SocialIcon name={s.icon} className="h-5 w-5" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <Column title="Index" anchorLast>
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </Column>

            <Column title="Services" anchorLast>
              {services.map((s) => (
                <li key={s.index}>
                  <Link href="/services" className={linkClass}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </Column>

            <Column title="Legal" anchorLast>
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </Column>
          </div>
        </div>

        {/* Oversized wordmark, sitting on the rule as the page's floor. */}
        <div className="hairline-t overflow-hidden py-6">
          <p
            className="select-none whitespace-nowrap font-medium leading-none text-ink/[0.07]"
            style={{ fontSize: "clamp(4rem, 11.2vw, 13rem)", letterSpacing: "-0.05em" }}
          >
            {site.name.toUpperCase()}
          </p>
        </div>

        {/* Status bar */}
        <div className="hairline-t flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-6">
          <p className="meta text-ink/40">
            © {year} {site.name} — All rights reserved
          </p>

          <p className="meta text-ink/40">
            Based in {site.city}, {site.country}
          </p>

          <BracketLink onClick={() => scrollTo(0)} size="sm">
            Back to top
          </BracketLink>
        </div>
      </div>
    </footer>
  );
}
