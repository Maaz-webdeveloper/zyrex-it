"use client";

import { useEffect, useRef, useState } from "react";
import { lockParentScroll, scrollParentTo } from "@/lib/embed";
import { CORE_SERVICES, ServiceIcon } from "@/components/services/core";

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

// Our 4 core services (desktop panel boxes + mobile list), shared with the Services page hero
const SERVICES = CORE_SERVICES;

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
const BOX_BG = "linear-gradient(160deg, rgba(30, 27, 18, 0.92), rgba(12, 12, 10, 0.95))";
const BOX_GLOW = "radial-gradient(ellipse at 50% 0%, rgba(255, 204, 0, 0.13), transparent 70%)";
const SHINE = "linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent-light) 25%, var(--color-accent-light) 50%, var(--color-accent-light) 75%, var(--color-accent) 100%)"; // same as the heading shine, theme gold shades only (no white)
const PANEL_OFFSET_Y = 48; // desktop panel starts this many px above the "Services" row
const PANEL_FOOT_GAP = 24; // min space between the panel and the footer links

type MenuProps = {
    open: boolean;
    origin: { x: number; y: number } | null; // where the circle opens from (the button)
    onClose: () => void;
};

export default function Menu({ open, origin, onClose }: MenuProps) {
    const [mega, setMega] = useState(false); // desktop: services panel
    const [mobileServices, setMobileServices] = useState(false); // touch/small screens: services list
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const servicesRef = useRef<HTMLLIElement>(null);
    const panelRef = useRef<HTMLElement>(null);
    const footRef = useRef<HTMLDivElement>(null);
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

    // Keep the desktop panel lined up with the "Services" row, inside the screen and above the footer links
    useEffect(() => {
        const place = () => {
            const row = servicesRef.current;
            const panel = panelRef.current;
            const foot = footRef.current;
            if (!row || !panel || !foot) return;
            const wrapTop = (panel.offsetParent as HTMLElement | null)?.getBoundingClientRect().top ?? 0;
            const minTop = 24 - wrapTop; // 24px below the screen top
            // Bottom limit: the footer links (or the screen bottom, whichever is higher)
            const bottom = Math.min(window.innerHeight - 24, foot.getBoundingClientRect().top - PANEL_FOOT_GAP) - wrapTop;
            // Short screens: shrink the panel so it always fits between the two limits
            const room = bottom - minTop;
            const scale = panel.offsetHeight > room ? room / panel.offsetHeight : 1;
            panel.style.scale = scale < 1 ? String(scale) : "";
            const height = panel.offsetHeight * scale;
            const wanted = row.offsetTop - PANEL_OFFSET_Y;
            panel.style.top = `${Math.max(minTop, Math.min(wanted, bottom - height))}px`;
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
                                    >
                                        <small className="text-[0.8rem] tracking-[0.2em] text-accent">
                                            {String(i + 1).padStart(2, "0")}
                                        </small>

                                        {/* Label with a gold underline that grows from the left on hover */}
                                        <span className="relative">
                                            {/* Text turns transparent on hover/active, revealing the gold shine gradient behind it */}
                                            <span
                                                className={`animate-zx-shine bg-clip-text transition-colors duration-500 [@media(hover:hover)]:group-hover/link:text-transparent ${active ? "text-transparent" : ""
                                                    }`}
                                                style={{
                                                    backgroundImage: SHINE,
                                                    backgroundSize: "200% 100%",
                                                    filter: active ? "drop-shadow(0 0 18px rgba(255, 204, 0, 0.35))" : undefined,
                                                }}
                                            >
                                                {item.label}
                                            </span>
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

                    {/* ===== Desktop: Services mega panel (label + 4 portrait service cards side-by-side) ===== */}
                    <aside
                        ref={panelRef}
                        aria-label="Our services"
                        onMouseEnter={showMega}
                        onMouseLeave={hideMegaSoon}
                        className={`absolute left-[calc(100%+clamp(32px,4vw,64px))] hidden origin-top-left w-[clamp(640px,56vw,960px)] transition-[clip-path,opacity,translate] duration-700 ${EASE} min-[1024px]:block ${megaVisible ? "pointer-events-auto translate-x-0 opacity-100" : "pointer-events-none -translate-x-4 opacity-0"
                            }`}
                        style={{ clipPath: megaVisible ? "inset(-20px -20px -20px -20px)" : "inset(-20px 100% -20px -20px)" }}
                    >
                        {/* Header: small label + count */}
                        <div className="mb-[clamp(14px,1.3vw,20px)] flex items-center gap-3 text-[12px] tracking-[0.3em] uppercase">
                            <span className="h-px w-6 rounded-full" style={{ background: GOLD }} />
                            <span className="text-white/60">Our Services</span>
                            <span className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent" />
                            <span className="text-accent/80">0{SERVICES.length}</span>
                        </div>

                        {/* 4 core services: 4 portrait cards side-by-side */}
                        <ul className="grid grid-cols-4 gap-[clamp(12px,1vw,16px)]">
                            {SERVICES.map((s, i) => (
                                <li
                                    key={s.name}
                                    className={`transition-[opacity,translate] duration-500 ${megaVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                                        }`}
                                    style={{ transitionDelay: megaVisible ? `${0.15 + i * 0.06}s` : "0s" }}
                                >
                                    <a
                                        href="#services"
                                        onClick={go("#services")}
                                        className="group/svc block h-full rounded-[18px] p-px transition-[translate,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.45),0_0_36px_rgba(255,204,0,0.22)]"
                                        style={{ background: PANEL_EDGE }}
                                    >
                                        <span
                                            className="relative flex h-full min-h-[clamp(175px,14vw,230px)] flex-col overflow-hidden rounded-[17px] p-[clamp(14px,1.2vw,20px)]"
                                            style={{ background: BOX_BG }}
                                        >
                                            {/* Soft gold radial glow in the top-left corner (faint, brightens on hover) */}
                                            <span
                                                aria-hidden="true"
                                                className="pointer-events-none absolute inset-0 opacity-[0.08] transition-opacity duration-500 group-hover/svc:opacity-[0.16]"
                                                style={{
                                                    background: "radial-gradient(circle at 0% 0%, rgba(255, 204, 0, 0.5), transparent 60%)",
                                                }}
                                            />

                                            {/* Gold glow that fades in on hover */}
                                            <span
                                                aria-hidden="true"
                                                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/svc:opacity-100"
                                                style={{ background: BOX_GLOW }}
                                            />

                                            {/* Top: Icon tile + Arrow in top right */}
                                            <div className="relative flex items-start justify-between">
                                                <span className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-[14px] border border-accent/25 bg-accent/10 text-accent transition-[color,border-color,box-shadow] duration-300 group-hover/svc:border-transparent group-hover/svc:text-black group-hover/svc:shadow-[0_8px_24px_rgba(255,204,0,0.35)]">
                                                    <span
                                                        aria-hidden="true"
                                                        className="absolute inset-0 origin-left scale-x-0 rounded-[14px] transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/svc:scale-x-100"
                                                        style={{ background: "linear-gradient(90deg, var(--color-accent-light), var(--color-accent))" }}
                                                    />
                                                    <span className="relative">
                                                        <ServiceIcon paths={s.icon} size={22} />
                                                    </span>
                                                </span>
                                                <span
                                                    aria-hidden="true"
                                                    className="relative z-10 -translate-x-2 text-accent opacity-0 transition duration-300 group-hover/svc:translate-x-0 group-hover/svc:opacity-100"
                                                >
                                                    →
                                                </span>
                                            </div>

                                            {/* Title + text: top-aligned after a fixed gap so every card shares one baseline */}
                                            <div className="mt-4">
                                                <span className="block text-[clamp(15px,1.15vw,19px)] leading-tight zx-medium text-white min-h-[2.5em]">{s.name}</span>
                                                <span className="mt-2 block text-[clamp(12px,0.85vw,14px)] leading-snug text-white/60">{s.text}</span>
                                            </div>
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </aside>
                </div>

                {/* Footer links */}
                <div
                    ref={footRef}
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