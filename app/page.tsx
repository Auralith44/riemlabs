import Link from "next/link";
import AboutSection from "@/components/AboutSection";
import BracketLink from "@/components/BracketLink";
import CTABanner from "@/components/CTABanner";
import HeroSpotlight from "@/components/HeroSpotlight";
import ProjectCard from "@/components/ProjectCard";
import SectionWipe from "@/components/SectionWipe";
import StatsBar from "@/components/StatsBar";
import RevealSection from "@/components/RevealSection";
import SectionHeader from "@/components/SectionHeader";
import { Fade } from "@/components/RevealText";
import { featuredProjects } from "@/lib/projects";
import { services } from "@/lib/services";

const SURFACE = [
  "Typographic scale & rhythm",
  "Composition and grid logic",
  "Motion, state, and feedback",
  "Imagery, tone, and voice",
];

const SYSTEM = [
  "Tokens and primitives",
  "Content model & routing",
  "Component contracts",
  "Performance & a11y budgets",
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero: dual-layer cursor spotlight ──────────────────────── */}
      <HeroSpotlight />

      {/* ── 01 / About Us — wipes in from the reveal band ──────────── */}
      <SectionWipe
        id="about"
        className="bg-canvas"
        reveal={<AboutSection variant="reveal" />}
      >
        <AboutSection />
      </SectionWipe>

      {/* ── Stats strip ────────────────────────────────────────────── */}
      <StatsBar />

      {/* ── 02 / Work ──────────────────────────────────────────────── */}
      <RevealSection className="bg-bone">
        <div className="shell py-section">
          <SectionHeader
            index="02"
            label="Work"
            lines={["Recent builds,", "in production."]}
            description="A short selection. Each project shipped with a documented system the client's own team now extends."
            aside={
              <BracketLink href="/work" size="sm">
                View all work
              </BracketLink>
            }
          />

          <div className="mt-20 border-t border-hairline">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} layout="row" />
            ))}
          </div>

          <Fade className="mt-14 flex flex-wrap items-center justify-between gap-6">
            <p className="meta text-ink/40">
              {featuredProjects.length} of 120+ shipped engagements
            </p>
            <BracketLink href="/work" variant="framed">
              Full index
            </BracketLink>
          </Fade>
        </div>
      </RevealSection>

      {/* ── 03 / Practice ──────────────────────────────────────────── */}
      <RevealSection className="bg-canvas">
        <div className="shell py-section">
          <SectionHeader
            index="03"
            label="Practice"
            lines={["Surface is what", "they see. System", "is why it holds."]}
            description="Two halves of the same job. We treat them as one deliverable, because a beautiful page on a weak system is a redesign waiting to happen."
            aside={
              <BracketLink href="/about" size="sm">
                About the studio
              </BracketLink>
            }
          />

          <div className="mt-20 grid border-t border-hairline md:grid-cols-2">
            {[
              { title: "Surface", sub: "The visible experience", items: SURFACE, index: "01" },
              { title: "System", sub: "The operating logic", items: SYSTEM, index: "02" },
            ].map((col, i) => (
              <Fade
                key={col.title}
                className={`py-12 ${i === 0 ? "md:border-r md:border-hairline md:pr-gutter" : "border-t border-hairline md:border-t-0 md:pl-gutter"}`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="micro tnum text-accent">{col.index}</span>
                  <h3 className="text-title font-medium">{col.title}</h3>
                </div>
                <p className="meta mt-3 text-ink/40">{col.sub}</p>

                <ul className="mt-10">
                  {col.items.map((item) => (
                    <li
                      key={item}
                      className="group flex items-center justify-between gap-6 border-b border-hairline py-4 text-sm transition-colors duration-400 ease-expo hover:text-accent"
                    >
                      {item}
                      <span className="micro text-ink/20 transition-colors duration-400 ease-expo group-hover:text-accent">
                        —
                      </span>
                    </li>
                  ))}
                </ul>
              </Fade>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── 04 / Services ──────────────────────────────────────────── */}
      <RevealSection className="bg-bone">
        <div className="shell py-section">
          <SectionHeader
            index="04"
            label="Services"
            lines={["Four ways we", "work with teams."]}
            description="Engagements are scoped to one of these, or run end to end as a single track from direction through handover."
            aside={
              <BracketLink href="/services" size="sm">
                Full breakdown
              </BracketLink>
            }
          />

          <div className="mt-20 grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
            {services.map((service) => (
              <Fade key={service.index}>
                <Link
                  href="/services"
                  className="group flex h-full flex-col justify-between gap-10 bg-canvas p-8 transition-colors duration-600 ease-expo hover:bg-bone lg:p-12"
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="micro tnum text-accent">{service.index}</span>
                      <span
                        aria-hidden="true"
                        className="text-ink/20 transition-all duration-600 ease-expo group-hover:translate-x-1 group-hover:text-accent"
                      >
                        →
                      </span>
                    </div>
                    <h3 className="mt-8 text-title font-medium transition-colors duration-400 ease-expo group-hover:text-accent">
                      {service.title}
                    </h3>
                    <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/55">
                      {service.short}
                    </p>
                  </div>

                  <ul className="flex flex-wrap gap-2">
                    {service.stack.map((tag) => (
                      <li key={tag} className="micro border border-hairline px-2 py-1 text-ink/45">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </Link>
              </Fade>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ── 05 / Contact ───────────────────────────────────────────── */}
      <CTABanner />
    </>
  );
}
