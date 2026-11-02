"use client";

// Mobile Services slider, same approach as the Team carousel: swipe, endless loop, gold dots below.
// One card at a time with a small peek of the next one. All cards have the same height.
// Auto-play: next card every few seconds; pauses while touching and when the section is off screen.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import ServiceCard from "./ServiceCard";
import { SERVICES } from "./data";

const AUTOPLAY_DELAY = 4500; // ms between cards
const SIDE = 20; // px, same as the section's side padding: the first card lines up with the heading

export default function ServicesSlider() {
    const rootRef = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState(0);
    const reduce = useRef(false);

    // Started/stopped by the effect below (touch, visibility), not by the plugin itself
    const plugins = useMemo(() => [Autoplay({ delay: AUTOPLAY_DELAY, playOnInit: false, stopOnInteraction: false })], []);
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: () => SIDE },
        plugins
    );

    // Dot tap: go to that card, then restart the timer so the next card does not follow right away
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

    /* ---------- Auto-play: pause while touching and when the section is off screen ---------- */
    useEffect(() => {
        const root = rootRef.current;
        const autoplay = emblaApi?.plugins().autoplay;
        if (!root || !emblaApi || !autoplay) return;
        reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduce.current) return;

        let visible = false;
        let touching = false;

        const sync = () => {
            if (visible && !touching) autoplay.play();
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

        emblaApi.on("pointerDown", onDown).on("pointerUp", onUp);

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
            emblaApi.off("pointerDown", onDown).off("pointerUp", onUp);
            autoplay.stop();
        };
    }, [emblaApi]);

    return (
        <div ref={rootRef} className="mt-[clamp(28px,2.6vw,40px)] md:hidden">
            {/* Runs to both screen edges, so the next card can peek in on the right */}
            <div ref={emblaRef} className="-mx-5 overflow-hidden select-none">
                <div className="flex touch-pan-y">
                    {SERVICES.map((s, i) => (
                        <div key={s.title} className="min-w-0 shrink-0 grow-0 basis-[calc(100%-40px)] pr-5">
                            <ServiceCard service={s} index={i} slide />
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination dots: the current card's dot is a wide gold pill */}
            <div className="mt-[clamp(16px,2vw,28px)] flex items-center justify-center">
                {SERVICES.map((s, i) => (
                    <button
                        key={s.title}
                        type="button"
                        onClick={() => goTo(i)}
                        aria-label={`Go to ${s.title}`}
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
        </div>
    );
}
