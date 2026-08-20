"use client";

import Link from "next/link";
import BracketLink from "@/components/BracketLink";
import LiveClock from "@/components/LiveClock";
import { useSmoothScroll } from "@/components/SmoothScrollProvider";
import { services } from "@/lib/services";
import { navigation, site, socials } from "@/lib/site";

export default function Footer() {
  const { scrollTo } = useSmoothScroll();
  const year = new Date().getFullYear();

  return (
    <footer className="hairline-t bg-bone">
      <div className="shell">
        {/* Contact band */}
        <div className="grid gap-x-gutter gap-y-12 py-section md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="meta text-ink/40">Next available — Q3 2026</p>
            <h2 className="mt-6 text-headline font-medium">
              Have a project
              <br />
              worth building?
            </h2>
            <a
              href={`mailto:${site.email}`}
              className="link-wipe mt-8 inline-block text-lede text-ink"
            >
              {site.email}
            </a>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <p className="meta text-ink/40">Index</p>
            <ul className="mt-6 space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-baseline gap-2 text-sm transition-colors duration-400 ease-expo hover:text-accent"
                  >
                    <span className="micro tnum text-ink/25 transition-colors duration-400 ease-expo group-hover:text-accent">
                      {item.index}
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2">
            <p className="meta text-ink/40">Elsewhere</p>
            <ul className="mt-6 space-y-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm transition-colors duration-400 ease-expo hover:text-accent"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>

            <p className="meta mt-10 text-ink/40">Services</p>
            <ul className="mt-6 space-y-3">
              {services.map((s) => (
                <li key={s.index}>
                  <Link
                    href="/services"
                    className="text-sm text-ink/70 transition-colors duration-400 ease-expo hover:text-accent"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Oversized wordmark */}
        <div className="hairline-t overflow-hidden py-8">
          <p className="select-none whitespace-nowrap text-display font-medium leading-none text-ink/[0.07]">
            {site.name.toUpperCase()}
          </p>
        </div>

        {/* Status bar */}
        <div className="hairline-t flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-6">
          <p className="meta text-ink/40">
            © {year} {site.name} — All rights reserved
          </p>

          <div className="flex items-center gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
            <LiveClock seconds label={`Based in ${site.city}`} />
          </div>

          <BracketLink onClick={() => scrollTo(0)} size="sm">
            Back to top
          </BracketLink>
        </div>
      </div>
    </footer>
  );
}
