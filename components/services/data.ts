export const SERVICES_COPY = {
    label: "What we do",
    heading: "Eight services.",
    headingAccent: "One connected agency.",
    text: "From the first click to the final sale, we design, build, automate and grow every part of your digital presence under one roof.",
};

export type Service = { title: string; tags: string[]; text: string; cta: string; image: string };

// Placeholder images (dark, moody). Swap with real ones later.
const img = (seed: string) => `https://picsum.photos/seed/zyrex-${seed}/1200/900?grayscale`;

export const SERVICES: Service[] = [
    {
        title: "Web Design & Development",
        tags: ["Websites", "Landing Pages", "E-commerce", "CMS", "Speed & SEO-ready"],
        text: "Fast, modern websites that turn visitors into leads. We plan, design and build every page around your goals, so your site looks premium, loads quickly and is easy for your team to update.",
        cta: "Build Your Website",
        image: img("web"),
    },
    {
        title: "SEO",
        tags: ["Technical SEO", "On-page", "Local SEO", "Content", "Reporting"],
        text: "Get found by the people already searching for you. We fix the technical foundation, optimise every key page and grow your rankings with content that brings steady, free traffic.",
        cta: "Grow Your Rankings",
        image: img("seo"),
    },
    {
        title: "Paid Ads",
        tags: ["Google Ads", "Meta Ads", "Retargeting", "Funnels", "Tracking"],
        text: "Campaigns on Google and Meta that bring real leads, not just clicks. We handle targeting, creatives, landing pages and tracking, and keep improving until every rupee works harder.",
        cta: "Start Your Campaign",
        image: img("ads"),
    },
    {
        title: "Social Media Marketing",
        tags: ["Strategy", "Content Calendar", "Community", "Growth", "Analytics"],
        text: "Consistent, on-brand content across every platform. We plan, create and publish posts that build trust, grow your audience and keep your business top of mind.",
        cta: "Grow Your Audience",
        image: img("social"),
    },
    {
        title: "CRM & Automation",
        tags: ["GoHighLevel", "Funnels", "Follow-ups", "Pipelines", "Workflows"],
        text: "One system for every lead. We set up GoHighLevel CRM, funnels and automated follow-ups so no lead is forgotten and your team always knows what to do next.",
        cta: "Automate Your Sales",
        image: img("crm"),
    },
    {
        title: "AI Automation",
        tags: ["AI Chatbots", "AI Agents", "Lead Qualification", "24/7 Support"],
        text: "AI assistants that answer, qualify and book leads around the clock. We build chatbots and agents that save hours every week and never miss a message.",
        cta: "Add AI To Your Business",
        image: img("ai"),
    },
    {
        title: "Branding & Design",
        tags: ["Logo", "Visual Identity", "Brand Guidelines", "Print", "Social Kits"],
        text: "A brand people remember. We create logos, colours, typography and guidelines that make your business look consistent and professional everywhere it shows up.",
        cta: "Build Your Brand",
        image: img("brand"),
    },
    {
        title: "Content & Video",
        tags: ["Reels", "Ad Creatives", "Product Videos", "Photography", "Editing"],
        text: "Scroll-stopping reels, ad creatives and videos that convert. We script, shoot and edit content made for each platform and built to drive action.",
        cta: "Create Your Content",
        image: img("video"),
    },
];