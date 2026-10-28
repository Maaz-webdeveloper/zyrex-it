"use client";

import { useEffect, useRef, useState } from "react";
import { lockParentScroll, scrollParentTo } from "@/lib/embed";

const MENU_ITEMS = [
    { label: "Home", href: "#top" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Team", href: "#team" },
    { label: "Appointment", href: "#appointment" },
    { label: "Career", href: "#career" },
    { label: "Blog", href: "#blog" },
    { label: "Contact", href: "#contact" },
];

// Services shown in the mega menu (placeholder list, change freely)
const SERVICES = [
    { name: "Web Design & Development", text: "Fast, high-converting websites", icon: ["M3 4h18v12H3z", "M8 20h8", "M12 16v4"] },
    { name: "SEO", text: "Rank higher and get found on Google", icon: ["M11 4a7 7 0 1 1 0 14a7 7 0 0 1 0-14z", "M21 21l-4.3-4.3"] },
    { name: "Paid Ads", text: "Google & Meta ads that bring real leads", icon: ["M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z", "M16 9a4 4 0 0 1 0 6"] },
    { name: "Social Media Marketing", text: "Content and growth on every platform", icon: ["M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"] },
    { name: "CRM & Automation", text: "GoHighLevel funnels, follow-ups and workflows", icon: ["M4 4h6v6H4z", "M14 14h6v6h-6z", "M10 7h4a3 3 0 0 1 3 3v4"] },
    { name: "AI Automation", text: "Chatbots and AI agents that work 24/7", icon: ["M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8z", "M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8z"] },
    { name: "Branding & Design", text: "Logos and identity that stand out", icon: ["M12 19l7-7 3 3-7 7-3-3z", "M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z", "M2 2l7.6 7.6"] },
    { name: "Content & Video", text: "Reels, ads and creatives that convert", icon: ["M3 6h12v12H3z", "M15 10l6-3v10l-6-3"] },
];

const FOOT_LINKS = [
    { label: "hello@zyrexit.com", href: "mailto:hello@zyrexit.com" },
    { label: "Facebook", href: "https://www.facebook.com/zyrexit" },
    { label: "Instagram", href: "https://www.instagram.com/zyrexit" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/zyrex-it" },
];

const EASE = "ease-[cubic-bezier(0.76,0,0.24,1)]";
const GOLD = "linear-gradient(135deg, #ffdd65, #ffcc00)";
const PANEL_EDGE =
    "linear-gradient(140deg, rgba(255, 204, 0, 0.5), rgba(255, 255, 255, 0.08) 35%, rgba(255, 255, 255, 0.04) 70%, rgba(255, 204, 0, 0.25))";
const PANEL_BG = "linear-gradient(160deg, rgba(24, 24, 24, 0.92), rgba(10, 10, 10, 0.9))";

type MenuProps = {
    open: boolean;
    origin: { x: number; y: number } | null; // where the circle opens from (the button)
    onClose: () => void;
};

function ServiceIcon({ paths }: { paths: string[] }) {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-[18px]"
        >
            {paths.map((d) => (
                <path key={d} d={d} />
            ))}
        </svg>
    );
}

export default function Menu({ open, origin, onClose }: MenuProps) {
    const [mega, setMega] = useState(false); // desktop: services panel
    const [mobileServices, setMobileServices] = useState(false); // mobile/tablet: services accordion
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    // Desktop mega menu: open on hover/focus, close shortly after the mouse leaves
    const showMega = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        setMega(true);
    };
    const hideMegaSoon = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
        closeTimer.current = setTimeout(() => setMega(false), 180);
    };
    const megaVisible = open && mega;
    const servicesListVisible = open && mobileServices;

    // Link click: close menu, then smooth-scroll the GHL page to that section
    const go = (href: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        setMega(false);
        setMobileServices(false);
        onClose();
        lockParentScroll(false);
        setTimeout(() => scrollParentTo(href), 150);
    };

    const at = origin ? `${origin.x}px ${origin.y}px` : "calc(100% - 60px) 48px";

    return (
        <nav
            id="zx-menu"
            aria-label="Main menu"
            inert={!open}
            data-native-scroll=""
            className={`fixed inset-0 z-40 flex flex-col overflow-y-auto px-[clamp(24px,8vw,120px)] pt-[100px] pb-10 transition-[clip-path,visibility] duration-[900ms] ${EASE} ${open ? "visible" : "invisible delay-[0ms,900ms]"
                }`}
            style={{
                clipPath: open ? `circle(150% at ${at})` : `circle(0px at ${at})`,
                background: "radial-gradient(circle at 85% 15%, rgba(255, 204, 0, 0.12), transparent 50%), #050505",
            }}
        >
            {/* my-auto keeps everything vertically centered, but lets it scroll when it is taller than the screen */}
            <div className="my-auto flex w-full items-center justify-between gap-[clamp(32px,5vw,96px)]">
                {/* ===== Left: main links + footer links ===== */}
                <div className="min-w-0">
                    <ul>
                        {MENU_ITEMS.map((item, i) => {
                            const isServices = item.label === "Services";
                            return (
                                <li
                                    key={item.label}
                                    className={`transition-[opacity,translate] ${open ? `translate-y-0 opacity-100 duration-[700ms,900ms] ${EASE}` : "translate-y-10 opacity-0 duration-[400ms]"
                                        }`}
                                    style={{ transitionDelay: open ? `${0.3 + i * 0.07}s` : "0s" }}
                                    onMouseEnter={isServices ? showMega : () => setMega(false)}
                                    onMouseLeave={isServices ? hideMegaSoon : undefined}
                                >
                                    <div className="flex items-center gap-4">
                                        <a
                                            href={item.href}
                                            onClick={go(item.href)}
                                            onFocus={isServices ? showMega : undefined}
                                            className={`flex items-baseline gap-[18px] py-[0.08em] text-[clamp(2rem,min(5.6vw,7.2vh),4.6rem)] leading-[1.08] font-extrabold uppercase transition-[color,padding] duration-300 hover:pl-3.5 hover:text-accent ${isServices && megaVisible ? "pl-3.5 text-accent" : "text-white/85"
                                                }`}
                                        >
                                            <small className="text-[0.8rem] tracking-[0.2em] text-accent">
                                                {String(i + 1).padStart(2, "0")}
                                            </small>
                                            {item.label}
                                        </a>

                                        {/* Mobile/tablet: open the services list */}
                                        {isServices && (
                                            <button
                                                type="button"
                                                onClick={() => setMobileServices((v) => !v)}
                                                aria-expanded={servicesListVisible}
                                                aria-label={servicesListVisible ? "Hide services" : "Show services"}
                                                className="grid size-9 place-items-center rounded-full border border-accent/40 text-accent transition-transform duration-300 min-[1024px]:hidden"
                                                style={{ rotate: servicesListVisible ? "45deg" : "0deg" }}
                                            >
                                                <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
                                                    <path d="M12 5v14M5 12h14" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>

                                    {/* Mobile/tablet: services accordion */}
                                    {isServices && (
                                        <div
                                            className={`grid transition-[grid-template-rows,opacity] duration-500 min-[1024px]:hidden ${servicesListVisible ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                                }`}
                                        >
                                            <ul className="overflow-hidden">
                                                <div className="grid gap-2.5 py-3 pl-[calc(0.8rem+18px)]">
                                                    {SERVICES.map((s) => (
                                                        <li key={s.name}>
                                                            <a
                                                                href="#services"
                                                                onClick={go("#services")}
                                                                className="flex items-center gap-3 text-[15px] text-white/75 transition-colors hover:text-accent"
                                                            >
                                                                <span className="size-1.5 rounded-full bg-accent" />
                                                                {s.name}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </div>
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>

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

                {/* ===== Right (desktop): Services mega menu ===== */}
                <aside
                    aria-label="Our services"
                    onMouseEnter={showMega}
                    onMouseLeave={hideMegaSoon}
                    className={`hidden w-[clamp(440px,44vw,760px)] shrink-0 transition duration-500 ${EASE} min-[1024px]:block ${megaVisible ? "pointer-events-auto translate-x-0 opacity-100" : "pointer-events-none translate-x-6 opacity-0"
                        }`}
                >
                    <div className="rounded-[24px] p-px shadow-[0_30px_80px_rgba(0,0,0,0.6)]" style={{ background: PANEL_EDGE }}>
                        <div className="rounded-[23px] p-[clamp(20px,2vw,32px)] backdrop-blur-xl" style={{ background: PANEL_BG }}>
                            <p className="mb-5 pl-[0.3em] text-[11px] tracking-[0.3em] text-white/60 uppercase">Our Services</p>

                            <div className="grid grid-cols-2 gap-3">
                                {SERVICES.map((s) => (
                                    <a
                                        key={s.name}
                                        href="#services"
                                        onClick={go("#services")}
                                        className="group/svc flex items-start gap-3 rounded-[14px] border border-white/5 p-3 transition duration-300 hover:border-accent/30 hover:bg-white/[0.04]"
                                    >
                                        <span className="grid size-10 shrink-0 place-items-center rounded-[10px] border border-accent/25 bg-accent/10 text-accent">
                                            <ServiceIcon paths={s.icon} />
                                        </span>
                                        <span className="min-w-0">
                                            <span className="flex items-center gap-2 text-[clamp(13px,1vw,15px)] leading-snug font-extrabold text-white">
                                                {s.name}
                                                <span
                                                    aria-hidden="true"
                                                    className="-translate-x-1 text-accent opacity-0 transition duration-300 group-hover/svc:translate-x-0 group-hover/svc:opacity-100"
                                                >
                                                    →
                                                </span>
                                            </span>
                                            <span className="mt-1 block text-[12.5px] leading-snug text-white/55">{s.text}</span>
                                        </span>
                                    </a>
                                ))}
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                                <a
                                    href="#services"
                                    onClick={go("#services")}
                                    className="group/all inline-flex items-center gap-2 text-[14px] text-accent"
                                >
                                    View all services
                                    <span aria-hidden="true" className="transition-transform duration-300 group-hover/all:translate-x-1">
                                        →
                                    </span>
                                </a>
                                <a
                                    href="#contact"
                                    onClick={go("#contact")}
                                    className="rounded-full px-5 py-2.5 text-[12px] font-extrabold tracking-[0.1em] text-black uppercase transition-[translate] duration-300 hover:-translate-y-0.5"
                                    style={{ background: GOLD }}
                                >
                                    Book a call
                                </a>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </nav>
    );
}