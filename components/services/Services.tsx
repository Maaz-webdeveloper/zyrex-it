"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useParentScroll } from "@/components/embed/useParentScroll";
import { scrollParentTo } from "@/lib/embed";
import { SERVICES, SERVICES_COPY, type Service } from "./data";

const GOLD = "linear-gradient(135deg, #ffdd65, #ffcc00)";
const CARD_EDGE =
    "linear-gradient(140deg, rgba(255, 204, 0, 0.5), rgba(255, 255, 255, 0.08) 35%, rgba(255, 255, 255, 0.04) 70%, rgba(255, 204, 0, 0.25))";
const CARD_BG = "linear-gradient(160deg, rgba(24, 24, 24, 0.96), rgba(10, 10, 10, 0.96))";

// Fully left through the top of the screen / still entering at the bottom
const MOTION = {
    desktop: { rotate: -4, scale: 0.92, y: 48, blur: 6, dim: 0.55, enterY: 36 },
    mobile: { rotate: 0, scale: 0.96, y: 16, blur: 0, dim: 0.7, enterY: 20 },
};
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

function paint(el: HTMLElement, { exit, enter }: CardMotion, mobile: boolean) {
    const m = mobile ? MOTION.mobile : MOTION.desktop;
    const y = exit * m.y + (1 - enter) * m.enterY;
    el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) rotate(${(exit * m.rotate).toFixed(3)}deg) scale(${(1 - exit * (1 - m.scale)).toFixed(4)})`;
    el.style.opacity = ((1 - exit) * (ENTER_OPACITY + enter * (1 - ENTER_OPACITY))).toFixed(3);
    el.style.filter = exit > 0.002 ? `blur(${(exit * m.blur).toFixed(2)}px) brightness(${(1 - exit * (1 - m.dim)).toFixed(3)})` : "";
    // Keeps the scale from re-rendering the card every frame; only while it is moving
    el.style.willChange = exit > 0 || enter < 1 ? "transform, opacity, filter" : "";
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
    const n = (i: number) => String(i).padStart(2, "0");
    return (
        <article data-service-card="" className="origin-bottom rounded-[28px] p-px shadow-[0_30px_80px_rgba(0,0,0,0.55)]" style={{ background: CARD_EDGE }}>
            <div
                className="grid overflow-hidden rounded-[27px] md:grid-cols-[1fr_1.1fr]"
                style={{ background: CARD_BG }}
            >
                {/* Text */}
                <div className="order-2 flex flex-col justify-center p-[clamp(24px,3.2vw,56px)] md:order-1">
                    <span className="text-[13px] tracking-[0.12em] text-white/60">
                        <span className="text-accent">{n(index + 1)}</span> / {n(SERVICES.length)}
                    </span>
                    <span className="mt-3 block h-px w-10" style={{ background: GOLD }} />
                    <h3 className="mt-5 text-[clamp(28px,3vw,48px)] leading-[1.08] font-normal tracking-[-0.02em]">{service.title}</h3>

                    <ul className="mt-6 flex flex-wrap gap-2">
                        {service.tags.map((t) => (
                            <li
                                key={t}
                                className="rounded-full border border-accent/25 bg-accent/[0.06] px-3.5 py-1.5 text-[12.5px] text-white/80"
                            >
                                {t}
                            </li>
                        ))}
                    </ul>

                    <p className="mt-6 max-w-[34rem] text-[clamp(14px,1.05vw,16px)] leading-[1.7] text-white/65">{service.text}</p>

                    <a
                        href="#contact"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollParentTo("#contact");
                        }}
                        className="group/cta relative mt-8 inline-flex h-[46px] w-fit items-center rounded-full pr-[52px] pl-6 text-[12px] font-extrabold tracking-[0.12em] text-black uppercase transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,204,0,0.35)]"
                        style={{ background: GOLD }}
                    >
                        {service.cta}
                        <span className="absolute top-1/2 right-[5px] grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black text-accent transition-transform duration-300 group-hover/cta:translate-x-[3px]">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                        </span>
                    </a>
                </div>

                {/* Image */}
                <div className="relative order-1 aspect-[4/3] md:order-2 md:aspect-auto md:min-h-[clamp(420px,38vw,640px)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={service.image} alt="" loading="lazy" draggable={false} className="absolute inset-0 size-full object-cover" />
                    {/* Soft gold tint + fade toward the text side */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{
                            background:
                                "radial-gradient(circle at 70% 30%, rgba(255, 204, 0, 0.18), transparent 55%), linear-gradient(to right, rgba(10, 10, 10, 0.6), transparent 35%)",
                        }}
                    />
                </div>
            </div>
        </article>
    );
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
                    paint(el, target, phone.matches);
                    return;
                }
                if (now.exit === target.exit && now.enter === target.enter) return;
                now.exit += (target.exit - now.exit) * k;
                now.enter += (target.enter - now.enter) * k;
                if (Math.abs(target.exit - now.exit) < 0.001) now.exit = target.exit;
                if (Math.abs(target.enter - now.enter) < 0.001) now.enter = target.enter;
                paint(el, now, phone.matches);
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
        <section ref={rootRef} className="relative w-full overflow-hidden bg-[#0a0a0a] px-5 py-[clamp(72px,9vw,140px)] text-white">
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

                {/* Cards */}
                <div className="mt-[clamp(48px,6vw,96px)] flex flex-col gap-[clamp(24px,3vw,48px)]">
                    {SERVICES.map((s, i) => (
                        <ServiceCard key={s.title} service={s} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}