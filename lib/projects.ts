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
  /** "template" until a project is adopted as a real business's actual live
   *  site, at which point it flips to "live" — same badge treatment either
   *  way, just the word. All six are "template" for now. */
  status: "template" | "live";
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
    href: "https://oraclechemicals.netlify.app",
    featured: true,
    status: "template",
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
    href: "https://elfidentalcare.netlify.app",
    featured: true,
    status: "template",
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
    href: "https://thevillagerestaurant.netlify.app",
    featured: true,
    status: "template",
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
    href: "https://clicq.netlify.app",
    featured: true,
    status: "template",
  },
  {
    slug: "kyra-platinum",
    index: "05",
    title: "Kyra Platinum",
    client: "Automotive Imports",
    year: "2026",
    category: "Automotive Imports",
    summary:
      "A specification-first catalogue for a performance-import dealer, built for buyers who already know the model and want the numbers. Inventory, provenance and enquiry routing held in one structure that updates as fast as stock turns over.",
    role: ["Web systems", "Design system", "Front-end"],
    stack: ["Next.js", "TypeScript", "Tailwind"],
    visual: "rule",
    href: "https://kyraimports.netlify.app",
    // Not featured — the home page's own 03/Work list is a curated 4, with
    // its glyph choreography pool sized exactly for those 4 (see
    // CHOREO_OFFSETS in lib/glyphChoreographies.ts); adding a 5th/6th
    // featured project would silently steal Home Services' own glyph slots.
    // This batch only asked for the Work page's full index to grow.
    featured: false,
    status: "template",
  },
  {
    slug: "the-aura-restaurant",
    index: "06",
    title: "The Aura Restaurant",
    client: "Restaurant",
    year: "2026",
    category: "Restaurant",
    summary:
      "A second restaurant site built on the same instinct as the first: menu and reservations up front, atmosphere carried by photography, nothing fighting for attention. Location and hours tuned for a mall address rather than a standalone building.",
    role: ["Art direction", "Web systems", "Front-end"],
    stack: ["Next.js", "Tailwind", "GSAP"],
    visual: "column",
    href: "https://theaurarestaurant.netlify.app",
    featured: false,
    status: "template",
  },
];

export const categories: ProjectCategory[] = [...new Set(projects.map((p) => p.category))];

export const featuredProjects = projects.filter((p) => p.featured);
