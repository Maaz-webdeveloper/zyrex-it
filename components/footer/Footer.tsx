"use client";

import { useEffect, useState } from "react";
import { scrollParentTo } from "@/lib/embed";
import { ADDRESS, FOOTER_BRAND, FOOTER_COLUMNS, LEGAL, SOCIALS } from "./data";

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

export default function Footer() {
    const [year, setYear] = useState(2026);
    useEffect(() => setYear(new Date().getFullYear()), []);

    return (
        <footer className="relative w-full overflow-hidden bg-black px-5 pt-[clamp(64px,8vw,110px)] text-white">
            <div className="mx-auto max-w-[80rem]">
                <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_1px_minmax(0,2fr)] lg:gap-[clamp(32px,4vw,72px)]">
                    {/* ===== Left: brand ===== */}
                    <div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={FOOTER_BRAND.logo} alt="ZYREX IT" draggable={false} className="ml-[calc(clamp(46px,4vw,64px)/-3)] h-[clamp(46px,4vw,64px)] w-auto" />

                        <p className="mt-8 text-[clamp(32px,3.4vw,52px)] leading-[1.1] font-normal tracking-[-0.02em]">
                            {FOOTER_BRAND.taglineTop}
                            <br />
                            <span
                                className="animate-zx-shine bg-clip-text font-extrabold text-transparent"
                                style={{
                                    backgroundImage: "linear-gradient(90deg, #ffcc00 0%, #ffdd65 25%, #fff3b0 50%, #ffdd65 75%, #ffcc00 100%)",
                                    backgroundSize: "200% 100%",
                                }}
                            >
                                {FOOTER_BRAND.taglineGold}
                            </span>
                        </p>

                        {/* Social icons */}
                        <div className="mt-10 flex gap-3">
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
                        <a
                            href={FOOTER_BRAND.cta.href}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollParentTo(FOOTER_BRAND.cta.href);
                            }}
                            className="group/cta relative mt-10 inline-flex h-[46px] items-center rounded-full pr-[52px] pl-6 text-[12px] font-extrabold tracking-[0.12em] text-black uppercase transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,204,0,0.35)]"
                            style={{ background: GOLD }}
                        >
                            {FOOTER_BRAND.cta.label}
                            <span className="absolute top-1/2 right-[5px] grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black text-accent transition-transform duration-300 group-hover/cta:translate-x-[3px]">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M5 12h14M13 6l6 6-6 6" />
                                </svg>
                            </span>
                        </a>
                    </div>

                    {/* Divider (desktop) */}
                    <span aria-hidden="true" className="hidden bg-white/10 lg:block" />

                    {/* ===== Right: link columns ===== */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
                        {FOOTER_COLUMNS.map((col) => (
                            <div key={col.title}>
                                <p className="text-[12px] font-extrabold tracking-[0.18em] text-white uppercase">{col.title}</p>
                                <span aria-hidden="true" className="mt-3 block h-px w-8" style={{ background: GOLD }} />
                                <ul className="mt-5 grid gap-3">
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
                <div className="mt-[clamp(48px,6vw,80px)] flex flex-col gap-4 border-y border-white/10 py-6 text-[13px] text-white/55 md:flex-row md:items-center md:justify-between">
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

                {/* Step 2: big outline "ZYREX IT" goes here */}
                <div className="h-[clamp(80px,10vw,140px)]" />
            </div>
        </footer>
    );
}