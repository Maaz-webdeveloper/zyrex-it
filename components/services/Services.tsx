"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useParentScroll } from "@/components/embed/useParentScroll";
import ServiceCard from "./ServiceCard";
import { SERVICES, SERVICES_COPY } from "./data";

// Heading of the Services section, plus the card list on mobile (and on desktop with reduced motion).
// The desktop stacking cards are in ServicesStage.tsx.

// Fully left through the top of the screen / still entering at the bottom
const MOTION = { scale: 0.96, y: 16, dim: 0.7, enterY: 20 };
const EXIT_LENGTH = 0.9; // the exit finishes when this share of the card is above the screen
const ENTER_LENGTH = 0.18; // the fade-in finishes after this share of the screen
const ENTER_OPACITY = 0.35;
const GLIDE = 0.14; // share of the remaining distance covered per frame (at 60fps)

type CardMotion = { exit: number; enter: number };

// Position inside this embed page. Unlike getBoundingClientRect it ignores the card's own transform.
// Measured only when the size changes, never per frame.
function layoutTop(el: HTMLElement) {
    let y = 0;
    for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
    return y;
}

function paint(el: HTMLElement, { exit, enter }: CardMotion) {
    const m = MOTION;
    const y = exit * m.y + (1 - enter) * m.enterY;
    el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${(1 - exit * (1 - m.scale)).toFixed(4)})`;
    el.style.opacity = ((1 - exit) * (ENTER_OPACITY + enter * (1 - ENTER_OPACITY))).toFixed(3);
    el.style.filter = exit > 0.002 ? `brightness(${(1 - exit * (1 - m.dim)).toFixed(3)})` : "";
    // Keeps the scale from re-rendering the card every frame; only while it is moving
    el.style.willChange = exit > 0 || enter < 1 ? "transform, opacity, filter" : "";
}

export default function Services() {
    const rootRef = useRef<HTMLElement>(null);
    const scroll = useParentScroll();

    useEffect(() => {
        const root = rootRef.current;
        if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-service-card]"));
        const state = cards.map<CardMotion | null>(() => null);
        const phone = window.matchMedia("(max-width: 767px)");
        let boxes = cards.map((el) => ({ top: layoutTop(el), height: el.offsetHeight }));
        const ro = new ResizeObserver(() => {
            boxes = cards.map((el) => ({ top: layoutTop(el), height: el.offsetHeight }));
        });
        ro.observe(root);

        const tick = () => {
            if (!phone.matches) return; // desktop: the list is hidden, the cards are in the stage
            const { top, viewport: vh } = scroll.current;
            const k = 1 - Math.pow(1 - GLIDE, gsap.ticker.deltaRatio(60)); // same glide at any refresh rate

            cards.forEach((el, i) => {
                const cardTop = top + boxes[i].top;
                const target = {
                    exit: gsap.utils.clamp(0, 1, -cardTop / (boxes[i].height * EXIT_LENGTH)),
                    enter: gsap.utils.clamp(0, 1, (vh - cardTop) / (vh * ENTER_LENGTH)),
                };
                const now = state[i];
                if (!now) {
                    state[i] = target; // first frame: no glide from nothing
                    paint(el, target);
                    return;
                }
                if (now.exit === target.exit && now.enter === target.enter) return;
                now.exit += (target.exit - now.exit) * k;
                now.enter += (target.enter - now.enter) * k;
                if (Math.abs(target.exit - now.exit) < 0.001) now.exit = target.exit;
                if (Math.abs(target.enter - now.enter) < 0.001) now.enter = target.enter;
                paint(el, now);
            });
        };

        gsap.ticker.add(tick);
        return () => {
            gsap.ticker.remove(tick);
            ro.disconnect();
            cards.forEach((el) => {
                el.style.transform = el.style.opacity = el.style.filter = el.style.willChange = "";
            });
        };
    }, [scroll]);

    return (
        <section ref={rootRef} className="relative w-full overflow-hidden bg-[#0a0a0a] px-5 py-[clamp(72px,9vw,140px)] text-white md:motion-safe:pb-[clamp(16px,2vw,40px)]">
            <div className="mx-auto max-w-[80rem]">
                {/* Heading (same pattern as Team) */}
                <div className="mx-auto flex max-w-[72rem] flex-col items-center text-center">
                    <span className="rounded-full border border-accent/70 px-5 py-2 text-[11px] font-normal tracking-[0.18em] text-white uppercase">
                        {SERVICES_COPY.label}
                    </span>
                    <h2 className="mt-6 text-[clamp(2.2rem,3.6vw,4rem)] leading-[1.08] font-normal tracking-[-0.02em] max-[480px]:text-[length:calc((100vw-40px)*0.082)] min-[900px]:whitespace-nowrap">
                        {SERVICES_COPY.heading}{" "}
                        <br className="min-[900px]:hidden" />
                        <span
                            className="animate-zx-shine bg-clip-text font-normal text-transparent"
                            style={{
                                backgroundImage: "linear-gradient(90deg, #ffcc00 0%, #ffdd65 25%, #fff3b0 50%, #ffdd65 75%, #ffcc00 100%)",
                                backgroundSize: "200% 100%",
                                WebkitTextStroke: "0.024em transparent", // Garet has no 500/600: this thickens the letters; bg-clip-text fills the stroke with the gold shine, so no outline
                            }}
                        >
                            {SERVICES_COPY.headingAccent}
                        </span>
                    </h2>
                    <p className="mt-5 max-w-[46rem] text-[clamp(14px,1.15vw,17px)] leading-[1.65] text-balance text-white/75">
                        {SERVICES_COPY.text}
                    </p>
                </div>

                {/* Cards: mobile, and desktop with reduced motion */}
                <div className="mt-[clamp(48px,6vw,96px)] flex flex-col gap-[clamp(24px,3vw,48px)] md:motion-safe:hidden">
                    {SERVICES.map((s, i) => (
                        <ServiceCard key={s.title} service={s} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}