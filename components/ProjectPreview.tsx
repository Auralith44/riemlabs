"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import BracketLink from "@/components/BracketLink";
import ProjectVisual from "@/components/ProjectVisual";
import { useSmoothScroll } from "@/components/SmoothScrollProvider";
import { EASE, gsap } from "@/lib/gsap";
import type { Project } from "@/lib/projects";

type ProjectPreviewProps = {
  project: Project | null;
  onClose: () => void;
};

/** In-page project preview. Opens from a card plate on the work index. */
export default function ProjectPreview({ project, onClose }: ProjectPreviewProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { stop, start } = useSmoothScroll();

  // Escape to close, scroll frozen behind, focus moved into the dialog.
  useEffect(() => {
    if (!project) return;

    const restoreFocus = document.activeElement as HTMLElement | null;
    stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      start();
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      restoreFocus?.focus?.();
    };
  }, [project, onClose, stop, start]);

  useGSAP(
    () => {
      if (!project || !panelRef.current) return;

      gsap.fromTo(
        panelRef.current,
        { yPercent: 3, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.7, ease: EASE },
      );

      gsap.fromTo(
        panelRef.current.querySelectorAll("[data-preview-item]"),
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: EASE, stagger: 0.05, delay: 0.12 },
      );
    },
    { dependencies: [project?.slug] },
  );

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} preview`}
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
    >
      <button
        type="button"
        aria-label="Close preview"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/40 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        className="relative max-h-[92svh] w-full max-w-5xl overflow-y-auto border border-hairline bg-canvas no-scrollbar"
      >
        <div className="flex items-center justify-between gap-6 border-b border-hairline px-6 py-4 lg:px-10">
          <p className="meta flex items-baseline gap-2">
            <span className="tnum text-accent">{project.index}</span>
            <span className="text-ink/25">/</span>
            <span>{project.category}</span>
          </p>

          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="meta flex items-center gap-2 py-1 transition-colors duration-400 ease-expo hover:text-accent"
          >
            Close
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-2">
          <div
            data-preview-item
            className="aspect-[4/3] overflow-hidden border-b border-hairline lg:border-b-0 lg:border-r"
          >
            <ProjectVisual variant={project.visual} className="h-full w-full" />
          </div>

          <div className="flex flex-col gap-8 p-6 lg:p-10">
            <div data-preview-item>
              <h2 className="text-headline font-medium">{project.title}</h2>
              <p className="meta mt-3 text-ink/45">
                {project.client} — {project.year}
              </p>
            </div>

            <p data-preview-item className="text-sm leading-relaxed text-ink/60">
              {project.summary}
            </p>

            <div data-preview-item className="grid grid-cols-2 gap-8 border-t border-hairline pt-6">
              <div>
                <p className="meta text-ink/35">Role</p>
                <ul className="mt-3 space-y-1.5 text-sm text-ink/70">
                  {project.role.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="meta text-ink/35">Stack</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <li key={s} className="micro border border-hairline px-2 py-1 text-ink/50">
                      {s}
                    </li>
                  ))}
                  <li className="micro bg-accent px-2 py-1 text-canvas">
                    {project.status === "live" ? "Live" : "Template"}
                  </li>
                </ul>
              </div>
            </div>

            <div data-preview-item className="mt-auto flex flex-wrap items-center gap-6 pt-2">
              <BracketLink href={project.href} variant="framed">
                Visit live site
              </BracketLink>
              <BracketLink href="/contact" size="sm">
                Brief a similar project
              </BracketLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
