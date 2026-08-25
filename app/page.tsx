import AboutSection from "@/components/AboutSection";
import BracketLink from "@/components/BracketLink";
import CTABanner from "@/components/CTABanner";
import HeroSpotlight from "@/components/HeroSpotlight";
import LogoMarquee from "@/components/LogoMarquee";
import ProjectCard from "@/components/ProjectCard";
import SectionWipe from "@/components/SectionWipe";
import ServiceCard from "@/components/ServiceCard";
import StatsBar from "@/components/StatsBar";
import RevealSection from "@/components/RevealSection";
import SectionHeader from "@/components/SectionHeader";
import { Fade } from "@/components/RevealText";
import { choreographies } from "@/lib/glyphChoreographies";
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
            {services.map((service, i) => (
              <Fade key={service.index}>
                <ServiceCard service={service} choreography={choreographies[i % choreographies.length]} />
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
