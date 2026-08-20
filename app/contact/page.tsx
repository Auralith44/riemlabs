import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import LiveClock from "@/components/LiveClock";
import PageIntro from "@/components/PageIntro";
import RevealSection from "@/components/RevealSection";
import SectionHeader from "@/components/SectionHeader";
import { Fade } from "@/components/RevealText";
import { site, socials } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a project with Riem Labs. Tell us the shape of the problem, the budget range, and the timeline.",
};

const FAQ = [
  {
    index: "01",
    q: "How quickly do you reply?",
    a: "Within two working days, always — including when the answer is that we're not the right studio for it.",
  },
  {
    index: "02",
    q: "Do you work with early-stage teams?",
    a: "Often. What matters is that someone on your side can make decisions quickly, not the size of the round.",
  },
  {
    index: "03",
    q: "Can you work with our engineers?",
    a: "Yes. Roughly half our engagements hand the front-end to an in-house team, which is why the documentation is part of the deliverable.",
  },
  {
    index: "04",
    q: "What if we only need part of it?",
    a: "Any of the four disciplines can be scoped on its own. An audit is usually the cheapest way to find out which you need.",
  },
];

export default function ContactPage() {
  return (
    <>
      <PageIntro
        index="04"
        label="Contact"
        lines={["Start a", "project."]}
        lede="The more specific the brief, the more useful our first reply. Tell us what you're building, what's hard about it, and roughly what you can spend."
        meta={[
          { label: "Email", value: site.email },
          { label: "Studio", value: `${site.city}, ${site.country}` },
          { label: "Response", value: "Within 2 working days" },
          { label: "Availability", value: "Q3 2026 — 2 slots" },
        ]}
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
                  <Fade>
                    <dt className="meta text-ink/35">Email</dt>
                    <dd className="mt-2">
                      <a
                        href={`mailto:${site.email}`}
                        className="link-wipe text-lede text-ink"
                      >
                        {site.email}
                      </a>
                    </dd>
                  </Fade>

                  <Fade>
                    <dt className="meta text-ink/35">Telephone</dt>
                    <dd className="mt-2">
                      <a
                        href={`tel:${site.phone.replace(/\s/g, "")}`}
                        className="link-wipe text-sm text-ink/70"
                      >
                        {site.phone}
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
                    Two engagement slots open for Q3 2026. Discovery typically starts four to
                    six weeks after signature.
                  </p>
                </Fade>
              </div>
            </aside>
          </div>
        </div>
      </RevealSection>

      {/* ── 04.2 / Questions ───────────────────────────────────────── */}
      <RevealSection className="bg-bone">
        <div className="shell py-section">
          <SectionHeader
            index="07"
            label="Before you write"
            lines={["The questions", "we get most."]}
          />

          <div className="mt-20 grid gap-x-gutter gap-y-12 md:grid-cols-2">
            {FAQ.map((item) => (
              <Fade key={item.index} className="border-t border-hairline pt-6">
                <span className="micro tnum text-accent">{item.index}</span>
                <h3 className="mt-6 text-title font-medium">{item.q}</h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/55">{item.a}</p>
              </Fade>
            ))}
          </div>
        </div>
      </RevealSection>
    </>
  );
}
