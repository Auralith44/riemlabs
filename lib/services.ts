export type Service = {
  index: string;
  title: string;
  short: string;
  body: string;
  deliverables: string[];
  stack: string[];
  duration: string;
};

export const services: Service[] = [
  {
    index: "01",
    title: "Web & Software Development",
    short: "Business-critical platforms, built to convert and built to last.",
    body:
      "Modern business websites, high-conversion B2B platforms, e-commerce engines, and bespoke custom web applications — engineered around the workflows the enterprise already runs on, not the other way around.",
    deliverables: [
      "Marketing & product website builds",
      "B2B platform and portal development",
      "E-commerce storefronts and checkout flows",
      "Custom web application architecture",
      "Performance and SEO baseline",
    ],
    stack: ["Next.js", "TypeScript", "Tailwind", "React"],
    duration: "4–8 weeks",
  },
  {
    index: "02",
    title: "Business Systems & Automation",
    short: "The manual work your team shouldn't still be doing by hand.",
    body:
      "End-to-end workflow automation, custom backend databases, internal administrative dashboards, and third-party API integrations — built to remove the busywork between your systems, not add another one.",
    deliverables: [
      "Workflow automation & process mapping",
      "Custom database architecture",
      "Internal admin dashboards",
      "Third-party API integrations",
      "Ongoing systems maintenance",
    ],
    stack: ["Python", "Node.js", "REST APIs", "PostgreSQL"],
    duration: "3–6 weeks",
  },
  {
    index: "03",
    title: "Data Science & Analytics",
    short: "Decisions made from evidence, not instinct.",
    body:
      "Business intelligence dashboards, data cleaning pipelines, customer and sales analytics, and predictive modelling — turning whatever your systems already collect into decisions you can act on.",
    deliverables: [
      "BI dashboards & reporting",
      "Data cleaning & pipeline builds",
      "Customer and sales analytics",
      "Predictive modelling",
      "Data source integration",
    ],
    stack: ["Python", "SQL", "Data Viz", "Predictive"],
    duration: "3–6 weeks",
  },
  {
    index: "04",
    title: "AI & Intelligent Solutions",
    short: "AI that does the work, not just the demo.",
    body:
      "Tailored AI assistants, document intelligence systems, automated lead qualification, and intelligent workflow automation — built on production-grade architecture, not a prompt bolted onto your site.",
    deliverables: [
      "Custom AI assistants",
      "Document intelligence systems",
      "Automated lead qualification",
      "LLM-powered workflow automation",
      "Vector search & retrieval infrastructure",
    ],
    stack: ["Claude API", "OpenAI", "LLM Architecture", "Vector DB"],
    duration: "4–8 weeks",
  },
];

export const principles = [
  {
    index: "01",
    title: "Structure before surface",
    body: "The grid, the scale, and the content model come first. Decoration applied to a weak structure is just expensive noise.",
  },
  {
    index: "02",
    title: "One accent, held back",
    body: "A single interactive colour, used only where the interface responds. Restraint is what makes the signal readable.",
  },
  {
    index: "03",
    title: "Motion with a reason",
    body: "Animation exists to explain a change in state. If it can be removed without losing meaning, it gets removed.",
  },
  {
    index: "04",
    title: "Built to be handed over",
    body: "Every project ships with the notes, tokens, and conventions the next team needs. We design for our own replaceability.",
  },
];

export const metrics = [
  { value: "9", suffix: "yrs", label: "Experience", note: "Independent since 2017" },
  { value: "120", suffix: "+", label: "Projects", note: "Shipped across 14 countries" },
  { value: "98", suffix: "%", label: "Client satisfaction", note: "Post-engagement survey" },
  { value: "100", suffix: "%", label: "On-time rate", note: "Across the last 40 builds" },
];

export const process = [
  {
    index: "01",
    title: "Signal",
    body: "A short paid discovery. We read the existing system, talk to the people using it, and write down what the project is actually for.",
  },
  {
    index: "02",
    title: "Direction",
    body: "Typographic scale, grid, palette, and motion vocabulary — tested against real content until the rules hold on their own.",
  },
  {
    index: "03",
    title: "Form",
    body: "Design and engineering run together. You see working pages in a preview environment from week two, not static comps at week eight.",
  },
  {
    index: "04",
    title: "Handover",
    body: "Tokens, documentation, and working sessions. We leave a system your team can extend without us in the room.",
  },
];
