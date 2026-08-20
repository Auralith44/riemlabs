"use client";

import { useId, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import BracketLink from "@/components/BracketLink";
import { EASE, ScrollTrigger, gsap } from "@/lib/gsap";
import type { Service } from "@/lib/services";

function AccordionRow({
  service,
  open,
  onToggle,
}: {
  service: Service;
  open: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useGSAP(
    () => {
      const el = contentRef.current;
      if (!el) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap.to(el, {
        height: open ? "auto" : 0,
        opacity: open ? 1 : 0,
        duration: reduced ? 0 : 0.7,
        ease: EASE,
        // The page got taller or shorter — scroll triggers must re-measure.
        onComplete: () => ScrollTrigger.refresh(),
      });
    },
    { dependencies: [open] },
  );

  return (
    <div className="border-b border-hairline">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="group grid w-full grid-cols-12 items-baseline gap-x-gutter gap-y-3 py-8 text-left transition-colors duration-400 ease-expo hover:text-accent lg:py-10"
        >
          <span
            className={`micro tnum col-span-2 transition-colors duration-400 ease-expo md:col-span-1 ${
              open ? "text-accent" : "text-ink/30 group-hover:text-accent"
            }`}
          >
            {service.index}
          </span>

          <span
            className={`col-span-8 text-title font-medium transition-colors duration-400 ease-expo md:col-span-5 ${
              open ? "text-accent" : ""
            }`}
          >
            {service.title}
          </span>

          <span className="col-span-12 col-start-3 text-sm text-ink/50 transition-colors duration-400 ease-expo group-hover:text-accent md:col-span-4 md:col-start-7">
            {service.short}
          </span>

          {/* Plus → minus */}
          <span
            aria-hidden="true"
            className="col-span-2 flex justify-end md:col-span-2"
          >
            <span className="relative block h-3 w-3">
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
              <span
                className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-600 ease-expo ${
                  open ? "scale-y-0" : "scale-y-100"
                }`}
              />
            </span>
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        ref={contentRef}
        role="region"
        aria-hidden={!open}
        className="h-0 overflow-hidden opacity-0"
      >
        <div className="grid gap-x-gutter gap-y-10 pb-14 md:grid-cols-12">
          <p className="text-lede leading-relaxed text-ink/60 md:col-span-5 md:col-start-2">
            {service.body}
          </p>

          <div className="md:col-span-3">
            <p className="meta text-ink/35">Deliverables</p>
            <ul className="mt-5 space-y-3">
              {service.deliverables.map((d) => (
                <li key={d} className="flex gap-3 text-sm text-ink/70">
                  <span className="mt-[0.45rem] h-px w-3 shrink-0 bg-accent" />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <p className="meta text-ink/35">Stack</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {service.stack.map((s) => (
                <li
                  key={s}
                  className="micro border border-hairline px-2.5 py-1.5 text-ink/60 transition-colors duration-400 ease-expo hover:border-accent hover:text-accent"
                >
                  {s}
                </li>
              ))}
            </ul>

            <p className="meta mt-10 text-ink/35">Typical duration</p>
            <p className="mt-3 text-sm text-ink/70">{service.duration}</p>

            <BracketLink href="/contact" size="sm" className="mt-8">
              Scope this
            </BracketLink>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Expandable breakdown of the studio's four offerings. One open at a time. */
export default function ServiceAccordion({ services }: { services: Service[] }) {
  const [openIndex, setOpenIndex] = useState<string | null>(services[0]?.index ?? null);

  return (
    <div className="border-t border-hairline">
      {services.map((service) => (
        <AccordionRow
          key={service.index}
          service={service}
          open={openIndex === service.index}
          onToggle={() =>
            setOpenIndex((current) => (current === service.index ? null : service.index))
          }
        />
      ))}
    </div>
  );
}
