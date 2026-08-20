export type ProjectCategory =
  | "PRODUCT SYSTEM"
  | "STUDIO SYSTEM"
  | "COMMERCE"
  | "BRAND SYSTEM"
  | "EDITORIAL";

export type Project = {
  slug: string;
  index: string;
  title: string;
  client: string;
  year: string;
  category: ProjectCategory;
  summary: string;
  role: string[];
  stack: string[];
  /** Drives the generated cover art — see components/ProjectVisual.tsx */
  visual: "grid" | "arc" | "stack" | "orbit" | "rule" | "column";
  /** Deployed site — external, opened in a new tab from the card. */
  href: string;
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "meridian",
    index: "01",
    title: "Meridian",
    client: "Meridian Capital",
    year: "2026",
    category: "PRODUCT SYSTEM",
    summary:
      "A treasury interface for a multi-market fund. Dense tabular data, kept legible through a strict typographic scale and a single accent reserved for state.",
    role: ["Product design", "Design system", "Front-end"],
    stack: ["Next.js", "TypeScript", "Tailwind", "Visx"],
    visual: "grid",
    href: "https://example.com/meridian",
    featured: true,
  },
  {
    slug: "atlas-foundry",
    index: "02",
    title: "Atlas Foundry",
    client: "Atlas Type",
    year: "2025",
    category: "STUDIO SYSTEM",
    summary:
      "Specimen platform and licensing flow for an independent type foundry. Every page is a typographic argument for the thing it sells.",
    role: ["Art direction", "Web systems", "Front-end"],
    stack: ["Next.js", "GSAP", "Lenis", "Sanity"],
    visual: "arc",
    href: "https://example.com/atlas",
    featured: true,
  },
  {
    slug: "kilim",
    index: "03",
    title: "Kilim",
    client: "Kilim Goods",
    year: "2025",
    category: "COMMERCE",
    summary:
      "Direct-to-consumer storefront for a textile house. Editorial pacing on the way in, ruthless efficiency at checkout.",
    role: ["Visual direction", "Commerce build", "Performance"],
    stack: ["Next.js", "Shopify", "Tailwind", "GSAP"],
    visual: "stack",
    href: "https://example.com/kilim",
    featured: true,
  },
  {
    slug: "northbound",
    index: "04",
    title: "Northbound",
    client: "Northbound Rail",
    year: "2025",
    category: "BRAND SYSTEM",
    summary:
      "Identity and digital system for a regional rail operator — wayfinding logic carried intact from platform signage into the booking flow.",
    role: ["Brand system", "Design system", "Front-end"],
    stack: ["Next.js", "TypeScript", "Figma", "Storybook"],
    visual: "rule",
    href: "https://example.com/northbound",
    featured: true,
  },
  {
    slug: "praxis",
    index: "05",
    title: "Praxis Health",
    client: "Praxis",
    year: "2024",
    category: "PRODUCT SYSTEM",
    summary:
      "Clinician-facing records tool. Reduced a nine-screen intake to three, without removing a single required field.",
    role: ["Product design", "Research", "Front-end"],
    stack: ["Next.js", "TypeScript", "Tailwind", "tRPC"],
    visual: "column",
    href: "https://example.com/praxis",
    featured: false,
  },
  {
    slug: "format-archive",
    index: "06",
    title: "Format Archive",
    client: "Format",
    year: "2024",
    category: "EDITORIAL",
    summary:
      "A living archive of 4,000 print artefacts. Filter, compare, and cite — built to stay fast as the collection triples.",
    role: ["Information design", "Web systems"],
    stack: ["Next.js", "Postgres", "Algolia", "GSAP"],
    visual: "orbit",
    href: "https://example.com/format",
    featured: false,
  },
  {
    slug: "sable",
    index: "07",
    title: "Sable Interiors",
    client: "Sable",
    year: "2023",
    category: "STUDIO SYSTEM",
    summary:
      "Portfolio and enquiry system for an interiors practice. Slow scroll, large plates, no ornament competing with the work.",
    role: ["Art direction", "Front-end"],
    stack: ["Next.js", "Lenis", "GSAP", "Tailwind"],
    visual: "arc",
    href: "https://example.com/sable",
    featured: false,
  },
  {
    slug: "orbit-labs",
    index: "08",
    title: "Orbit Labs",
    client: "Orbit",
    year: "2023",
    category: "PRODUCT SYSTEM",
    summary:
      "Developer console for a geospatial API. Documentation, playground, and dashboard unified under one component library.",
    role: ["Design system", "Front-end", "Docs"],
    stack: ["Next.js", "TypeScript", "MDX", "Tailwind"],
    visual: "grid",
    href: "https://example.com/orbit",
    featured: false,
  },
];

export const categories: ProjectCategory[] = [
  "PRODUCT SYSTEM",
  "STUDIO SYSTEM",
  "COMMERCE",
  "BRAND SYSTEM",
  "EDITORIAL",
];

export const featuredProjects = projects.filter((p) => p.featured);
