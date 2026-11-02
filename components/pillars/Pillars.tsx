"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PILLARS, PILLARS_COPY } from "./data";
import { useParentScroll } from "@/components/embed/useParentScroll";
import PillarText, { LINE_GOLD } from "./PillarText";
import GoldButton from "@/components/ui/GoldButton";
import OutlinePill from "@/components/ui/OutlinePill";

gsap.registerPlugin(useGSAP);

// Heading block + mobile list of the Pillars section.
// The desktop stage is its own embed: PillarsStage.tsx (/embed/pillars-stage).


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
                {/* Same look as the Team heading block (label pill, heading, gold shine accent, paragraph) */}
                <OutlinePill>{PILLARS_COPY.label}</OutlinePill>
                <h2 className="mt-6 text-[clamp(2.2rem,3.6vw,4rem)] leading-[1.08] font-normal tracking-[-0.02em] max-[480px]:text-[length:calc((100vw-40px)*0.082)] min-[900px]:whitespace-nowrap">
                    {PILLARS_COPY.heading}{" "}
                    <br className="min-[900px]:hidden" />
                    <span
                        className="animate-zx-shine bg-clip-text font-normal text-transparent"
                        style={{
                            backgroundImage: "linear-gradient(90deg, #ffcc00 0%, #ffdd65 25%, #fff3b0 50%, #ffdd65 75%, #ffcc00 100%)",
                            backgroundSize: "200% 100%",
                            WebkitTextStroke: "0.024em transparent", // Garet has no 500/600: this thickens the letters; bg-clip-text fills the stroke with the gold shine, so no outline
                        }}
                    >
                        {PILLARS_COPY.headingAccent}
                    </span>
                </h2>
                <p className="mt-5 max-w-[46rem] text-[clamp(14px,1.15vw,17px)] leading-[1.65] text-balance text-white/75">
                    {PILLARS_COPY.text}
                </p>
                <GoldButton href={PILLARS_COPY.cta.href} className="mt-8">
                    {PILLARS_COPY.cta.label}
                </GoldButton>
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
