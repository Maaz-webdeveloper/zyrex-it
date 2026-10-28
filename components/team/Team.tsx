"use client";

// Team slider ("Meet Our Awesome People" style), ZYREX dark + gold theme.
// Drag with the mouse or swipe on mobile, endless loop, pagination dots below.
// Center focus: the middle card is full size and bright, side cards are smaller and dimmer.
// The center card is always "active": photo in color, gold ring, name + role pills (same look as hover).
// Hover (mouse devices): a side card shows the same active look while the mouse is over it.
// Scroll entrance: label, heading, cards and dots rise in when the section comes into view.
// Auto-play: next card every few seconds; pauses on mouse hover, while dragging and when the section is off screen.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaCarouselType, EmblaEventType } from "embla-carousel";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TEAM, TEAM_COPY } from "./data";

gsap.registerPlugin(useGSAP);

const GOLD = "linear-gradient(135deg, #ffdd65, #ffcc00)";

const AUTOPLAY_DELAY = 3000; // ms between cards

// Center focus settings
const FOCUS = {
    minScale: 0.86, // size of the side cards
    minOpacity: 0.45, // brightness of the side cards
    strength: 0.52, // how fast cards shrink away from the center (Embla example value)
};

const clamp01 = (n: number) => Math.min(Math.max(n, 0), 1);

// active = the card in the center of the slider; it looks the same as a hovered card
function Card({ name, role, photo, active }: { name: string; role: string; photo: string; active: boolean }) {
    return (
        <article
            data-reveal="card"
            data-active={active}
            className="group relative isolate mx-auto aspect-[41/58] w-full max-w-[410px] rounded-full p-0 transition-[padding,background-color] duration-500 hover:bg-white/[0.04] hover:p-[7%] data-[active=true]:bg-white/[0.04] data-[active=true]:p-[7%]"
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

                {/* Name + role pills */}
                <div className="absolute inset-x-0 bottom-[14%] flex translate-y-3 flex-col items-center gap-1.5 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-data-[active=true]:translate-y-0 group-data-[active=true]:opacity-100">
                    <span
                        className="rounded-full px-[clamp(18px,1.8vw,28px)] py-[clamp(8px,0.8vw,12px)] text-[clamp(14px,1.15vw,18px)] font-extrabold whitespace-nowrap text-black uppercase shadow-[0_10px_30px_rgba(255,204,0,0.3)]"
                        style={{ background: GOLD }}
                    >
                        {name}
                    </span>
                    <span
                        className="inline-flex h-[36px] w-fit items-center justify-center rounded-full px-6 text-[clamp(10px,0.8vw,12px)] font-extrabold tracking-[0.14em] whitespace-nowrap text-[#f9f3f3] uppercase"
                        style={{
                            border: "1px solid transparent",
                            background:
                                "linear-gradient(#0d0d0d, #0d0d0d) padding-box, linear-gradient(135deg, #ffdd65, rgba(255, 204, 0, 0.25), #ffcc00) border-box",
                        }}
                    >
                        {role}
                    </span>
                </div>
            </div>
        </article>
    );
}

export default function Team() {
    const rootRef = useRef<HTMLElement>(null);
    const [selected, setSelected] = useState(0); // card in the center (the "active" one)
    // Started/stopped by the effect below (hover, drag, visibility), not by the plugin itself
    const plugins = useMemo(
        () => [Autoplay({ delay: AUTOPLAY_DELAY, playOnInit: false, stopOnInteraction: false })],
        []
    );
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" }, plugins);
    // Dot click: go to that card, then restart the timer so the next card does not follow right away
    const goTo = useCallback(
        (index: number) => {
            emblaApi?.scrollTo(index);
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

    /* ---------- Auto-play: pause on mouse hover, while dragging and when the section is off screen ---------- */
    useEffect(() => {
        const root = rootRef.current;
        const autoplay = emblaApi?.plugins().autoplay;
        if (!root || !emblaApi || !autoplay) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const viewport = emblaApi.rootNode();
        let visible = false;
        let hovering = false;

        const sync = () => {
            if (visible && !hovering) autoplay.play();
            else autoplay.stop();
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
        emblaApi.on("pointerUp", sync); // the plugin restarts after a drag; keep it paused if the mouse is still over

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
            emblaApi.off("pointerUp", sync);
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
            className="group/team relative w-full overflow-hidden px-5 py-[clamp(64px,8vw,120px)] text-white"
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

            {/* Slider */}
            <div className="mx-auto mt-[clamp(40px,5vw,64px)] max-w-[1500px]">
                <div ref={emblaRef} className="-my-12 w-full cursor-grab overflow-hidden py-12 select-none active:cursor-grabbing">
                    <div className="-ml-[clamp(16px,1.6vw,24px)] flex touch-pan-y">
                        {TEAM.map((member, i) => (
                            <div
                                key={member.name}
                                className="min-w-0 shrink-0 grow-0 basis-full pl-[clamp(16px,1.6vw,24px)] min-[640px]:basis-1/2 min-[1024px]:basis-1/3"
                            >
                                {/* Center-focus layer (scaled/dimmed while sliding) */}
                                <div data-focus="" className="will-change-transform">
                                    <Card {...member} active={i === selected} />
                                </div>
                            </div>
                        ))}
                    </div>
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