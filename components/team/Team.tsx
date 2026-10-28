"use client";

// Team slider ("Meet Our Awesome People" style), ZYREX dark + gold theme.
// Drag with the mouse or swipe on mobile, arrows on the sides, endless loop.
// Center focus: the middle card is full size and bright, side cards are smaller and dimmer.
// Hover (mouse devices): photo turns to color, gold ring appears, name + role pills rise.
// Touch devices: names and colors are always visible (there is no hover).
// Scroll entrance: label, heading, cards and arrows rise in when the section comes into view.

import { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType, EmblaEventType } from "embla-carousel";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TEAM, TEAM_COPY } from "./data";

gsap.registerPlugin(useGSAP);

const GOLD = "linear-gradient(135deg, #ffdd65, #ffcc00)";

// Center focus settings
const FOCUS = {
    minScale: 0.86, // size of the side cards
    minOpacity: 0.45, // brightness of the side cards
    strength: 0.52, // how fast cards shrink away from the center (Embla example value)
};

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);

function Arrow({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={dir === "prev" ? "Previous team member" : "Next team member"}
            className="group/arrow relative grid size-[clamp(52px,4.6vw,74px)] shrink-0 place-items-center overflow-hidden rounded-full border border-white/10 bg-white/[0.05] text-white transition-[scale,border-color] duration-300 hover:scale-105 hover:border-transparent"
        >
            {/* Gold fill on hover */}
            <span
                aria-hidden="true"
                className="absolute inset-0 scale-0 rounded-full transition-transform duration-300 group-hover/arrow:scale-100"
                style={{ background: GOLD }}
            />
            <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`relative size-[38%] transition-colors duration-300 group-hover/arrow:text-black ${dir === "prev" ? "rotate-180" : ""}`}
            >
                <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
        </button>
    );
}

function Card({ name, role, photo }: { name: string; role: string; photo: string }) {
    return (
        <article
            data-reveal="card"
            className="group relative isolate mx-auto aspect-[41/58] w-full max-w-[410px] rounded-full p-0 transition-[padding,background-color] duration-500 hover:bg-white/[0.04] hover:p-[7%] [@media(hover:none)]:bg-white/[0.04] [@media(hover:none)]:p-[5%]"
        >
            {/* Soft gold glow behind the card (on hover; always a little on touch devices) */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-[6%] -z-10 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 [@media(hover:none)]:opacity-60"
                style={{
                    background:
                        "radial-gradient(closest-side, rgba(255, 204, 0, 0.35), rgba(255, 204, 0, 0.12) 60%, transparent)",
                }}
            />
            {/* Gold ring */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 scale-95 rounded-full border-[1.5px] border-accent opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100 group-hover:shadow-[0_0_35px_rgba(255,204,0,0.35),inset_0_0_25px_rgba(255,204,0,0.12)] [@media(hover:none)]:scale-100 [@media(hover:none)]:opacity-100 [@media(hover:none)]:shadow-[0_0_20px_rgba(255,204,0,0.2)]"
            />

            <div className="relative h-full w-full overflow-hidden rounded-full bg-[#141414]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={photo}
                    alt={name}
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0 [@media(hover:none)]:grayscale-0"
                />

                {/* Soft dark fade at the bottom */}
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "linear-gradient(to bottom, transparent 55%, rgba(0, 0, 0, 0.55))" }}
                />

                {/* Name + role pills */}
                <div className="absolute top-[56%] left-1/2 flex -translate-x-1/2 translate-y-3 flex-col items-center gap-1.5 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
                    <span
                        className="rounded-full px-[clamp(18px,1.8vw,28px)] py-[clamp(8px,0.8vw,12px)] text-[clamp(14px,1.15vw,18px)] font-extrabold whitespace-nowrap text-black uppercase shadow-[0_10px_30px_rgba(255,204,0,0.3)]"
                        style={{ background: GOLD }}
                    >
                        {name}
                    </span>
                    <span className="rounded-full border border-white/10 bg-black/70 px-[clamp(14px,1.4vw,22px)] py-[clamp(6px,0.6vw,9px)] text-[clamp(10px,0.8vw,12px)] tracking-[0.12em] whitespace-nowrap text-white/85 uppercase backdrop-blur-md">
                        {role}
                    </span>
                </div>
            </div>
        </article>
    );
}

