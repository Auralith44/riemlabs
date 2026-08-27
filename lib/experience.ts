import { projects } from "@/lib/projects";

export type TimelineEntry = {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  /** 2026 entries — the studio's live work, not history. */
  current?: boolean;
};

/**
 * 2022–2025 milestones — generic and capability-focused rather than named
 * case studies, since the studio's real early history hasn't been supplied
 * yet. Two per year, matching the level of detail the old Practice section
 * carried (roles and disciplines, not client names).
 */
const PLACEHOLDER: TimelineEntry[] = [
  {
    year: "2022",
    title: "Studio founded",
    subtitle: "Nairobi",
    description:
      "Riem Labs opens as an independent practice, structured around software and systems engineering from day one rather than a visual-design shop that later added development.",
    tags: ["Founding"],
  },
  {
    year: "2022",
    title: "First engineering engagement",
    subtitle: "Web systems",
    description:
      "First client build taken on end to end — architecture, front-end, and launch — setting the working pattern every engagement since has followed.",
    tags: ["Web & Software Development"],
  },
  {
    year: "2023",
    title: "Team reaches senior capacity",
    subtitle: "Team",
    description:
      "A second senior practitioner joins, adding dedicated systems-architecture depth alongside front-end and product work.",
    tags: ["Team"],
  },
  {
    year: "2023",
    title: "First retained engagement",
    subtitle: "Engagement models",
    description:
      "Work shifts beyond one-off builds for the first time — ongoing embedded capacity for a client scaling past their original launch scope.",
    tags: ["Embedded Capacity"],
  },
  {
    year: "2024",
    title: "Automation practice established",
    subtitle: "Business systems",
    description:
      "Workflow automation and business-systems engineering formalized as a standing service line, not a one-off add-on to web builds.",
    tags: ["Business Systems & Automation"],
  },
  {
    year: "2024",
    title: "Delivery process standardized",
    subtitle: "Process",
    description:
      "A documented handover, QA, and post-launch support process adopted across every engagement, regardless of size.",
    tags: ["Process"],
  },
  {
    year: "2025",
    title: "Data & AI capability added",
    subtitle: "Data science",
    description:
      "Data analytics and AI-assisted workflows folded into the studio's core offering, built by the same team rather than handed to a separate vendor.",
    tags: ["Data Science & Analytics", "AI & Intelligent Solutions"],
  },
  {
    year: "2025",
    title: "Audit practice formalized",
    subtitle: "System audits",
    description:
      "System and code audits become a standalone engagement type, for teams inheriting a codebase rather than commissioning a new one.",
    tags: ["System & Code Audit"],
  },
];

/** 2026 — every real Work entry, marked current rather than historical.
 *  Sourced from the full project list, not `featuredProjects` — the two are
 *  different concerns that happen to have coincided before: `featured`
 *  gates the home page's own separate curated 4-project list (with a glyph
 *  choreography pool sized exactly for those 4), while this is "everything
 *  actually live in 2026," which now includes two non-featured projects too. */
const CURRENT: TimelineEntry[] = projects
  .filter((p) => p.year === "2026")
  .map((p) => ({
    year: p.year,
    title: p.title,
    subtitle: p.category,
    description: p.summary,
    tags: p.role,
    current: true,
  }));

export const experience: TimelineEntry[] = [...PLACEHOLDER, ...CURRENT];
