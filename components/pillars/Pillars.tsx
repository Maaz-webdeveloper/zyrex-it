"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PILLARS, PILLARS_COPY, type Pillar } from "./data";
import { useParentScroll } from "@/components/embed/useParentScroll";
import { inIframe } from "@/lib/embed";
import PillarsVisual, { orbitOffset } from "./PillarsVisual";

gsap.registerPlugin(useGSAP);

const GOLD = "linear-gradient(135deg, #ffdd65, #ffcc00)";
const LINE_GOLD = "linear-gradient(to bottom, #ffdd65, #ffcc00)";
const STAGE_VH = 0.85; // stage height (x screen height)
const PIN_VH = 1.2; // how long the stage stays pinned while you scroll (x screen height)
const SHOW_AT = [0.1, 0.33, 0.56, 0.79]; // line progress at which pillar 1, 2, 3, 4 appear
const ORBIT_DEG = 360; // how far the outer blocks turn around the core over the whole section
const PROGRESS_EASE = 0.86; // smoothing of the line, orbit and reveals (closer to 1 = softer, slower to catch up)
const PROGRESS_SNAP = 0.0002; // this close to the target: land exactly on it
// Inside the iframe the scroll position arrives late and unevenly. These steady it without adding lag:
const FILTER_POSITION = 0.3; // how much of each new reading to trust
const FILTER_SPEED = 0.05; // how fast the estimated scroll speed adapts
const FILTER_LEAD_MS = 16; // look ahead by one frame, the delay of the message

function PillarText({ pillar, align }: { pillar: Pillar; align: "left" | "right" }) {
    const n = PILLARS.indexOf(pillar) + 1;
    return (
        <div data-pillar={n - 1} className={align === "right" ? "text-right" : "text-left"}>
            <span className="text-[12px] font-extrabold tracking-[0.2em] text-accent">{String(n).padStart(2, "0")}</span>
            <h3 className="mt-2 text-[clamp(22px,2vw,30px)] leading-tight font-extrabold">{pillar.title}</h3>
            <p className="mt-3 text-[clamp(14px,1.05vw,16px)] leading-[1.65] text-white/70">{pillar.text}</p>
        </div>
    );
}

