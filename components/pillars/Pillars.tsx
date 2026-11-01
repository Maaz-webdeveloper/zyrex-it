"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PILLARS, PILLARS_COPY } from "./data";
import { useParentScroll } from "@/components/embed/useParentScroll";
import PillarText, { LINE_GOLD } from "./PillarText";

gsap.registerPlugin(useGSAP);

// Heading block + mobile list of the Pillars section.
// The desktop stage is its own embed: PillarsStage.tsx (/embed/pillars-stage).

const GOLD = "linear-gradient(135deg, #ffdd65, #ffcc00)";

export default function Pillars() {
    const rootRef = useRef<HTMLElement>(null);
    const mListRef = useRef<HTMLDivElement>(null);
    const mFillRef = useRef<HTMLSpanElement>(null);
    const scroll = useParentScroll();

    useGSAP(
        () => {
            const mList = mListRef.current;
            const mFill = mFillRef.current;
            if (!mList || !mFill) return;

            // Reduced motion: show everything
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                gsap.set(mFill, { scaleY: 1 });
                return;
            }

            const items = gsap.utils.toArray<HTMLElement>("[data-pillar]", mList);
            gsap.set(items, { autoAlpha: 0, y: 20 });

            const shown = new Map<HTMLElement, boolean>();
            const toggle = (el: HTMLElement, on: boolean) => {
                if (shown.get(el) === on) return;
                shown.set(el, on);
                gsap.to(el, { autoAlpha: on ? 1 : 0, y: on ? 0 : 20, duration: 0.6, ease: "power3.out", overwrite: true });
            };
            // Position inside this embed page (same value whether the page scrolls itself or not)
            const pageTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;

            // Fill the side line, reveal each pillar as it comes on screen
            const tick = () => {
                if (mList.offsetParent === null) return; // desktop: hidden
                const { top, viewport: vh } = scroll.current;
                const listOnScreen = top + pageTop(mList);
                const p = gsap.utils.clamp(0, 1, (vh * 0.7 - listOnScreen) / mList.offsetHeight);
                gsap.set(mFill, { scaleY: p });
                items.forEach((el) => toggle(el, top + pageTop(el) < vh * 0.85));
            };

            gsap.ticker.add(tick);
            return () => gsap.ticker.remove(tick);
        },
        { scope: rootRef }
    );

    return (
        <section
            ref={rootRef}
            className="relative w-full overflow-hidden bg-[#0a0a0a] px-5 pt-[clamp(72px,9vw,140px)] pb-[clamp(72px,9vw,140px)] text-white md:pb-[clamp(16px,2vw,40px)]"
        >
            {/* Soft gold glow behind the list (desktop: lives in the stage) */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 md:hidden"
                style={{ background: "radial-gradient(ellipse 45% 35% at 50% 62%, rgba(255, 204, 0, 0.07), transparent 70%)" }}
            />

            {/* ===== Heading block ===== */}
            <div className="relative mx-auto flex max-w-[120rem] flex-col items-center text-center">
                <h2 className="text-[clamp(32px,4.2vw,96px)] leading-[1.08] font-normal tracking-[-0.02em] text-balance">
                    {PILLARS_COPY.heading}
                </h2>
                <p className="mt-[clamp(20px,1.8vw,36px)] max-w-[44em] text-[clamp(15px,1.4vw,28px)] leading-[1.6] text-balance text-white/75">
                    {PILLARS_COPY.text}
                </p>
                <a
                    href={PILLARS_COPY.cta.href}
                    className="group/cta relative mt-8 inline-flex h-[46px] items-center rounded-full pr-[52px] pl-6 text-[12px] font-extrabold tracking-[0.12em] text-black uppercase transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,204,0,0.35)]"
                    style={{ background: GOLD }}
                >
                    {PILLARS_COPY.cta.label}
                    <span className="absolute top-1/2 right-[5px] grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black text-accent transition-transform duration-300 group-hover/cta:translate-x-[3px]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                    </span>
                </a>
            </div>

            {/* ===== Mobile: line on the left, pillars stacked ===== */}
            <div ref={mListRef} className="relative mx-auto mt-14 max-w-[30rem] pl-8 md:hidden">
                <span className="absolute inset-y-0 left-[3px] w-px bg-white/10" />
                <span
                    ref={mFillRef}
                    className="absolute inset-y-0 left-[3px] w-px origin-top"
                    style={{ background: LINE_GOLD, transform: "scaleY(0)", boxShadow: "0 0 8px rgba(255, 204, 0, 0.6)" }}
                />
                <div className="flex flex-col gap-12">
                    {PILLARS.map((p) => (
                        <PillarText key={p.title} pillar={p} align="left" />
                    ))}
                </div>
            </div>
        </section>
    );
}
