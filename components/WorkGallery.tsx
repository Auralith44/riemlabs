"use client";

import { useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import ProjectCard from "@/components/ProjectCard";
import ProjectPreview from "@/components/ProjectPreview";
import { EASE, gsap } from "@/lib/gsap";
import { categories, projects, type Project, type ProjectCategory } from "@/lib/projects";

type Filter = "ALL" | ProjectCategory;

export default function WorkGallery() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [preview, setPreview] = useState<Project | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["ALL", projects.length]]);
    categories.forEach((c) => map.set(c, projects.filter((p) => p.category === c).length));
    return map;
  }, []);

  const visible = useMemo(
    () => (filter === "ALL" ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );

  // Re-stagger the grid whenever the filter changes.
  useGSAP(
    () => {
      const cards = gridRef.current?.querySelectorAll("article");
      if (!cards?.length) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(cards, { clearProps: "all" });
        return;
      }

      gsap.fromTo(
        cards,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: EASE, stagger: 0.06, overwrite: true },
      );
    },
    { dependencies: [filter], scope: gridRef },
  );

  return (
    <>
      {/* Filter bar */}
      <div
        role="group"
        aria-label="Filter projects by category"
        className="flex flex-wrap items-center gap-x-2 gap-y-3 border-y border-hairline py-5"
      >
        {(["ALL", ...categories] as Filter[]).map((cat) => {
          const active = filter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              aria-pressed={active}
              className={`meta group inline-flex items-baseline gap-1.5 border px-3 py-2 transition-colors duration-400 ease-expo ${
                active
                  ? "border-accent text-accent"
                  : "border-hairline text-ink/50 hover:border-accent hover:text-accent"
              }`}
            >
              <span
                aria-hidden="true"
                className={`transition-transform duration-400 ease-expo ${
                  active ? "text-accent" : "text-ink/20 group-hover:text-accent"
                }`}
              >
                [
              </span>
              {cat === "ALL" ? "All work" : cat}
              <span className="tnum text-[0.5625rem] opacity-50">{counts.get(cat)}</span>
              <span
                aria-hidden="true"
                className={`transition-transform duration-400 ease-expo ${
                  active ? "text-accent" : "text-ink/20 group-hover:text-accent"
                }`}
              >
                ]
              </span>
            </button>
          );
        })}

        <p className="meta ml-auto text-ink/35" aria-live="polite">
          {visible.length} {visible.length === 1 ? "project" : "projects"}
        </p>
      </div>

      <div
        ref={gridRef}
        className="mt-16 grid gap-x-gutter gap-y-20 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((project) => (
          <ProjectCard
            key={project.slug}
            project={project}
            onPreview={setPreview}
            reveal={false}
          />
        ))}
      </div>

      <ProjectPreview project={preview} onClose={() => setPreview(null)} />
    </>
  );
}
