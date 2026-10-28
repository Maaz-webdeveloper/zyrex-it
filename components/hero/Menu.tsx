"use client";

import { useEffect, useRef, useState } from "react";
import { lockParentScroll, scrollParentTo } from "@/lib/embed";

const MENU_ITEMS = [
    { label: "Home", href: "#top" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Calendar", href: "#calendar" },
    { label: "Team", href: "#team" },
    { label: "Career", href: "#career" },
    { label: "Blog", href: "#blog" },
    { label: "Contact", href: "#contact" },
];

// Services (placeholder list, change freely). "featured" is shown as the big card in the desktop panel.
const SERVICES = [
    { name: "Web Design & Development", text: "Fast, high-converting websites", icon: ["M3 4h18v12H3z", "M8 20h8", "M12 16v4"] },
    { name: "SEO", text: "Rank higher and get found on Google", icon: ["M11 4a7 7 0 1 1 0 14a7 7 0 0 1 0-14z", "M21 21l-4.3-4.3"] },
    { name: "Paid Ads", text: "Google & Meta ads that bring real leads", icon: ["M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z", "M16 9a4 4 0 0 1 0 6"] },
    { name: "Social Media Marketing", text: "Content and growth on every platform", icon: ["M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"] },
    { name: "CRM & Automation", text: "GoHighLevel funnels, follow-ups and workflows", icon: ["M4 4h6v6H4z", "M14 14h6v6h-6z", "M10 7h4a3 3 0 0 1 3 3v4"], featured: true },
    { name: "AI Automation", text: "Chatbots and AI agents that work 24/7", icon: ["M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8z", "M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8z"] },
    { name: "Branding & Design", text: "Logos and identity that stand out", icon: ["M12 19l7-7 3 3-7 7-3-3z", "M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z", "M2 2l7.6 7.6"] },
    { name: "Content & Video", text: "Reels, ads and creatives that convert", icon: ["M3 6h12v12H3z", "M15 10l6-3v10l-6-3"] },
];
const FEATURED = SERVICES.find((s) => s.featured) ?? SERVICES[0];
const FEATURED_POINTS = ["Sales funnels", "Automated follow-ups", "Smart workflows"];
const OTHER_SERVICES = SERVICES.filter((s) => s !== FEATURED);

const FOOT_LINKS = [
    { label: "hello@zyrexit.com", href: "mailto:hello@zyrexit.com" },
    { label: "Facebook", href: "https://www.facebook.com/zyrexit" },
    { label: "Instagram", href: "https://www.instagram.com/zyrexit" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/zyrex-it" },
];

const EASE = "ease-[cubic-bezier(0.76,0,0.24,1)]";
const GOLD = "linear-gradient(135deg, #ffdd65, #ffcc00)";
const PANEL_EDGE =
    "linear-gradient(140deg, rgba(255, 204, 0, 0.6), rgba(255, 255, 255, 0.08) 35%, rgba(255, 255, 255, 0.04) 70%, rgba(255, 204, 0, 0.3))";
const PANEL_BG = "linear-gradient(160deg, rgba(26, 24, 18, 0.95), rgba(10, 10, 10, 0.94))";
const FEATURED_BG =
    "radial-gradient(circle at 20% 0%, rgba(255, 204, 0, 0.28), transparent 60%), linear-gradient(160deg, rgba(40, 34, 14, 0.9), rgba(14, 13, 10, 0.95))";
const PANEL_OFFSET_Y = 48; // desktop panel starts this many px above the "Services" row

type MenuProps = {
    open: boolean;
    origin: { x: number; y: number } | null; // where the circle opens from (the button)
    onClose: () => void;
};

function ServiceIcon({ paths, size = 18 }: { paths: string[]; size?: number }) {
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

export default function Menu({ open, origin, onClose }: MenuProps) {
    const [mega, setMega] = useState(false); // desktop: services panel
    const [mobileServices, setMobileServices] = useState(false); // touch/small screens: services list
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const servicesRef = useRef<HTMLLIElement>(null);
    const panelRef = useRef<HTMLElement>(null);
    const canHover = useRef(false); // true only on devices with a real mouse

    useEffect(() => {
        canHover.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    }, []);

    // Menu open -> the GHL page cannot scroll
    useEffect(() => {
        lockParentScroll(open);
    }, [open]);
    useEffect(() => () => lockParentScroll(false), []);

    // Esc closes the menu
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // Keep the desktop panel lined up with the "Services" row
    useEffect(() => {
        const place = () => {
            const row = servicesRef.current;
            const panel = panelRef.current;
            if (!row || !panel) return;
            // Line up with "Services", but keep the whole panel inside the screen
            const wrapTop = (panel.offsetParent as HTMLElement | null)?.getBoundingClientRect().top ?? 0;
            const wanted = row.offsetTop - PANEL_OFFSET_Y;
            const maxTop = window.innerHeight - 24 - wrapTop - panel.offsetHeight;
            const minTop = 24 - wrapTop;
            panel.style.top = `${Math.max(minTop, Math.min(wanted, maxTop))}px`;
        };
        place();
        window.addEventListener("resize", place);
        return () => window.removeEventListener("resize", place);
    }, [open, mega]);

    // Desktop (mouse only): opens on Services, stays until another link is hovered
    // or the mouse leaves the panel (short delay)
    const showMega = () => {
        if (!canHover.current) return;
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setMega(true);
    };
    const hideMega = () => {
        if (!canHover.current) return;
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setMega(false);
    };
    const hideMegaSoon = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => setMega(false), 500);
    };

    const megaVisible = open && mega;
    const servicesListVisible = open && mobileServices;
    const spotlight = megaVisible || servicesListVisible; // dim the other links

    // Link click: close menu, then smooth-scroll the GHL page to that section
    const go = (href: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        setMega(false);
        setMobileServices(false);
        onClose();
        lockParentScroll(false);
        setTimeout(() => scrollParentTo(href), 150);
    };

    // "Services": on mouse devices it goes to the section (the panel opens on hover);
    // on touch devices a tap opens/closes the services list instead
    const onServicesClick = (e: React.MouseEvent) => {
        if (canHover.current) return go("#services")(e);
        e.preventDefault();
        if (window.innerWidth >= 1024) setMega((v) => !v);
        else setMobileServices((v) => !v);
    };

    const at = origin ? `${origin.x}px ${origin.y}px` : "calc(100% - 60px) 48px";

    return (
        <nav
            id="zx-menu"
            aria-label="Main menu"
            inert={!open}
            data-native-scroll=""
            className={`fixed inset-0 z-40 flex flex-col overflow-x-hidden overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-[clamp(24px,8vw,120px)] pt-[100px] pb-10 transition-[clip-path,visibility] duration-[900ms] ${EASE} ${open ? "visible" : "invisible delay-[0ms,900ms]"
                }`}
            style={{
                clipPath: open ? `circle(150% at ${at})` : `circle(0px at ${at})`,
                background: "radial-gradient(circle at 85% 15%, rgba(255, 204, 0, 0.12), transparent 50%), #050505",
            }}
        >
            {/* my-auto keeps everything vertically centered, but lets it scroll when taller than the screen */}
            <div className="my-auto w-full">
                {/* Links + attached desktop panel (panel sits right after the longest link) */}
                <div className="relative w-fit max-w-full">
                    <ul>
                        {MENU_ITEMS.map((item, i) => {
                            const isServices = item.label === "Services";
                            const active = isServices && spotlight;
                            const dimmed = spotlight && !isServices;
                            return (
                                <li
                                    key={item.label}
                                    ref={isServices ? servicesRef : undefined}
                                    className={`transition-[opacity,translate] ${open ? `translate-y-0 opacity-100 duration-[700ms,900ms] ${EASE}` : "translate-y-10 opacity-0 duration-[400ms]"
                                        }`}
                                    style={{ transitionDelay: open ? `${0.3 + i * 0.07}s` : "0s" }}
                                    onMouseEnter={isServices ? showMega : hideMega}
                                >
                                    <a
                                        href={item.href}
                                        onClick={isServices ? onServicesClick : go(item.href)}
                                        onFocus={isServices ? showMega : undefined}
                                        aria-expanded={isServices ? spotlight : undefined}
                                        className={`group/link flex items-baseline gap-[18px] py-[0.08em] text-[clamp(1.8rem,min(5vw,6.2vh),4rem)] leading-[1.08] font-extrabold uppercase transition-[color,padding,opacity,filter] duration-500 [@media(hover:hover)]:hover:pl-3.5 [@media(hover:hover)]:hover:text-accent ${active ? "text-accent min-[1024px]:pl-3.5" : "text-white/85"
                                            } ${dimmed ? "opacity-25 blur-[1px]" : "opacity-100 blur-0"}`}
                                        style={active ? { textShadow: "0 0 30px rgba(255, 204, 0, 0.35)" } : undefined}
                                    >
                                        <small className="text-[0.8rem] tracking-[0.2em] text-accent">
                                            {String(i + 1).padStart(2, "0")}
                                        </small>

                                        {/* Label with a gold underline that grows from the left on hover */}
                                        <span className="relative">
                                            {item.label}
                                            <span
                                                aria-hidden="true"
                                                className={`absolute -bottom-[0.06em] left-0 h-[0.07em] min-h-[3px] w-full origin-left rounded-full transition-transform duration-500 ${EASE} [@media(hover:hover)]:group-hover/link:scale-x-100 ${active ? "scale-x-100" : "scale-x-0"
                                                    }`}
                                                style={{ background: GOLD, boxShadow: "0 0 12px rgba(255, 204, 0, 0.5)" }}
                                            />
                                        </span>

                                        {isServices && (
                                            <>
                                                {/* Desktop: arrow pointing to the panel */}
                                                <span
                                                    aria-hidden="true"
                                                    className={`hidden self-center text-[0.45em] transition duration-500 min-[1024px]:inline ${megaVisible ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
                                                        }`}
                                                >
                                                    →
                                                </span>
                                                {/* Mobile/tablet: small chevron that flips when the list is open */}
                                                <svg
                                                    aria-hidden="true"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={2.6}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className={`size-[0.5em] self-center text-accent transition-transform duration-500 min-[1024px]:hidden ${servicesListVisible ? "rotate-180" : "rotate-0"
                                                        }`}
                                                >
                                                    <path d="M6 9l6 6 6-6" />
                                                </svg>
                                            </>
                                        )}
                                    </a>

                                    {/* Mobile/tablet: services list in a glass card */}
                                    {isServices && (
                                        <div
                                            className={`grid transition-[grid-template-rows,opacity] duration-500 min-[1024px]:hidden ${servicesListVisible ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                                }`}
                                        >
                                            <div className="overflow-hidden">
                                                <div className="my-3 rounded-[18px] p-px" style={{ background: PANEL_EDGE }}>
                                                    <ul className="grid gap-1 rounded-[17px] p-2" style={{ background: PANEL_BG }}>
                                                        {SERVICES.map((s) => (
                                                            <li key={s.name}>
                                                                <a
                                                                    href="#services"
                                                                    onClick={go("#services")}
                                                                    className="flex items-center gap-3 rounded-[12px] px-2 py-2 text-[14px] text-white/85 transition-colors active:bg-white/[0.06]"
                                                                >
                                                                    <span className="grid size-8 shrink-0 place-items-center rounded-[9px] border border-accent/25 bg-accent/10 text-accent">
                                                                        <ServiceIcon paths={s.icon} size={15} />
                                                                    </span>
                                                                    {s.name}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>

                    {/* ===== Desktop: Services mega panel (featured card + clean list + CTA bar) ===== */}
                    <aside
                        ref={panelRef}
                        aria-label="Our services"
                        onMouseEnter={showMega}
                        onMouseLeave={hideMegaSoon}
                        className={`absolute left-[calc(100%+clamp(32px,4vw,64px))] hidden w-[clamp(560px,54vw,900px)] transition-[clip-path,opacity,translate] duration-700 ${EASE} min-[1024px]:block ${megaVisible ? "pointer-events-auto translate-x-0 opacity-100" : "pointer-events-none -translate-x-4 opacity-0"
                            }`}
                        style={{ clipPath: megaVisible ? "inset(0 0 0 0 round 24px)" : "inset(0 100% 0 0 round 24px)" }}
                    >
                        <div
                            className="rounded-[24px] p-px shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_70px_rgba(255,204,0,0.08)]"
                            style={{ background: PANEL_EDGE }}
                        >
                            <div className="overflow-hidden rounded-[23px] backdrop-blur-xl" style={{ background: PANEL_BG }}>
                                <div className="grid grid-cols-[1fr_1.45fr] gap-[clamp(16px,1.6vw,28px)] p-[clamp(16px,1.6vw,24px)]">
                                    {/* Featured card */}
                                    <a
                                        href="#services"
                                        onClick={go("#services")}
                                        className={`group/feat relative flex flex-col overflow-hidden rounded-[18px] p-px transition-[opacity,translate] duration-700 ${megaVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                                            }`}
                                        style={{
                                            background: PANEL_EDGE,
                                            transitionDelay: megaVisible ? "0.15s" : "0s",
                                        }}
                                    >
                                        <div
                                            className="flex h-full flex-col rounded-[17px] p-[clamp(18px,1.6vw,26px)]"
                                            style={{ background: FEATURED_BG }}
                                        >
                                            <span className="w-fit rounded-full border border-accent/40 px-3 py-1 text-[10px] tracking-[0.25em] text-accent uppercase">
                                                Featured
                                            </span>
                                            <span
                                                className="mt-5 grid size-14 place-items-center rounded-[14px] text-black shadow-[0_10px_30px_rgba(255,204,0,0.35)]"
                                                style={{ background: GOLD }}
                                            >
                                                <ServiceIcon paths={FEATURED.icon} size={26} />
                                            </span>
                                            <span className="mt-5 text-[clamp(20px,1.8vw,30px)] leading-tight font-extrabold text-white">
                                                {FEATURED.name}
                                            </span>
                                            <span className="mt-2 text-[clamp(14px,1vw,16px)] leading-snug text-white/65">{FEATURED.text}</span>
                                            <ul className="mt-4 grid gap-1.5">
                                                {FEATURED_POINTS.map((p) => (
                                                    <li key={p} className="flex items-center gap-2 text-[clamp(14px,0.95vw,16px)] text-white/80">
                                                        <span className="text-accent">✓</span>
                                                        {p}
                                                    </li>
                                                ))}
                                            </ul>
                                            <span className="mt-auto pt-6">
                                                <span className="inline-flex h-[44px] w-fit items-center gap-2 rounded-full bg-[url('/hero/btn-outline.svg')] bg-size-[100%_100%] bg-center bg-no-repeat px-6 text-[13px] font-extrabold tracking-[0.12em] text-[#f9f3f3] uppercase transition-[translate,box-shadow] duration-300 group-hover/feat:-translate-y-0.5 group-hover/feat:shadow-[0_5px_24px_rgba(255,204,0,0.35)]">
                                                    Explore
                                                    <span aria-hidden="true" className="transition-transform duration-300 group-hover/feat:translate-x-1">
                                                        →
                                                    </span>
                                                </span>
                                            </span>
                                        </div>
                                    </a>

                                    {/* Clean list of the other services */}
                                    <div>
                                        <p className="mb-2 px-3 pl-[calc(0.75rem+0.3em)] text-[12px] tracking-[0.3em] text-white/50 uppercase">
                                            Our Services
                                        </p>
                                        <ul className="grid">
                                            {OTHER_SERVICES.map((s, i) => (
                                                <li
                                                    key={s.name}
                                                    className={`transition-[opacity,translate] duration-500 ${megaVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                                                        }`}
                                                    style={{ transitionDelay: megaVisible ? `${0.2 + i * 0.05}s` : "0s" }}
                                                >
                                                    <a
                                                        href="#services"
                                                        onClick={go("#services")}
                                                        className="group/svc flex items-center gap-3 rounded-[12px] px-3 py-3 transition-colors duration-300 hover:bg-white/[0.04]"
                                                    >
                                                        <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-[10px] border border-accent/25 bg-accent/10 text-accent transition-colors duration-300 group-hover/svc:border-transparent group-hover/svc:text-black">
                                                            {/* Gold fill on hover */}
                                                            <span
                                                                aria-hidden="true"
                                                                className="absolute inset-0 scale-0 rounded-[10px] transition-transform duration-300 group-hover/svc:scale-100"
                                                                style={{ background: GOLD }}
                                                            />
                                                            <span className="relative">
                                                                <ServiceIcon paths={s.icon} size={19} />
                                                            </span>
                                                        </span>
                                                        <span className="min-w-0 flex-1">
                                                            <span className="block text-[clamp(15px,1.1vw,18px)] leading-snug font-extrabold text-white">{s.name}</span>
                                                            <span className="block truncate text-[clamp(13px,0.9vw,15px)] leading-snug text-white/55">{s.text}</span>
                                                        </span>
                                                        <span
                                                            aria-hidden="true"
                                                            className="-translate-x-2 text-accent opacity-0 transition duration-300 group-hover/svc:translate-x-0 group-hover/svc:opacity-100"
                                                        >
                                                            →
                                                        </span>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* CTA bar */}
                                <div className="flex items-center justify-between gap-4 border-t border-white/10 bg-white/[0.02] px-[clamp(20px,2vw,28px)] py-4">
                                    <span className="text-[clamp(14px,1vw,16px)] text-white/60">
                                        Not sure what you need? <span className="text-white">Let&apos;s talk it through.</span>
                                    </span>
                                    <a
                                        href="#contact"
                                        onClick={go("#contact")}
                                        className="group/cta relative inline-flex h-[46px] shrink-0 items-center rounded-full pr-[52px] pl-6 text-[13px] font-extrabold tracking-[0.12em] text-black uppercase transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,204,0,0.35)]"
                                        style={{ background: GOLD }}
                                    >
                                        Book a free call
                                        <span
                                            aria-hidden="true"
                                            className="absolute top-1/2 right-[5px] grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black text-accent transition-transform duration-300 group-hover/cta:translate-x-[3px]"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14M13 6l6 6-6 6" />
                                            </svg>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Footer links */}
                <div
                    className={`mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[13px] tracking-[0.08em] text-white/70 transition-opacity duration-700 ${open ? "opacity-100 delay-[900ms]" : "opacity-0"
                        }`}
                >
                    {FOOT_LINKS.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-colors hover:text-accent"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
}