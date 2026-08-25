import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import LiveClock from "@/components/LiveClock";
import PageIntro from "@/components/PageIntro";
import RevealSection from "@/components/RevealSection";
import { Fade } from "@/components/RevealText";
import { site, socials } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Riem Labs. Tell us the shape of the problem, the budget range, and the timeline.",
};

/** The Direct block's real inbox — deliberately not site.email, which is
 *  the legal pages' address. See the block below for why. */
const CONTACT_EMAIL = "riemlabs@gmail.com";
/** Secondary contact number, local to this page — site.phone is the primary. */
const SECONDARY_PHONE = "+254 790 775 636";

export default function ContactPage() {
  return (
    <>
      {/* headlineClassName: this page's headline runs noticeably narrower
          than every other page's — text-headline instead of the site
          default text-display, capped besides, so its rendered width lines
          up with the 01/About You column below rather than spanning full
          width. No metadata block below it any more (Part 1: removed
          outright, not just its values), so nothing else on this row needs
          to change to compensate. */}
      <PageIntro
        index="05"
        label="Contact"
        lines={["Scope your roadmap", "with our engineering team."]}
        lede="Whether you need a high-conversion platform, custom business automation, or a legacy codebase audit, tell us where your infrastructure stands today and we'll outline a structured roadmap forward."
        showClock={false}
        headlineClassName="text-headline max-w-[48rem]"
      />

      {/* ── 04.1 / Inquiry ─────────────────────────────────────────── */}
      <RevealSection className="bg-canvas">
        <div className="shell pb-section">
          <div className="grid gap-x-gutter gap-y-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            {/* Direct contact metadata */}
            <aside className="lg:col-span-4 lg:col-start-9">
              <div className="border-t border-hairline pt-8 lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
                <p className="meta flex items-baseline gap-2">
                  <span className="tnum text-accent">06</span>
                  <span className="text-ink/25">/</span>
                  <span>Direct</span>
                </p>

                <dl className="mt-10 space-y-8">
                  {/* Deliberately not site.email — that's the legal-pages
                      address (hello@riemlabs.com), while this block shows
                      the studio's actual inbox. Once the hero metadata block
                      (Part 1) and the "Or email…" line under Send Brief
                      (Part 6) are both gone, this is the only email on the
                      page, so the two addresses never appear side by side
                      to read as inconsistent. */}
                  <Fade>
                    <dt className="meta text-ink/35">Email</dt>
                    <dd className="mt-2">
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="link-wipe text-lede text-ink"
                      >
                        {CONTACT_EMAIL}
                      </a>
                    </dd>
                  </Fade>

                  {/* Two numbers, both tel: links and both WhatsApp-reachable
                      — site.phone is the primary (also what the Elsewhere
                      row's shared WhatsApp link below points to), the
                      secondary is local to this block since nothing else on
                      the site needs it. */}
                  <Fade>
                    <dt className="meta text-ink/35">Telephone</dt>
                    <dd className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <a
                        href={`tel:${site.phone.replace(/\s/g, "")}`}
                        className="link-wipe text-sm text-ink"
                      >
                        {site.phone}
                      </a>
                      <span className="micro text-ink/30">Primary</span>
                      <a
                        href={`https://wa.me/${site.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="micro text-ink/40 transition-colors duration-400 ease-expo hover:text-accent"
                      >
                        WhatsApp
                      </a>
                    </dd>
                    <dd className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <a
                        href={`tel:${SECONDARY_PHONE.replace(/\s/g, "")}`}
                        className="link-wipe text-sm text-ink/70"
                      >
                        {SECONDARY_PHONE}
                      </a>
                      <span className="micro text-ink/30">Secondary</span>
                      <a
                        href={`https://wa.me/${SECONDARY_PHONE.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="micro text-ink/40 transition-colors duration-400 ease-expo hover:text-accent"
                      >
                        WhatsApp
                      </a>
                    </dd>
                  </Fade>

                  <Fade>
                    <dt className="meta text-ink/35">Studio</dt>
                    <dd className="mt-2 text-sm text-ink/70">
                      {site.city}, {site.country}
                    </dd>
                    <dd className="mt-3">
                      <LiveClock seconds label="Local time" />
                    </dd>
                  </Fade>

                  <Fade>
                    <dt className="meta text-ink/35">Elsewhere</dt>
                    <dd className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                      {socials.map((s) => (
                        <a
                          key={s.label}
                          href={s.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-sm text-ink/70 transition-colors duration-400 ease-expo hover:text-accent"
                        >
                          {s.label}
                        </a>
                      ))}
                    </dd>
                  </Fade>
                </dl>

                <Fade className="mt-12 border border-hairline p-6">
                  <p className="meta flex items-center gap-2 text-ink/60">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
                    Available for hire
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-ink/55">
                    Q3 2026 — 2 slots open.
                  </p>
                </Fade>
              </div>
            </aside>
          </div>
        </div>
      </RevealSection>
    </>
  );
}
