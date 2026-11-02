"use client";

// Team carousel in a 3D overlapping "coverflow" layout, ZYREX dark + gold theme.
// Drag with the mouse or swipe on mobile, endless loop, pagination dots below.
// Cards are tall ovals. The center card is "active": photo in color, gold ring with a glow, name + role pills
// inside the card (same look as the old carousel). Side cards sit behind it, smaller, darker and in grayscale.
// Hover (mouse devices): a side card shows the same active look while the mouse is over it.
// Embla does the dragging, snapping, looping and auto-play on an invisible track; its live position
// places the real cards (transform + opacity only, no animated filters, so scrolling stays smooth).
// Scroll entrance: label, heading, cards and dots rise in when the section comes into view.
// Auto-play: next card every few seconds; pauses on mouse hover, while touching/dragging and when the section is off screen.

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaCarouselType } from "embla-carousel";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TEAM, TEAM_COPY } from "./data";
import OutlinePill from "@/components/ui/OutlinePill";

gsap.registerPlugin(useGSAP);


const AUTOPLAY_DELAY = 3000; // ms between cards

// Layout per card distance from the center: [center, first side card, second side card]
// Mobile: side cards tucked close, peeking in from the screen edges.
const FLOW_MOBILE = {
    x: [0, 0.62, 1.06], // sideways, × card width
    scale: [1, 0.82, 0.66],
    dim: [0, 0.42, 0.68], // darkness
};
// Desktop (768px+): spread wide, each side card only slightly behind its neighbour so most of the face shows.
const FLOW_DESKTOP = {
    x: [0, 0.72, 1.31],
    scale: [1, 0.8, 0.64],
    dim: [0, 0.34, 0.56],
};
const FADE_FROM = 2; // cards further than this fade out...
const FADE_TO = 2.7; // ...and are gone here

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);
// Value at a (possibly fractional) distance from the center
const flow = (values: number[], d: number) => {
    const i = Math.min(Math.floor(d), values.length - 2);
    return values[i] + (values[i + 1] - values[i]) * Math.min(d - i, 1);
};

// active = the card in the center of the slider; it looks the same as a hovered card
function Card({ name, role, photo, active, onPick }: { name: string; role: string; photo: string; active: boolean; onPick: () => void }) {
    return (
        <article
            data-reveal="card"
            data-active={active}
            onClick={onPick}
            className="group relative isolate mx-auto aspect-[41/58] w-full rounded-full p-0 transition-[padding,background-color] duration-500 hover:bg-white/[0.04] hover:p-[7%] data-[active=true]:bg-white/[0.04] data-[active=true]:p-[7%]"
        >
            {/* Soft gold glow behind the card (on hover and on the center card) */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-[6%] -z-10 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 group-data-[active=true]:opacity-100"
                style={{
                    background:
                        "radial-gradient(closest-side, rgba(255, 204, 0, 0.35), rgba(255, 204, 0, 0.12) 60%, transparent)",
                }}
            />
            {/* Gold ring */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 scale-95 rounded-full border-[1.5px] border-accent opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100 group-hover:shadow-[0_0_35px_rgba(255,204,0,0.35),inset_0_0_25px_rgba(255,204,0,0.12)] group-data-[active=true]:scale-100 group-data-[active=true]:opacity-100 group-data-[active=true]:shadow-[0_0_35px_rgba(255,204,0,0.35),inset_0_0_25px_rgba(255,204,0,0.12)]"
            />

            <div className="relative h-full w-full overflow-hidden rounded-full bg-[#141414]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={photo}
                    alt={name}
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0 group-data-[active=true]:scale-105 group-data-[active=true]:grayscale-0"
                />

                {/* Soft dark fade at the bottom */}
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.8))" }}
                />

                {/* Side cards: darker the further they are (set by the coverflow) */}
                <span data-dim="" aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full bg-black opacity-0 group-hover:!opacity-0" />

                {/* Name + role pills */}
                <div className="absolute inset-x-0 bottom-[9%] flex translate-y-3 flex-col items-center gap-1 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-data-[active=true]:translate-y-0 group-data-[active=true]:opacity-100">
                    <span
                        className="inline-flex h-[clamp(26px,2vw,30px)] w-fit items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-accent-light),var(--color-accent))] px-[clamp(12px,1vw,16px)] text-[clamp(10px,0.75vw,11px)] leading-none zx-medium tracking-[0.12em] whitespace-nowrap text-black uppercase shadow-[0_6px_18px_rgba(255,204,0,0.22)]" // same gold and text as the "Book a call" button
                    >
                        {name}
                    </span>
                    <OutlinePill size="sm" solid>
                        {role}
                    </OutlinePill>
                </div>
            </div>
        </article>
    );
}

export default function Team() {
    const rootRef = useRef<HTMLElement>(null);
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
        const FLOW = window.innerWidth >= 768 ? FLOW_DESKTOP : FLOW_MOBILE;

        slots.current.forEach((slot, i) => {
            const offset = ((i - position + count * 1.5) % count) - count / 2; // shortest way round the loop
            const d = Math.abs(offset);
            const x = Math.sign(offset) * flow(FLOW.x, d) * cardW;
            const fade = clamp01((FADE_TO - d) / (FADE_TO - FADE_FROM));

            slot.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0) scale(${flow(FLOW.scale, d).toFixed(4)})`;
            slot.style.opacity = fade.toFixed(3);
            slot.style.visibility = fade > 0 ? "visible" : "hidden";
            slot.style.zIndex = String(100 - Math.round(d * 10));

            const dim = slot.querySelector<HTMLElement>("[data-dim]");
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
                <span data-reveal="label">
                    <OutlinePill>{TEAM_COPY.label}</OutlinePill>
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
            <div className="relative mx-auto mt-[clamp(40px,3.6vw,56px)] mb-[clamp(8px,1vw,16px)] [--card-h:calc(var(--card-w)*58/41)] [--card-w:min(26vw,calc(var(--zx-vh,100svh)*0.44),640px)] max-[767px]:[--card-w:min(60vw,280px)]">
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
                            <Card {...member} active={i === selected} onPick={() => goTo(i)} />
                        </div>
                    ))}
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