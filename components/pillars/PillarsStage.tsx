"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PILLARS } from "./data";
import { useParentScroll } from "@/components/embed/useParentScroll";
import { inIframe } from "@/lib/embed";
import PillarText, { LINE_GOLD } from "./PillarText";
import PillarsVisual, { orbitOffset } from "./PillarsVisual";

gsap.registerPlugin(useGSAP);

// Desktop stage of the Pillars section. It is one screen tall and never moves itself:
// on GHL the page pins this iframe with position: sticky (ghl/pillars-stage-embed.html).
// Mobile renders nothing here (the mobile list lives in Pillars.tsx).

const STAGE_VH = 0.85; // height of the content inside the one-screen stage (x screen height)
const PIN_VH = 1.2; // pin length (x screen height). Keep equal to the wrapper height in ghl/pillars-stage-embed.html
const SHOW_AT = [0.1, 0.33, 0.56, 0.79]; // progress at which pillar 1, 2, 3, 4 appear
const ORBIT_DEG = 360; // how far the outer blocks turn around the core over the whole pin
const PROGRESS_EASE = 0.86; // smoothing of the line, orbit and reveals (closer to 1 = softer, slower to catch up)
const PROGRESS_SNAP = 0.0002; // this close to the target: land exactly on it

export default function PillarsStage() {
    const pinRef = useRef<HTMLDivElement>(null); // opened directly: stands in for the GHL wrapper
    const stageRef = useRef<HTMLElement>(null);
    const fillRef = useRef<HTMLSpanElement>(null);
    const scroll = useParentScroll();

    const bySide = (side: "left" | "right") => PILLARS.filter((p) => p.side === side).sort((a, b) => a.row - b.row);

    useGSAP(
        () => {
            const pin = pinRef.current;
            const stage = stageRef.current;
            const fill = fillRef.current;
            if (!pin || !stage || !fill) return;

            const items = gsap.utils.toArray<HTMLElement>("[data-pillar]", stage);
            const blocks = gsap.utils.toArray<SVGGElement>("[data-block-lit]", stage);
            const orbits = gsap.utils.toArray<SVGGElement>("[data-orbit]", stage);

            // Reduced motion: show everything, no pin
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                gsap.set(fill, { scaleY: 1 });
                gsap.set(blocks, { opacity: 1 });
                return;
            }

            // Opened directly there is no GHL wrapper: make this box behave like it
            if (!inIframe()) pin.style.height = `calc(var(--zx-vh, 100svh) * ${1 + PIN_VH})`;

            gsap.set(items, { autoAlpha: 0, y: 20 });

            const lit = new Map<Element, boolean>();
            const light = (el: Element, on: boolean) => {
                if (lit.get(el) === on) return;
                lit.set(el, on);
                gsap.to(el, { opacity: on ? 1 : 0, duration: 0.7, ease: "power2.out", overwrite: true });
            };
            const shown = new Map<HTMLElement, boolean>();
            const toggle = (el: HTMLElement, on: boolean) => {
                if (shown.get(el) === on) return;
                shown.set(el, on);
                gsap.to(el, { autoAlpha: on ? 1 : 0, y: on ? 0 : 20, duration: 0.6, ease: "power3.out", overwrite: true });
            };

            let progress = 0; // eased progress (0-1): drives the line, orbit and reveals
            let drawnProgress = 0;

            const tick = () => {
                if (stage.offsetParent === null) return; // mobile: hidden
                const { viewport, pinTop, pinHeight } = scroll.current;
                if (pinTop === undefined || pinHeight === undefined) return;

                const distance = pinHeight - viewport;
                const target = distance > 0 ? gsap.utils.clamp(0, 1, -pinTop / distance) : 0;

                progress += (target - progress) * (1 - Math.pow(PROGRESS_EASE, gsap.ticker.deltaRatio()));
                if (Math.abs(target - progress) < PROGRESS_SNAP) progress = target;
                const p = progress;

                if (p !== drawnProgress) {
                    drawnProgress = p;
                    gsap.set(fill, { scaleY: p });
                    // Orbit: scroll down = forward, scroll up = back. Only the position changes, so blocks stay upright.
                    orbits.forEach((el) => {
                        const o = orbitOffset(Number(el.dataset.orbit), p * ORBIT_DEG);
                        el.setAttribute("transform", `translate(${o.x} ${o.y})`);
                    });
                }

                items.forEach((el) => toggle(el, p >= SHOW_AT[Number(el.dataset.pillar)]));
                blocks.forEach((el) => {
                    const i = Number(el.dataset.blockLit);
                    light(el, i === 4 ? p >= 0.95 : p >= SHOW_AT[i]);
                });
            };

            gsap.ticker.add(tick);
            return () => gsap.ticker.remove(tick);
        },
        { scope: pinRef }
    );

    return (
        <div ref={pinRef} data-zyrex-pin="" className="hidden md:block">
            <section
                ref={stageRef}
                className="sticky top-0 flex items-center overflow-hidden bg-[#0a0a0a] px-5 text-white"
                style={{ height: "var(--zx-vh, 100svh)" }}
            >
                {/* Soft gold glow behind the stage */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "radial-gradient(ellipse 45% 45% at 50% 50%, rgba(255, 204, 0, 0.07), transparent 70%)" }}
                />

                <div
                    className="relative mx-auto grid w-full max-w-[72rem] grid-cols-[1fr_clamp(240px,26vw,400px)_1fr] gap-[clamp(24px,3vw,56px)]"
                    style={{ height: `calc(var(--zx-vh, 100svh) * ${STAGE_VH})` }}
                >
                    <div className="flex flex-col justify-between py-[8%]">
                        {bySide("left").map((p) => (
                            <PillarText key={p.title} pillar={p} align="right" />
                        ))}
                    </div>

                    {/* Center: blocks visual + line */}
                    <div className="relative">
                        <div data-visual="" className="absolute top-1/2 left-1/2 aspect-square w-full -translate-x-1/2 -translate-y-1/2">
                            <PillarsVisual />
                        </div>
                        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/10" />
                        <span
                            ref={fillRef}
                            className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 origin-top"
                            style={{ background: LINE_GOLD, transform: "scaleY(0)", boxShadow: "0 0 8px rgba(255, 204, 0, 0.6)" }}
                        />
                        <span className="absolute top-0 left-1/2 size-2 -translate-x-1/2 rounded-full bg-accent" />
                        <span className="absolute bottom-0 left-1/2 size-2 -translate-x-1/2 rounded-full bg-accent" />
                    </div>

                    <div className="flex flex-col justify-between py-[8%]">
                        {bySide("right").map((p) => (
                            <PillarText key={p.title} pillar={p} align="left" />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