export default function Team() {
    const rootRef = useRef<HTMLElement>(null);
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
    const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    /* ---------- Center focus (based on Embla's official "scale" example) ---------- */
    const factor = useRef(0);
    const nodes = useRef<HTMLElement[]>([]);

    const setNodes = useCallback((api: EmblaCarouselType) => {
        nodes.current = api.slideNodes().map((slide) => slide.querySelector("[data-focus]") as HTMLElement);
    }, []);

    const setFactor = useCallback((api: EmblaCarouselType) => {
        factor.current = FOCUS.strength * api.scrollSnapList().length;
    }, []);

    const applyFocus = useCallback((api: EmblaCarouselType, eventName?: EmblaEventType) => {
        const engine = api.internalEngine();
        const progress = api.scrollProgress();
        const inView = api.slidesInView();
        const isScroll = eventName === "scroll";

        api.scrollSnapList().forEach((snap, snapIndex) => {
            engine.slideRegistry[snapIndex].forEach((slideIndex) => {
                if (isScroll && !inView.includes(slideIndex)) return;
                let diff = snap - progress;

                // Correct the distance for slides that the loop has moved to the other end
                if (engine.options.loop) {
                    engine.slideLooper.loopPoints.forEach((loopItem) => {
                        const target = loopItem.target();
                        if (slideIndex === loopItem.index && target !== 0) {
                            const sign = Math.sign(target);
                            if (sign === -1) diff = snap - (1 + progress);
                            if (sign === 1) diff = snap + (1 - progress);
                        }
                    });
                }

                const t = clamp01(1 - Math.abs(diff * factor.current)); // 1 = center, 0 = far away
                const node = nodes.current[slideIndex];
                if (!node) return;
                node.style.transform = `scale(${FOCUS.minScale + (1 - FOCUS.minScale) * t})`;
                node.style.opacity = String(FOCUS.minOpacity + (1 - FOCUS.minOpacity) * t);
            });
        });
    }, []);

    useEffect(() => {
        if (!emblaApi) return;
        setNodes(emblaApi);
        setFactor(emblaApi);
        applyFocus(emblaApi);
        emblaApi
            .on("reInit", setNodes)
            .on("reInit", setFactor)
            .on("reInit", applyFocus)
            .on("scroll", applyFocus)
            .on("slideFocus", applyFocus);
        return () => {
            emblaApi
                .off("reInit", setNodes)
                .off("reInit", setFactor)
                .off("reInit", applyFocus)
                .off("scroll", applyFocus)
                .off("slideFocus", applyFocus);
        };
    }, [emblaApi, setNodes, setFactor, applyFocus]);

    /* ---------- Scroll entrance (works inside the GHL iframe too) ---------- */
    useGSAP(
        () => {
            const root = rootRef.current;
            if (!root) return;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

            const q = gsap.utils.selector(root);
            gsap.set(q("[data-reveal]"), { autoAlpha: 0, y: 30 });

            const io = new IntersectionObserver(
                ([entry]) => {
                    if (!entry.isIntersecting) return;
                    io.disconnect();
                    gsap
                        .timeline({ defaults: { ease: "power3.out", duration: 0.9 } })
                        .to(q('[data-reveal="label"]'), { autoAlpha: 1, y: 0 }, 0)
                        .to(q('[data-reveal="heading"]'), { autoAlpha: 1, y: 0, duration: 1.1 }, 0.1)
                        .to(q('[data-reveal="card"]'), { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08 }, 0.35)
                        .to(q('[data-reveal="arrows"]'), { autoAlpha: 1, y: 0 }, 0.6);
                },
                { threshold: 0.2 }
            );
            io.observe(root);
            return () => io.disconnect();
        },
        { scope: rootRef }
    );

    return (
        <section
            ref={rootRef}
            id="team"
            className="relative w-full overflow-hidden px-5 py-[clamp(64px,8vw,120px)] text-white"
            style={{ background: "radial-gradient(ellipse 60% 45% at 50% 55%, rgba(255, 204, 0, 0.05), transparent 70%), #0a0a0a" }}
        >
            {/* Heading */}
            <div className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
                <span
                    data-reveal="label"
                    className="rounded-full border border-accent/70 px-5 py-2 text-[11px] font-normal tracking-[0.18em] text-white uppercase"
                >
                    {TEAM_COPY.label}
                </span>
                <h2
                    data-reveal="heading"
                    className="mt-6 text-[clamp(2.2rem,4.4vw,4rem)] leading-[1.08] font-normal tracking-[-0.02em]"
                >
                    {TEAM_COPY.heading}
                    <br />
                    {TEAM_COPY.headingLine2}{" "}
                    <span
                        className="animate-zx-shine bg-clip-text font-extrabold text-transparent"
                        style={{
                            backgroundImage: "linear-gradient(90deg, #ffcc00 0%, #ffdd65 25%, #fff3b0 50%, #ffdd65 75%, #ffcc00 100%)",
                            backgroundSize: "200% 100%",
                        }}
                    >
                        {TEAM_COPY.headingAccent}
                    </span>
                </h2>
                <p
                    data-reveal="heading"
                    className="mt-5 max-w-[40rem] text-[clamp(14px,1.15vw,17px)] leading-[1.65] text-balance text-white/75"
                >
                    {TEAM_COPY.text}
                </p>
            </div>

            {/* Slider with side arrows (arrows go below on mobile) */}
            <div className="mx-auto mt-[clamp(40px,5vw,64px)] flex max-w-[1500px] items-center gap-[clamp(12px,2vw,32px)] max-[767px]:flex-col">
                <div data-reveal="arrows" className="max-[767px]:hidden">
                    <Arrow dir="prev" onClick={prev} />
                </div>

                <div ref={emblaRef} className="-my-12 w-full cursor-grab overflow-hidden py-12 select-none active:cursor-grabbing">
                    <div className="-ml-[clamp(16px,1.6vw,24px)] flex touch-pan-y">
                        {TEAM.map((member) => (
                            <div
                                key={member.name}
                                className="min-w-0 shrink-0 grow-0 basis-full pl-[clamp(16px,1.6vw,24px)] min-[640px]:basis-1/2 min-[1024px]:basis-1/3"
                            >
                                {/* Center-focus layer (scaled/dimmed while sliding) */}
                                <div data-focus="" className="will-change-transform">
                                    <Card {...member} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div data-reveal="arrows" className="max-[767px]:hidden">
                    <Arrow dir="next" onClick={next} />
                </div>

                {/* Mobile arrows */}
                <div data-reveal="arrows" className="relative z-10 -mt-[72px] hidden w-full justify-between px-1 max-[767px]:flex">
                    <Arrow dir="prev" onClick={prev} />
                    <Arrow dir="next" onClick={next} />
                </div>
            </div>
        </section>
    );
}