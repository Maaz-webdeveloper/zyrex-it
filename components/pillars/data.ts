export const PILLARS_COPY = {
  heading: "Where design, automation and growth meet",
  text: "ZYREX IT brings your website, your CRM and your marketing into one connected system, so every visitor turns into a lead and every lead into a customer.",
  cta: { label: "Book a call", href: "#contact" },
};

export type Pillar = {
  title: string;
  text: string;
  side: "left" | "right";
  row: 1 | 2;
};

// Order = the order they appear while scrolling
export const PILLARS: Pillar[] = [
  {
    title: "Build",
    text: "High-converting websites and a brand people remember, designed to turn visitors into leads.",
    side: "left",
    row: 1,
  },
  {
    title: "Automate",
    text: "GoHighLevel CRM, funnels and follow-ups that work 24/7, so no lead is ever forgotten.",
    side: "right",
    row: 1,
  },
  {
    title: "Scale",
    text: "Google and Meta ads plus SEO that bring a steady flow of the right customers.",
    side: "right",
    row: 2,
  },
  {
    title: "Insights",
    text: "Every lead, call and sale tracked in one dashboard, so you always know what's working.",
    side: "left",
    row: 2,
  },
];
