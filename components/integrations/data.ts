// All text and lists for the Integrations section. Change words here, not in the components.

export const COPY = {
  heading: ["Plug In.", "Automate."], // white words
  headingAccent: "Scale.", // gold word at the end
  text: "ZYREX IT connects your business with the tools you already use: CRMs, payments, calendars and marketing platforms, so every lead, booking and sale flows into one system. No complicated setup needed.",
  linkLabel: "Explore our integrations",
  linkHref: "#contact", // GHL section the link scrolls to
};

export const FEATURES = [
  {
    title: "Universal Integrations",
    text: "Works with HubSpot, Stripe, Google and 50+ other platforms.",
  },
  {
    title: "Instant Setup",
    text: "Connected and running in days, not months.",
  },
  {
    title: "Smart Automation",
    text: "Follow-ups, reminders and reports that run on their own.",
  },
  {
    title: "One Dashboard",
    text: "Every lead, call and sale tracked in one place.",
  },
];

// Tools in the moving band. icon = any image URL, or a file in /public (e.g. "/tools/hubspot.svg").
// Placeholder logos come from Simple Icons; replace this list with your own tools later.
const si = (slug: string) => `https://cdn.simpleicons.org/${slug}`;

export const TOOLS = [
  { name: "HubSpot", icon: si("hubspot") },
  { name: "Stripe", icon: si("stripe") },
  { name: "Zapier", icon: si("zapier") },
  { name: "Google", icon: si("google") },
  { name: "Gmail", icon: si("gmail") },
  { name: "Google Calendar", icon: si("googlecalendar") },
  { name: "Shopify", icon: si("shopify") },
  { name: "WordPress", icon: si("wordpress") },
  { name: "Mailchimp", icon: si("mailchimp") },
  { name: "Notion", icon: si("notion") },
  { name: "Trello", icon: si("trello") },
  { name: "Zoom", icon: si("zoom") },
  { name: "WhatsApp", icon: si("whatsapp") },
  { name: "PayPal", icon: si("paypal") },
  { name: "QuickBooks", icon: si("quickbooks") },
  { name: "Calendly", icon: si("calendly") },
  { name: "Facebook", icon: si("facebook") },
  { name: "Instagram", icon: si("instagram") },
  { name: "Airtable", icon: si("airtable") },
  { name: "Asana", icon: si("asana") },
  { name: "Wix", icon: si("wix") },
  { name: "WooCommerce", icon: si("woocommerce") },
  { name: "Twilio", icon: si("twilio") },
  { name: "Google Analytics", icon: si("googleanalytics") },
];