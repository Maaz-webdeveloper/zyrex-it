"use client";

// Team carousel in a 3D overlapping "coverflow" layout, ZYREX dark + gold theme.
// Drag with the mouse or swipe on mobile, endless loop, pagination dots below.
// The center card is big and in color with a gold ring; side cards sit behind it, smaller, darker and in grayscale.
// Name + role pills sit under the center card. Hover (mouse devices): a side card shows its color.
// Embla does the dragging, snapping, looping and auto-play on an invisible track; its live position
// places the real cards (transform + opacity only, no animated filters, so scrolling stays smooth).
// Scroll entrance: label, heading, cards, pills and dots rise in when the section comes into view.
// Auto-play: next card every few seconds; pauses on mouse hover, while touching/dragging and when the section is off screen.

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaCarouselType } from "embla-carousel";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TEAM, TEAM_COPY } from "./data";

gsap.registerPlugin(useGSAP);

const GOLD = "linear-gradient(135deg, #ffdd65, #ffcc00)";

const AUTOPLAY_DELAY = 3000; // ms between cards

// Layout per card distance from the center: [center, first side card, second side card]
const FLOW = {
    x: [0, 0.62, 1.06], // sideways, × card width
    scale: [1, 0.82, 0.66],
    dim: [0, 0.42, 0.68], // darkness
};
const FADE_FROM = 2; // cards further than this fade out...
const FADE_TO = 2.7; // ...and are gone here

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);
// Value at a (possibly fractional) distance from the center
const flow = (values: number[], d: number) => {
    const i = Math.min(Math.floor(d), values.length - 2);
    return values[i] + (values[i + 1] - values[i]) * Math.min(d - i, 1);
};

function Card({ name, photo, onPick }: { name: string; photo: string; onPick: () => void }) {
    return (
        <article
            data-reveal="card"
            onClick={onPick}
            aria-label={name}
            className="group relative h-full w-full overflow-hidden rounded-[28px] bg-[#141414] shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
        >
            {/* Grayscale photo, the color copy fades in on top: cheaper than animating a filter */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt={name} loading="lazy" draggable={false} className="absolute inset-0 size-full object-cover grayscale" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                data-color=""
                src={photo}
                alt=""
                aria-hidden="true"
                loading="lazy"
                draggable={false}
                className="absolute inset-0 size-full object-cover opacity-0 group-hover:!opacity-100"
            />
            {/* Soft dark fade at the bottom */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: "linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.55))" }}
            />
            {/* Side cards: darker the further they are */}
            <span data-dim="" aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black opacity-0 group-hover:!opacity-0" />
            {/* Gold ring on the center card */}
            <span
                data-ring=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[28px] border-[1.5px] border-accent opacity-0 shadow-[inset_0_0_25px_rgba(255,204,0,0.14)]"
            />
        </article>
    );
}

