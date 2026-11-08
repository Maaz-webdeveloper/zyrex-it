// Our 4 core services. One source for the hero menu (Services panel + mobile list)
// and the Services page hero (components/services-hero).
//   text: one short line (menu)
//   description: a few sentences (Services page hero)
//   image: placeholder (dark, moody), swap with real ones later

export type CoreService = {
    name: string;
    text: string;
    description: string;
    image: string;
    icon: string[]; // SVG paths, 24x24 line icon
};

const img = (seed: string) => `https://picsum.photos/seed/zyrex-core-${seed}/1400/1000?grayscale`;

export const CORE_SERVICES: CoreService[] = [
    {
        name: "Content Creation",
        text: "Reels, ads, videos and creatives that convert",
        description:
            "Scroll-stopping reels, ad creatives and videos made for each platform. We plan, shoot and edit content that gets attention and drives action.",
        image: img("content"),
        icon: ["M3 6h12v12H3z", "M15 10l6-3v10l-6-3"],
    },
    {
        name: "Web, App & Funnel",
        text: "Websites, web apps and funnels built to convert",
        description:
            "Fast websites, custom web apps and sales funnels designed around your goals, so every visitor has a clear path to becoming a lead.",
        image: img("web"),
        icon: ["M3 4h18v14H3z", "M3 8h18", "M8 21h8", "M12 18v3"],
    },
    {
        name: "Automation & CRM",
        text: "GoHighLevel CRM, follow-ups and smart workflows",
        description:
            "One system for every lead. We set up GoHighLevel, automated follow-ups and smart workflows, so no lead is forgotten and your team saves hours.",
        image: img("crm"),
        icon: ["M4 4h6v6H4z", "M14 14h6v6h-6z", "M10 7h4a3 3 0 0 1 3 3v4"],
    },
    {
        name: "Business & Social Management",
        text: "Social media and day-to-day business growth, handled",
        description:
            "We run your social media and the day-to-day growth work: posting, community, reporting and new ideas, so you can focus on your business.",
        image: img("social"),
        icon: ["M3 3v18h18", "M7 15l4-4 3 3 5-6", "M15 8h4v4"],
    },
];

export function ServiceIcon({ paths, size = 18 }: { paths: string[]; size?: number }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: size, height: size }}
        >
            {paths.map((d) => (
                <path key={d} d={d} />
            ))}
        </svg>
    );
}