export default function Pillars() {
    const rootRef = useRef<HTMLElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null); // tall box that creates the scroll distance (desktop)
    const stageRef = useRef<HTMLDivElement>(null); // the part that stays pinned (desktop)
    const fillRef = useRef<HTMLSpanElement>(null);
    const mListRef = useRef<HTMLDivElement>(null); // mobile list
    const mFillRef = useRef<HTMLSpanElement>(null);
    const scroll = useParentScroll();

    const bySide = (side: "left" | "right") => PILLARS.filter((p) => p.side === side).sort((a, b) => a.row - b.row);

    useGSAP(
        () => {
            const wrap = wrapRef.current;
            const stage = stageRef.current;
            const fill = fillRef.current;
            const mList = mListRef.current;
            const mFill = mFillRef.current;
            if (!wrap || !stage || !fill || !mList || !mFill) return;

            const desktopItems = gsap.utils.toArray<HTMLElement>("[data-pillar]", stage);
            const mobileItems = gsap.utils.toArray<HTMLElement>("[data-pillar]", mList);
            const blocks = gsap.utils.toArray<SVGGElement>("[data-block-lit]", stage);
            const orbits = gsap.utils.toArray<SVGGElement>("[data-orbit]", stage);
            const lit = new Map<Element, boolean>();
            const light = (el: Element, on: boolean) => {
                if (lit.get(el) === on) return;
                lit.set(el, on);
                gsap.to(el, { opacity: on ? 1 : 0, duration: 0.7, ease: "power2.out", overwrite: true });
            };

            // Reduced motion: show everything, no pinning
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
                gsap.set([fill, mFill], { scaleY: 1 });
                gsap.set(blocks, { opacity: 1 });
                return;
            }

            gsap.set([...desktopItems, ...mobileItems], { autoAlpha: 0, y: 20 });

            const shown = new Map<HTMLElement, boolean>();
            const toggle = (el: HTMLElement, on: boolean) => {
                if (shown.get(el) === on) return;
                shown.set(el, on);
                gsap.to(el, { autoAlpha: on ? 1 : 0, y: on ? 0 : 20, duration: 0.6, ease: "power3.out", overwrite: true });
            };
            // Position inside this embed page (same value whether the page scrolls itself or not)
            const pageTop = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;

            let progress = 0; // eased line progress (0-1): drives the line, orbit and reveals
            let drawnProgress = 0;

            // Scroll position for the pin. Opened directly it is already exact (Lenis, read live). Easing it
            // would make the stage drift, so only the late iframe signal is filtered.
            const framed = inIframe();
            let steady: number | null = null;
            let speed = 0; // px per ms
            let lastTop = 0;
            let stillFrames = 0;
            const steadyTop = (raw: number) => {
                if (!framed) return raw;
                const dt = Math.max(gsap.ticker.deltaRatio() * 16.67, 1);
                if (steady === null || Math.abs(raw - steady) > 300) {
                    // First reading or a jump (e.g. a menu link): no gliding
                    steady = raw;
                    speed = 0;
                    return raw;
                }
                stillFrames = raw === lastTop ? stillFrames + 1 : 0;
                lastTop = raw;
                if (stillFrames >= 4) {
                    // Scrolling stopped: land exactly on the real position
                    speed = 0;
                    steady += (raw - steady) * 0.3;
                    if (Math.abs(raw - steady) < 0.25) steady = raw;
                    return steady;
                }
                const predicted = steady + speed * dt;
                const miss = raw - predicted;
                steady = predicted + miss * FILTER_POSITION;
                speed += (miss * FILTER_SPEED) / dt;
                return steady + speed * FILTER_LEAD_MS;
            };

            const tick = () => {
                const { top: rawTop, viewport: vh } = scroll.current;
                const top = steadyTop(rawTop);

                if (wrap.offsetParent !== null) {
                    // ===== Desktop: pin the stage, fill the line, reveal pillars =====
                    const stageH = stage.offsetHeight;
                    const distance = wrap.offsetHeight - stageH;
                    const wrapOnScreen = top + pageTop(wrap);
                    const pin = gsap.utils.clamp(0, distance, (vh - stageH) / 2 - wrapOnScreen);
                    const target = distance > 0 ? pin / distance : 0;

                    // The pin stays exact so the stage feels attached to the page; everything else glides
                    gsap.set(stage, { y: pin });
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

                    desktopItems.forEach((el) => toggle(el, p >= SHOW_AT[Number(el.dataset.pillar)]));
                    blocks.forEach((el) => {
                        const i = Number(el.dataset.blockLit);
                        light(el, i === 4 ? p >= 0.95 : p >= SHOW_AT[i]);
                    });
                } else {
                    // ===== Mobile: fill the side line, reveal each pillar as it comes on screen =====
                    const listOnScreen = top + pageTop(mList);
                    const p = gsap.utils.clamp(0, 1, (vh * 0.7 - listOnScreen) / mList.offsetHeight);
                    gsap.set(mFill, { scaleY: p });
                    mobileItems.forEach((el) => toggle(el, top + pageTop(el) < vh * 0.85));
                }
            };

            gsap.ticker.add(tick);
            return () => gsap.ticker.remove(tick);
        },
        { scope: rootRef }
    );

    return (
        <section ref={rootRef} className="relative w-full overflow-hidden bg-[#0a0a0a] px-5 py-[clamp(72px,9vw,140px)] text-white">
            {/* Soft gold glow behind the stage */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: "radial-gradient(ellipse 45% 35% at 50% 62%, rgba(255, 204, 0, 0.07), transparent 70%)" }}
            />

            {/* ===== Heading block ===== */}
            <div className="relative mx-auto flex max-w-[60rem] flex-col items-center text-center">
                <h2 className="text-[clamp(32px,4.4vw,64px)] leading-[1.08] font-normal tracking-[-0.02em] text-balance">
                    {PILLARS_COPY.heading}
                </h2>
                <p className="mt-6 max-w-[40rem] text-[clamp(15px,1.15vw,17px)] leading-[1.65] text-balance text-white/75">
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

            {/* ===== Desktop: tall wrapper (scroll distance) + pinned stage ===== */}
            <div
                ref={wrapRef}
                className="relative mt-[clamp(56px,7vw,110px)] hidden md:block"
                style={{ height: `calc(var(--zx-vh, 100svh) * ${STAGE_VH + PIN_VH})` }}
            >
                <div
                    ref={stageRef}
                    className="relative mx-auto grid max-w-[72rem] grid-cols-[1fr_clamp(240px,26vw,400px)_1fr] gap-[clamp(24px,3vw,56px)] will-change-transform"
                    style={{ height: `calc(var(--zx-vh, 100svh) * ${STAGE_VH})` }}
                >
                    <div className="flex flex-col justify-between py-[8%]">
                        {bySide("left").map((p) => (
                            <PillarText key={p.title} pillar={p} align="right" />
                        ))}
                    </div>

                    {/* Center: line + placeholder for the visual (Step 6) */}
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