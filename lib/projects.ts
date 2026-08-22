/**
 * What the client does, not what we built. It is the one descriptor the work
 * rows carry beside the name, so it reads as a sector rather than a taxonomy
 * of our own deliverables.
 */
export type ProjectCategory = string;

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
    slug: "oracle-chemicals",
    index: "01",
    title: "Oracle Chemicals",
    client: "Chemical Distributor",
    year: "2026",
    category: "Chemical Distributor",
    summary:
      "A distribution catalogue built for people who arrive knowing exactly what they need. Product data, safety documentation and enquiry routing in one structure a small team can keep current.",
    role: ["Web systems", "Design system", "Front-end"],
    stack: ["Next.js", "TypeScript", "Tailwind"],
    visual: "grid",
    href: "https://oraclechemicals.co.ke",
    featured: true,
  },
  {
    slug: "elfi-dental-care",
    index: "02",
    title: "Elfi Dental Care",
    client: "Dental Clinic",
    year: "2026",
    category: "Dental Clinic",
    summary:
      "A clinic site that answers the questions a prospective patient actually has — what it costs, how long it takes, who is doing it — and turns the answer into a booking.",
    role: ["Visual direction", "Web systems", "Front-end"],
    stack: ["Next.js", "Tailwind", "Sanity"],
    visual: "arc",
    href: "https://elfidentalcare.co.ke",
    featured: true,
  },
  {
    slug: "the-village-restaurant",
    index: "03",
    title: "The Village Restaurant",
    client: "Restaurant",
    year: "2026",
    category: "Restaurant",
    summary:
      "Menu, hours and reservations, held in a layout that survives a kitchen changing its mind weekly. Photography carries the room; the type stays out of its way.",
    role: ["Art direction", "Web systems", "Front-end"],
    stack: ["Next.js", "Tailwind", "GSAP"],
    visual: "stack",
    href: "https://thevillagerestaurant.co.ke",
    featured: true,
  },
  {
    slug: "the-clicq",
    index: "04",
    title: "THE CLICQ",
    client: "Marketing & Communications",
    year: "2026",
    category: "Marketing & Communications",
    summary:
      "A studio site for a studio — the hardest brief there is. Case work in front, capability behind it, and a system their own team extends without calling us.",
    role: ["Design system", "Web systems", "Front-end"],
    stack: ["Next.js", "TypeScript", "GSAP", "Lenis"],
    visual: "orbit",
    href: "https://theclicq.com",
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

export const categories: ProjectCategory[] = [...new Set(projects.map((p) => p.category))];

export const featuredProjects = projects.filter((p) => p.featured);
