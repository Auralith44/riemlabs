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
    title: "Visual Direction",
    short: "The argument the work makes before anyone reads a word.",
    body:
      "We set the typographic scale, the grid, the palette, and the motion vocabulary — then prove them against real content rather than a mood board. Direction is only finished when a new page can be laid out by someone who wasn't in the room.",
    deliverables: [
      "Art direction & concept territories",
      "Typographic scale and grid specification",
      "Colour and surface token hierarchy",
      "Motion language and easing spec",
      "Key screen compositions at full fidelity",
    ],
    stack: ["Figma", "Adobe CC", "Tailwind", "GSAP"],
    duration: "2–4 weeks",
  },
  {
    index: "02",
    title: "Web Systems",
    short: "Sites that behave like products, not brochures.",
    body:
      "Architecture, routing, content modelling, and the editorial tooling behind them. We design the shape of the data alongside the shape of the page, so the site stays coherent at page four hundred as it was at page four.",
    deliverables: [
      "Information architecture & routing map",
      "Content model and CMS configuration",
      "Component library with usage rules",
      "Responsive layout system",
      "Analytics, SEO, and metadata layer",
    ],
    stack: ["Next.js", "TypeScript", "Sanity", "Vercel"],
    duration: "4–8 weeks",
  },
  {
    index: "03",
    title: "Technical Execution",
    short: "Motion, performance, and the details that survive production.",
    body:
      "Scroll choreography, state transitions, and accessibility handled as engineering problems with measurable targets — not as polish applied at the end. Every animation has a reduced-motion path and a frame budget.",
    deliverables: [
      "Scroll and page transition choreography",
      "Core Web Vitals budget and tuning",
      "Accessibility audit to WCAG 2.2 AA",
      "Cross-browser and device QA",
      "CI, preview environments, and deploys",
    ],
    stack: ["GSAP", "ScrollTrigger", "Lenis", "Playwright"],
    duration: "Runs alongside build",
  },
  {
    index: "04",
    title: "Maintainable Design Systems",
    short: "So the twentieth page costs less than the second.",
    body:
      "Tokens, primitives, and documentation built for the team that inherits them. We hand over a system your engineers can extend without asking us, and the governance notes that keep it from drifting.",
    deliverables: [
      "Design token architecture",
      "Documented component primitives",
      "Storybook or living documentation site",
      "Contribution and governance guidelines",
      "Team handover and working sessions",
    ],
    stack: ["TypeScript", "Storybook", "Tailwind", "Figma"],
    duration: "3–6 weeks",
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
