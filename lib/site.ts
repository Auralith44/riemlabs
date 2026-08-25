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
  founded: 2022,
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
  { label: "About Us", href: "/about", index: "02", cue: "Studio" },
  { label: "Work", href: "/work", index: "03", cue: "Proof" },
  { label: "Services", href: "/services", index: "04", cue: "Method" },
  { label: "Contact", href: "/contact", index: "05", cue: "Action" },
];

export const legalLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Refund Policy", href: "/refund" },
];

/** `icon` keys the inline mark the footer draws for each. */
export const socials = [
  { label: "WhatsApp", href: "https://wa.me/254700000000", icon: "whatsapp" },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
  { label: "GitHub", href: "https://github.com", icon: "github" },
] as const;