export default function Team() {
    const rootRef = useRef<HTMLElement>(null);
    const pillsRef = useRef<HTMLDivElement>(null);
    const reduce = useRef(false);
    const [selected, setSelected] = useState(0); // card in the center (the "active" one)
    // Started/stopped by the effect below (hover, drag, visibility), not by the plugin itself
    const plugins = useMemo(
        () => [Autoplay({ delay: AUTOPLAY_DELAY, playOnInit: false, stopOnInteraction: false })],
        []
    );
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" }, plugins);
    // Dot or side card click: go to that card, then restart the timer so the next card does not follow right away
    const goTo = useCallback(
        (index: number) => {
            emblaApi?.scrollTo(index, reduce.current);
            emblaApi?.plugins().autoplay?.reset();
        },
        [emblaApi]
    );

    useEffect(() => {
        if (!emblaApi) return;
        const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
        onSelect();
        emblaApi.on("select", onSelect).on("reInit", onSelect);
        return () => {
            emblaApi.off("select", onSelect).off("reInit", onSelect);
        };
    }, [emblaApi]);

    /* ---------- Coverflow: Embla's live position places the cards ---------- */
    const slots = useRef<HTMLElement[]>([]);

    const place = useCallback((api: EmblaCarouselType) => {
        const count = TEAM.length;
        const position = api.scrollProgress() * count;
        const cardW = slots.current[0]?.offsetWidth ?? 0;

        slots.current.forEach((slot, i) => {
            const offset = ((i - position + count * 1.5) % count) - count / 2; // shortest way round the loop
            const d = Math.abs(offset);
            const x = Math.sign(offset) * flow(FLOW.x, d) * cardW;
            const fade = clamp01((FADE_TO - d) / (FADE_TO - FADE_FROM));

            slot.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0) scale(${flow(FLOW.scale, d).toFixed(4)})`;
            slot.style.opacity = fade.toFixed(3);
            slot.style.visibility = fade > 0 ? "visible" : "hidden";
            slot.style.zIndex = String(100 - Math.round(d * 10));

            const color = slot.querySelector<HTMLElement>("[data-color]");
            const dim = slot.querySelector<HTMLElement>("[data-dim]");
            const ring = slot.querySelector<HTMLElement>("[data-ring]");
            const active = clamp01(1 - d).toFixed(3);
            if (color) color.style.opacity = active;
            if (ring) ring.style.opacity = active;
            if (dim) dim.style.opacity = flow(FLOW.dim, d).toFixed(3);
        });
    }, []);

    useLayoutEffect(() => {
        if (!emblaApi) return;
        reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        place(emblaApi);
        emblaApi.on("scroll", place).on("reInit", place).on("select", place).on("settle", place);
        return () => {
            emblaApi.off("scroll", place).off("reInit", place).off("select", place).off("settle", place);
        };
    }, [emblaApi, place]);

    // The pills change with the center card
    useEffect(() => {
        const el = pillsRef.current;
        if (!el || reduce.current) return;
        const tween = gsap.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" });
        return () => {
            tween.kill();
        };
    }, [selected]);

    /* ---------- Auto-play: pause on mouse hover, while dragging and when the section is off screen ---------- */
    useEffect(() => {
        const root = rootRef.current;
        const autoplay = emblaApi?.plugins().autoplay;
        if (!root || !emblaApi || !autoplay) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const viewport = emblaApi.rootNode();
        let visible = false;
        let hovering = false;
        let touching = false;

        const sync = () => {
            if (visible && !hovering && !touching) autoplay.play();
            else autoplay.stop();
        };
        const onDown = () => {
            touching = true;
            sync();
        };
        const onUp = () => {
            touching = false;
            sync();
        };

        const onEnter = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            hovering = true;
            sync();
        };
        const onLeave = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            hovering = false;
            // If the mouse leaves while dragging, wait for the release
            if (!emblaApi.internalEngine().dragHandler.pointerDown()) sync();
        };

        viewport.addEventListener("pointerenter", onEnter);
        viewport.addEventListener("pointerleave", onLeave);
        emblaApi.on("pointerDown", onDown).on("pointerUp", onUp); // the plugin restarts after a drag; keep it paused if the mouse is still over

        const io = new IntersectionObserver(
            ([entry]) => {
                visible = entry.isIntersecting;
                sync();
            },
            { threshold: 0.2 }
        );
        io.observe(root);

        return () => {
            io.disconnect();
            viewport.removeEventListener("pointerenter", onEnter);
            viewport.removeEventListener("pointerleave", onLeave);
            emblaApi.off("pointerDown", onDown).off("pointerUp", onUp);
            autoplay.stop();
        };
    }, [emblaApi]);

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
                        .to(q('[data-reveal="pills"]'), { autoAlpha: 1, y: 0 }, 0.55)
                        .to(q('[data-reveal="dots"]'), { autoAlpha: 1, y: 0 }, 0.6);
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
            className="group/team relative w-full overflow-hidden px-5 pt-[clamp(56px,4.5vw,72px)] pb-[clamp(64px,8vw,120px)] text-white"
            style={{ background: "radial-gradient(ellipse 60% 45% at 50% 55%, rgba(255, 204, 0, 0.05), transparent 70%), #0a0a0a" }}
        >
            {/* Heading */}
            <div className="mx-auto flex max-w-[72rem] flex-col items-center text-center">
                <span
                    data-reveal="label"
                    className="rounded-full border border-accent/70 px-5 py-2 text-[11px] font-normal tracking-[0.18em] text-white uppercase"
                >
                    {TEAM_COPY.label}
                </span>
                <h2
                    data-reveal="heading"
                    className="mt-6 text-[clamp(2.2rem,3.6vw,4rem)] leading-[1.08] font-normal tracking-[-0.02em] min-[900px]:whitespace-nowrap"
                >
                    {TEAM_COPY.heading}{" "}
                    <br className="min-[900px]:hidden" />
                    {TEAM_COPY.headingLine2}{" "}
                    <span
                        className="animate-zx-shine bg-clip-text font-normal text-transparent"
                        style={{
                            backgroundImage: "linear-gradient(90deg, #ffcc00 0%, #ffdd65 25%, #fff3b0 50%, #ffdd65 75%, #ffcc00 100%)",
                            backgroundSize: "200% 100%",
                            WebkitTextStroke: "0.024em transparent", // Garet has no 500/600: this thickens the letters; bg-clip-text fills the stroke with the gold shine, so no outline
                        }}
                    >
                        {TEAM_COPY.headingAccent}
                    </span>
                </h2>
                <p
                    data-reveal="heading"
                    className="mt-5 max-w-[46rem] text-[clamp(14px,1.15vw,17px)] leading-[1.65] text-balance text-white/75"
                >
                    {TEAM_COPY.text}
                </p>
            </div>

            {/* Carousel. Embla's track is invisible; the stage on top of it shows the cards. */}
            <div className="relative mx-auto mt-[clamp(32px,3vw,48px)] [--card-h:calc(var(--card-w)*1.3)] [--card-w:min(clamp(230px,23vw,380px),calc(var(--zx-vh,100svh)*0.46))] max-[767px]:[--card-w:min(62vw,290px)]">
                {/* Soft gold glow behind the center card */}
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-1/2 h-[calc(var(--card-h)*1.25)] w-[calc(var(--card-w)*1.5)] -translate-x-1/2 -translate-y-1/2"
                    style={{ background: "radial-gradient(closest-side, rgba(255, 204, 0, 0.24), rgba(255, 204, 0, 0.08) 60%, transparent)" }}
                />
                <div ref={emblaRef} className="relative mx-auto h-(--card-h) w-(--card-w) cursor-grab touch-pan-y select-none active:cursor-grabbing">
                    <div aria-hidden="true" className="flex h-full">
                        {TEAM.map((member) => (
                            <div key={member.name} className="min-w-0 shrink-0 grow-0 basis-full" />
                        ))}
                    </div>
                    {TEAM.map((member, i) => (
                        <div
                            key={member.name}
                            ref={(el) => {
                                if (el) slots.current[i] = el;
                            }}
                            className="absolute inset-0 will-change-transform"
                        >
                            <Card name={member.name} photo={member.photo} onPick={() => goTo(i)} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Name + role of the center card */}
            <div data-reveal="pills" className="relative mt-[clamp(16px,1.6vw,24px)] flex h-[clamp(58px,4.2vw,66px)] justify-center">
                <div ref={pillsRef} className="flex flex-col items-center gap-1">
                    <span
                        className="inline-flex h-[clamp(27px,2vw,31px)] w-fit items-center justify-center rounded-full px-[clamp(14px,1.1vw,18px)] text-[clamp(11px,0.8vw,12.5px)] font-normal tracking-[0.08em] whitespace-nowrap text-black uppercase shadow-[0_6px_18px_rgba(255,204,0,0.22)]"
                        style={{ background: GOLD, WebkitTextStroke: "0.012em currentColor" }} // Garet has no 500/600: faint stroke keeps the 400 text legible on gold
                    >
                        {TEAM[selected].name}
                    </span>
                    <span
                        className="inline-flex h-[clamp(24px,1.75vw,27px)] w-fit items-center justify-center rounded-full px-[clamp(12px,0.95vw,15px)] text-[clamp(9px,0.62vw,10px)] font-normal tracking-[0.12em] whitespace-nowrap text-[#f9f3f3] uppercase"
                        style={{
                            border: "1px solid transparent",
                            background:
                                "linear-gradient(#0d0d0d, #0d0d0d) padding-box, linear-gradient(135deg, #ffdd65, rgba(255, 204, 0, 0.25), #ffcc00) border-box",
                        }}
                    >
                        {TEAM[selected].role}
                    </span>
                </div>
            </div>

            {/* Pagination dots: the center card's dot is a wide gold pill */}
            <div data-reveal="dots" className="mx-auto mt-[clamp(16px,2vw,28px)] flex items-center justify-center">
                {TEAM.map((member, i) => (
                    <button
                        key={member.name}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Go to ${member.name}`}
                        aria-current={i === selected}
                        className="group/dot flex h-6 cursor-pointer items-center px-[5px]"
                    >
                        <span
                            className={`relative block h-2 rounded-full bg-white/20 transition-[width,background-color] duration-300 group-hover/dot:bg-white/40 ${i === selected ? "w-7" : "w-2"}`}
                        >
                            <span
                                aria-hidden="true"
                                className={`absolute inset-0 rounded-full transition-opacity duration-300 ${i === selected ? "opacity-100" : "opacity-0"}`}
                                style={{
                                    background: "linear-gradient(90deg, #ffcc00, #ffdd65)",
                                    boxShadow: "0 0 10px rgba(255, 204, 0, 0.6)",
                                }}
                            />
                        </span>
                    </button>
                ))}
            </div>
        </section>
    );
}