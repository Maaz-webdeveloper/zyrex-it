"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useParentScroll } from "@/components/embed/useParentScroll";
import { inIframe } from "@/lib/embed";
import ServiceCard from "./ServiceCard";
import { SERVICES } from "./data";

gsap.registerPlugin(useGSAP);

// Desktop stage of the Services section: the cards stack up like a deck. It is one screen tall and
// never moves itself: on GHL the page pins this iframe with position: sticky (ghl/services-embed.html).
// Mobile and reduced motion render nothing here (the card list lives in Services.tsx).

const PIN_VH = 5.25; // pin length (x screen height): 0.75 per card. Keep equal to the wrapper height in ghl/services-embed.html
const LEAD = 0.02; // share of the pin before card 2 starts, so card 1 can be read
const TAIL = 0.04; // share of the pin after card 8 has landed, before the pin releases
const LAND = 0.72; // share of each card's scroll spent sliding in; the rest it rests on top
const SCALE_STEP = 0.028; // a card shrinks this much per card on top of it
const DIM_STEP = 0.15; // and darkens this much
const DIM_MAX = 0.72;
const PROGRESS_EASE = 0.84; // smoothing of the scroll (closer to 1 = softer, slower to catch up)
const PROGRESS_SNAP = 0.0002; // this close to the target: land exactly on it

export default function ServicesStage() {
    const pinRef = useRef<HTMLDivElement>(null); // opened directly: stands in for the GHL wrapper
    const stageRef = useRef<HTMLElement>(null);
    const scroll = useParentScroll();

    useGSAP(
        () => {
            const pin = pinRef.current;
            const stage = stageRef.current;
            if (!pin || !stage) return;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

            // Opened directly there is no GHL wrapper: make this box behave like it
            if (!inIframe()) pin.style.height = `calc(var(--zx-vh, 100svh) * ${1 + PIN_VH})`;

            const cards = gsap.utils.toArray<HTMLElement>("[data-service-card]", stage);
            const dims = cards.map((el) => el.querySelector<HTMLElement>("[data-card-dim]"));
            // Shrink toward the center, so a card underneath pulls in on every side and no edge peeks out past the top card
            cards.forEach((el) => (el.style.transformOrigin = "50% 50%"));
            const landed = cards.map(() => 0);

            let stageH = stage.clientHeight;
            const ro = new ResizeObserver(() => {
                stageH = stage.clientHeight;
                drawnProgress = -1;
            });
            ro.observe(stage);

            let progress = 0; // eased progress (0-1)
            let drawnProgress = -1;
            let started = false;

            const draw = (p: number) => {
                const position = gsap.utils.clamp(0, 1, (p - LEAD) / (1 - LEAD - TAIL)) * (cards.length - 1);

                cards.forEach((_, i) => {
                    const a = i === 0 ? 1 : gsap.utils.clamp(0, 1, (position - (i - 1)) / LAND);
                    landed[i] = 1 - (1 - a) * (1 - a); // slows down as it lands
                });

                let onTop = 0; // how many cards are on top of this one (fractions while one is landing)
                for (let i = cards.length - 1; i >= 0; i--) {
                    const el = cards[i];
                    const y = (1 - landed[i]) * stageH;
                    el.style.visibility = landed[i] > 0 ? "visible" : "hidden";
                    el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${(1 - onTop * SCALE_STEP).toFixed(4)})`;
                    const dim = dims[i];
                    if (dim) dim.style.opacity = Math.min(DIM_MAX, onTop * DIM_STEP).toFixed(3);
                    onTop += landed[i];
                }
            };

            const tick = () => {
                if (stage.offsetParent === null) return; // mobile: hidden
                const { viewport, pinTop, pinHeight } = scroll.current;
                if (pinTop === undefined || pinHeight === undefined) return;

                const distance = pinHeight - viewport;
                const target = distance > 0 ? gsap.utils.clamp(0, 1, -pinTop / distance) : 0;

                if (!started) {
                    started = true;
                    progress = target; // first frame: start where the page is, no run-through of the deck
                } else {
                    progress += (target - progress) * (1 - Math.pow(PROGRESS_EASE, gsap.ticker.deltaRatio(60)));
                    if (Math.abs(target - progress) < PROGRESS_SNAP) progress = target;
                }

                if (progress !== drawnProgress) {
                    drawnProgress = progress;
                    draw(progress);
                }
            };

            gsap.ticker.add(tick);
            return () => {
                gsap.ticker.remove(tick);
                ro.disconnect();
            };
        },
        { scope: pinRef }
    );

    const last = SERVICES.length - 1;

    return (
        <div ref={pinRef} data-zyrex-pin="" className="hidden md:motion-safe:block">
            <section
                ref={stageRef}
                className="sticky top-0 flex items-center overflow-hidden bg-[#0a0a0a] px-5 text-white [--pad:clamp(16px,3.4vh,40px)] [--step:clamp(8px,1.3vh,14px)]"
                style={{ height: "var(--zx-vh, 100svh)" }}
            >
                {/* All cards in exactly the same spot, centered in the screen: each new card covers the one below
                    completely (the ones underneath only shrink/darken, so they stay hidden behind it).
                    --card-h keeps the same card size as before (it still leaves room for the old stack offset). */}
                <div
                    className="relative mx-auto w-full max-w-[80rem] [--card-h:min(calc(var(--zx-vh,100svh)-var(--pad)*2-var(--step)*var(--last)),720px)]"
                    style={{ "--last": last, height: "var(--card-h)" } as React.CSSProperties}
                >
                    {SERVICES.map((s, i) => (
                        <div
                            key={s.title}
                            className="absolute inset-x-0 top-0"
                            style={{ zIndex: i }}
                        >
                            <ServiceCard
                                service={s}
                                index={i}
                                stacked
                                style={i === 0 ? undefined : { visibility: "hidden", transform: "translate3d(0, 100vh, 0)" }}
                            />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
