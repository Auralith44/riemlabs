"use client";

import Link from "next/link";
import BracketLink from "@/components/BracketLink";
import SocialIcon from "@/components/SocialIcon";
import { useSmoothScroll } from "@/components/SmoothScrollProvider";
import { services } from "@/lib/services";
import { legalLinks, navigation, site, socials } from "@/lib/site";

/** One column of the right-hand navigation grid. */
function Column({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <nav aria-label={title}>
      <p className="micro text-ink/35">{title}</p>
      <ul className="mt-5 space-y-2.5">{children}</ul>
    </nav>
  );
}

const linkClass =
  "text-sm text-ink/70 transition-colors duration-400 ease-expo hover:text-accent";

export default function Footer() {
  const { scrollTo } = useSmoothScroll();
  const year = new Date().getFullYear();

  return (
    <footer className="hairline-t bg-bone">
      <div className="shell">
        {/* The band is deliberately shallow. Everything in it sits down against
            the rule below rather than floating in the middle of a tall block,
            so the wordmark under that rule reads as the floor of the page. */}
        <div className="grid gap-x-gutter gap-y-12 pb-10 pt-14 md:grid-cols-12 lg:pt-16">
          <div className="md:col-span-5">
            <p className="meta inline-flex items-center gap-2.5 text-ink/45">
              <span className="status-dot" aria-hidden="true" />
              Available for new projects
            </p>

            <h2 className="mt-5 max-w-[16ch] text-headline font-medium">
              Engineered systems for the performance-obsessed.
            </h2>

            <ul className="mt-8 flex items-center gap-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center border border-hairline text-ink/50 transition-colors duration-400 ease-expo hover:border-accent hover:text-accent"
                  >
                    <SocialIcon name={s.icon} className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-x-gutter gap-y-10 md:col-span-7 md:grid-cols-3">
            <Column title="Index">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </Column>

            <Column title="Services">
              {services.map((s) => (
                <li key={s.index}>
                  <Link href="/services" className={linkClass}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </Column>

            <Column title="Legal">
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
            style={{ fontSize: "clamp(3.5rem, 9.5vw, 11rem)", letterSpacing: "-0.045em" }}
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
