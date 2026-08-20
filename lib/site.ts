export const site = {
  name: "Riem Labs",
  shortName: "Riem",
  tagline: "Design & web systems studio",
  description:
    "Riem Labs is an independent design studio building digital products, interfaces, and web systems — shaped from first idea to working form.",
  email: "hello@studio.com",
  phone: "+254 700 000 000",
  city: "Nairobi",
  country: "Kenya",
  timeZone: "Africa/Nairobi",
  timeZoneLabel: "EAT",
  founded: 2017,
  availability: "Available for hire — Q3 2026",
} as const;

export type NavItem = {
  label: string;
  href: string;
  index: string;
  /** Bracketed hover cue shown beside the label in the drawer. */
  cue: string;
};

export const navigation: NavItem[] = [
  { label: "Index", href: "/", index: "01", cue: "Home" },
  { label: "About Us", href: "/#about", index: "02", cue: "Studio" },
  { label: "Work", href: "/work", index: "03", cue: "Proof" },
  { label: "Services", href: "/services", index: "04", cue: "Method" },
  { label: "Contact", href: "/contact", index: "05", cue: "Action" },
];

export const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export const socials = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Dribbble", href: "https://dribbble.com" },
  { label: "GitHub", href: "https://github.com" },
];
