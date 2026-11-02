"use client";

import { useEffect, useRef, useState } from "react";
import { scrollParentTo } from "@/lib/embed";
import { ADDRESS, FOOTER_BRAND, FOOTER_COLUMNS, LEGAL, SOCIALS } from "./data";
import FooterWordmark from "./FooterWordmark";
import GoldButton from "@/components/ui/GoldButton";

const GOLD = "linear-gradient(135deg, #ffdd65, #ffcc00)";

// Section links (#...) scroll the GHL page; web links open in a new tab; mailto/tel work normally
function FooterLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
    const isSection = href.startsWith("#");
    const isWeb = href.startsWith("http");
    return (
        <a
            href={href}
            target={isWeb ? "_blank" : undefined}
            rel={isWeb ? "noopener noreferrer" : undefined}
            onClick={
                isSection
                    ? (e) => {
                        e.preventDefault();
                        scrollParentTo(href);
                    }
                    : undefined
            }
            className={`bg-no-repeat bg-size-[0%_1px] bg-position-[0_100%] pb-[2px] transition-[color,background-size] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] hover:text-accent hover:bg-size-[100%_1px] ${className}`}
            style={{ backgroundImage: "linear-gradient(90deg, #ffdd65, #ffcc00)" }}
        >
            {children}
        </a>
    );
}

// Logo PNG (/hero/logo.png, 3326x1014): the visible "T" ends at x = 2991px, i.e. 2.9497 x the image height.
// The image starts 0.336 x height left of the column (ml below), so the letters span 2.6137 x height from the "Z".
const LOGO_T_RIGHT = 2991 / 1014;
const LOGO_ML = 0.336;
const LOGO_VISIBLE_W = LOGO_T_RIGHT - LOGO_ML;

export default function Footer() {
    const [year, setYear] = useState(2026);
    useEffect(() => setYear(new Date().getFullYear()), []);

    // Desktop: size the logo so the right edge of the "T" lines up with the right edge of "Book a call".
    // Layout offsets (not getBoundingClientRect), so the magnetic button's movement doesn't affect it.
    // Mobile (or when the row wraps): the CSS size in the class is used.
    const logoRef = useRef<HTMLImageElement>(null);
    const rowRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const logo = logoRef.current;
        const row = rowRef.current;
        const socials = row?.firstElementChild as HTMLElement | null;
        const btn = row?.lastElementChild as HTMLElement | null;
        if (!logo || !row || !socials || !btn) return;
        const desktop = window.matchMedia("(min-width: 1024px)");
        const fit = () => {
            const sameLine = btn.offsetTop < socials.offsetTop + socials.offsetHeight;
            if (!desktop.matches || !sameLine) {
                logo.style.removeProperty("--logo-h");
                return;
            }
            const width = btn.offsetLeft + btn.offsetWidth - row.offsetLeft;
            logo.style.setProperty("--logo-h", `${(width / LOGO_VISIBLE_W).toFixed(2)}px`);
        };
        fit();
        const ro = new ResizeObserver(fit);
        ro.observe(row);
        ro.observe(btn);
        desktop.addEventListener("change", fit);
        return () => {
            ro.disconnect();
            desktop.removeEventListener("change", fit);
        };
    }, []);

    return (
        <footer className="relative min-h-(--zx-vh) w-full overflow-hidden bg-black px-5 pt-16 text-white lg:pt-[clamp(36px,calc((var(--zx-vh)-640px)*0.35),120px)]">
            <div className="mx-auto w-full max-w-[80rem]">
                <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,2.1fr)] lg:gap-[clamp(32px,3.4vw,64px)]">
                    {/* ===== Left: brand ===== */}
                    <div className="flex flex-col">
                        {/* The PNG has empty space around the letters: these margins line the letters up with the text below */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            ref={logoRef}
                            src={FOOTER_BRAND.logo}
                            alt="ZYREX IT"
                            draggable={false}
                            className="mt-[calc(var(--logo-h)*-0.3)] mb-[calc(var(--logo-h)*-0.25)] ml-[calc(var(--logo-h)*-0.336)] h-(--logo-h) w-auto max-w-none self-start [--logo-h:clamp(104px,10.5vw,150px)]"
                        />

                        <p className="mt-6 max-w-[24rem] text-[clamp(15px,1.15vw,17px)] leading-[1.6] text-balance text-white/70">{FOOTER_BRAND.text}</p>

                        {/* Social icons + Book a call: bottom edge lines up with the link columns */}
                        <div ref={rowRef} className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-5 lg:mt-auto lg:pt-6">
                            <div className="flex gap-3">
                                {SOCIALS.map((s) => (
                                    <a
                                        key={s.name}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.name}
                                        className="group/soc relative grid size-11 place-items-center overflow-hidden rounded-[10px] border border-accent/30 bg-white/[0.04] text-white transition-colors duration-300 hover:border-transparent hover:text-black"
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/soc:scale-x-100"
                                            style={{ background: GOLD }}
                                        />
                                        <svg aria-hidden="true" viewBox="0 0 24 24" className="relative size-[18px]" fill="currentColor">
                                            <path d={s.icon} />
                                        </svg>
                                    </a>
                                ))}
                            </div>

                            {/* Book a call */}
                            <GoldButton href={FOOTER_BRAND.cta.href}>{FOOTER_BRAND.cta.label}</GoldButton>
                        </div>
                    </div>

                    {/* Divider (desktop) */}
                    <span aria-hidden="true" className="hidden bg-white/10 lg:block" />

                    {/* ===== Right: link columns ===== */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-[1.45fr_0.8fr_0.85fr_1.25fr]">
                        {FOOTER_COLUMNS.map((col) => (
                            <div key={col.title}>
                                <p className="text-[12px] font-extrabold tracking-[0.18em] text-white uppercase">{col.title}</p>
                                <span aria-hidden="true" className="mt-3 block h-px w-8" style={{ background: GOLD }} />
                                <ul className="mt-4 grid gap-[clamp(8px,calc(var(--zx-vh)*0.013),14px)]">
                                    {col.links.map((l) => (
                                        <li key={l.label}>
                                            <FooterLink href={l.href} className="text-[clamp(14px,1vw,15px)] leading-snug text-white/60">
                                                {l.label}
                                            </FooterLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ===== Bottom bar ===== */}
                <div className="mt-12 flex flex-col gap-4 border-y border-white/10 py-6 lg:mt-[clamp(24px,calc((var(--zx-vh)-640px)*0.2),80px)] lg:py-4 text-[13px] text-white/55 md:flex-row md:items-center md:justify-between">
                    <div className="flex gap-6">
                        {LEGAL.map((l) => (
                            <FooterLink key={l.label} href={l.href}>
                                {l.label}
                            </FooterLink>
                        ))}
                    </div>
                    <p>{ADDRESS}</p>
                    <p className="text-white/80">© {year} ZYREX IT. All Rights Reserved</p>
                </div>

                {/* Same width as the divider lines above */}
                <div className="pt-8 lg:pt-[clamp(24px,calc((var(--zx-vh)-640px)*0.2),64px)]">
                    <FooterWordmark />
                </div>
            </div>
        </footer>
    );
}