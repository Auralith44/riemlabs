import Link from "next/link";
import AboutSection from "@/components/AboutSection";
import BracketLink from "@/components/BracketLink";
import CTABanner from "@/components/CTABanner";
import HeroSpotlight from "@/components/HeroSpotlight";
import LogoMarquee from "@/components/LogoMarquee";
import ProjectCard from "@/components/ProjectCard";
import SectionWipe from "@/components/SectionWipe";
import StatsBar from "@/components/StatsBar";
import RevealSection from "@/components/RevealSection";
import SectionHeader from "@/components/SectionHeader";
import { Fade } from "@/components/RevealText";
import { featuredProjects } from "@/lib/projects";
import { services } from "@/lib/services";

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
        trail={<AboutSection variant="trail" />}
      >
        <AboutSection />
      </SectionWipe>

      {/* ── Stats strip ────────────────────────────────────────────── */}
      <StatsBar />

      {/* ── 03 / Work ──────────────────────────────────────────────── */}
      <RevealSection id="work" className="bg-bone">
        <div className="shell py-section">
          <SectionHeader
            index="03"
            label="Work"
            lines={["Proven in production.", "Built for growth."]}
            description="A curated selection of custom web platforms and design systems — engineered for visual distinction, high performance, and real business impact."
          />

          <div className="mt-20 border-t border-hairline">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} layout="row" />
            ))}
          </div>

          <Fade className="mt-14 flex justify-end">
            <BracketLink href="/work" variant="boxed">
              View all work
            </BracketLink>
          </Fade>
        </div>
      </RevealSection>

      {/* ── Tech stack ─────────────────────────────────────────────── */}
      <LogoMarquee />

      {/* ── 04 / Services ──────────────────────────────────────────── */}
      <RevealSection id="services" className="bg-bone">
        <div className="shell py-section">
          <SectionHeader
            index="04"
            label="Services"
            lines={["Tailored digital solutions,", "engineered to endure."]}
            description="From targeted high-impact deliverables to full-scale platform infrastructure, we engineer digital solutions across the spectrum — built with precision, performance, and long-term utility."
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

          <Fade className="mt-14 flex justify-end">
            <BracketLink href="/services" variant="boxed">
              Explore all services
            </BracketLink>
          </Fade>
        </div>
      </RevealSection>

      {/* ── 05 / Contact ───────────────────────────────────────────── */}
      <CTABanner id="contact" />
    </>
  );
}
