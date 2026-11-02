"use client";

// Services page hero: heading (same pattern as Team) + "expanding cards".
// Desktop: one wide open card, the others are narrow vertical strips. Mobile: stacked, the open card is tall,
// the others are short bars.
//
// Changing card (hover / tap / autoplay), in 3 steps so text never squashes:
//   1. the open card's content fades out (FADE)
//   2. the widths (desktop) / heights (mobile) animate (SIZE)
//   3. the new card's content fades in
// The open content is laid out at the final open size (fixed width/height box, clipped by the card),
// so even mid-animation it can't wrap or squash.
// Autoplay: next card every AUTOPLAY ms, paused while the mouse is over the cards and while off screen.
// Reduced motion: no size animation, the card just switches.

import { useCallback, useEffect, useRef, useState } from "react";
import { scrollParentTo } from "@/lib/embed";
import { CORE_SERVICES, ServiceIcon } from "@/components/services/core";
import GoldButton from "@/components/ui/GoldButton";
import OutlinePill from "@/components/ui/OutlinePill";
import { SERVICES_HERO_COPY as COPY } from "./data";

const FADE = 220; // ms
const SIZE = 700; // ms
const AUTOPLAY = 5000; // ms

const EASE = "ease-[cubic-bezier(0.76,0,0.24,1)]";
const GOLD = "linear-gradient(135deg, #ffdd65, #ffcc00)";
const SHINE = "linear-gradient(90deg, #ffcc00 0%, #ffdd65 25%, #fff3b0 50%, #ffdd65 75%, #ffcc00 100%)";
const GLASS = "linear-gradient(160deg, rgba(30, 27, 18, 0.92), rgba(10, 10, 10, 0.96))";
const IMAGE_SHADE =
    "linear-gradient(to top, rgba(5, 5, 5, 0.94) 0%, rgba(5, 5, 5, 0.7) 40%, rgba(5, 5, 5, 0.35) 100%), radial-gradient(circle at 85% 10%, rgba(255, 204, 0, 0.16), transparent 50%)";

// Garet has only 400/800: the same thin stroke the gold heading words use, here in the text color,
// so the white words and card titles have the same weight as the gold ones
const HEADING_STROKE = "0.024em currentColor";

const num = (i: number) => String(i + 1).padStart(2, "0");

export default function ServicesHero() {
    const [open, setOpen] = useState(0); // card that is wide (desktop) / tall (mobile)
    const [shown, setShown] = useState<number | null>(0); // card whose content is visible
    const [closing, setClosing] = useState<number | null>(null); // card shrinking right now (its strip label waits)
    const [target, setTarget] = useState(0); // last requested card (drives the autoplay timer)
    const [paused, setPaused] = useState(false); // mouse over the cards
    const [visible, setVisible] = useState(false); // section on screen

    const targetRef = useRef(0);
    const openRef = useRef(0);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
    const reduce = useRef(false);
    const rowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const list = timers.current;
        return () => list.forEach(clearTimeout);
    }, []);

    const go = useCallback((j: number) => {
        if (j === targetRef.current) return;
        targetRef.current = j;
        setTarget(j);
        timers.current.forEach(clearTimeout);
        timers.current = [];

        if (reduce.current) {
            openRef.current = j;
            setOpen(j);
            setShown(j);
            setClosing(null);
            return;
        }

        setShown(null); // 1. fade the content out
        timers.current.push(
            setTimeout(() => {
                setClosing(openRef.current === j ? null : openRef.current);
                openRef.current = j;
                setOpen(j); // 2. resize
            }, FADE),
            setTimeout(() => {
                setClosing(null);
                setShown(j); // 3. fade the new content in
            }, FADE + SIZE)
        );
    }, []);

    // Autoplay: restarts after every change, waits while paused or off screen
    useEffect(() => {
        if (paused || !visible) return;
        const t = setTimeout(() => go((target + 1) % CORE_SERVICES.length), AUTOPLAY);
        return () => clearTimeout(t);
    }, [paused, visible, target, go]);

    // Off screen: no autoplay
    useEffect(() => {
        const row = rowRef.current;
        if (!row) return;
        const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
        io.observe(row);
        return () => io.disconnect();
    }, []);

    const onMouse = (over: boolean) => (e: React.PointerEvent) => {
        if (e.pointerType === "mouse") setPaused(over);
    };

    return (
        <section className="relative w-full overflow-hidden bg-[#0a0a0a] px-5 pt-[clamp(72px,9vw,140px)] pb-[clamp(64px,8vw,120px)] text-white">
            {/* Heading: same pattern as Team (pill, heading with gold shine accent, paragraph) */}
            <div className="mx-auto flex max-w-[72rem] flex-col items-center text-center">
                <OutlinePill>{COPY.label}</OutlinePill>
                <h1
                    className="mt-6 text-[clamp(2.2rem,3.6vw,4rem)] leading-[1.08] font-normal tracking-[-0.02em] max-[480px]:text-[length:calc((100vw-40px)*0.082)] min-[900px]:whitespace-nowrap"
                    style={{ WebkitTextStroke: HEADING_STROKE }}
                >
                    {COPY.heading}{" "}
                    <br className="min-[900px]:hidden" />
                    <span
                        className="animate-zx-shine bg-clip-text font-normal text-transparent"
                        style={{
                            backgroundImage: SHINE,
                            backgroundSize: "200% 100%",
                            WebkitTextStroke: "0.024em transparent", // Garet has no 500/600: this thickens the letters; bg-clip-text fills the stroke with the gold shine, so no outline
                        }}
                    >
                        {COPY.headingAccent}
                    </span>
                </h1>
                <p className="mt-5 max-w-[46rem] text-[clamp(14px,1.15vw,17px)] leading-[1.65] text-balance text-white/75">{COPY.text}</p>
            </div>

            {/* Cards. @container: the open content box is sized from the row width (cqw), not from the card */}
            <div
                ref={rowRef}
                onPointerEnter={onMouse(true)}
                onPointerLeave={onMouse(false)}
                className="@container mx-auto mt-[clamp(40px,3.6vw,56px)] flex w-full max-w-[80rem] flex-col gap-3 [--gap:12px] [--strip:clamp(72px,6vw,104px)] md:h-[clamp(440px,calc(var(--zx-vh,100svh)*0.64),640px)] md:flex-row"
            >
                {CORE_SERVICES.map((s, i) => {
                    const isOpen = i === open;
                    const isShown = i === shown;
                    const showLabel = !isOpen && i !== closing;
                    return (
                        <div
                            key={s.name}
                            className={`group relative shrink-0 overflow-hidden rounded-[24px] border transition-[flex-grow,height,border-color,box-shadow] ${EASE} motion-reduce:transition-none md:h-auto md:basis-(--strip) ${
                                isOpen
                                    ? "h-[480px] border-accent/25 md:grow"
                                    : "h-16 border-accent/15 hover:border-accent/45 hover:shadow-[0_0_32px_rgba(255,204,0,0.18)] md:grow-0"
                            }`}
                            style={{ background: GLASS, transitionDuration: `${SIZE}ms` }}
                        >
                            {/* Open card: image + content in a box at the final open size (never squashes) */}
                            <div className="absolute top-0 left-0 h-[480px] w-full md:h-full md:w-[calc(100cqw_-_(var(--strip)_+_var(--gap))_*_3)]">
                                {/* Image crossfades with the resize (same time and easing): the shrinking card fades to
                                    glass while the opening one fades in, so no card is ever an empty box. A strip only
                                    gets its image once it starts opening. */}
                                <div
                                    aria-hidden="true"
                                    className={`absolute inset-0 transition-opacity ${EASE} motion-reduce:transition-none ${isOpen ? "opacity-100" : "opacity-0"}`}
                                    style={{ transitionDuration: `${SIZE}ms` }}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={s.image}
                                        alt=""
                                        loading={i === 0 ? "eager" : "lazy"}
                                        decoding="async"
                                        draggable={false}
                                        className="absolute inset-0 size-full object-cover"
                                    />
                                    <div className="absolute inset-0" style={{ background: IMAGE_SHADE }} />
                                </div>

                                <div
                                    inert={!isShown}
                                    className={`absolute inset-0 flex flex-col p-[clamp(22px,2.6vw,44px)] transition-opacity ${
                                        isShown ? "opacity-100" : "pointer-events-none opacity-0"
                                    }`}
                                    style={{ transitionDuration: `${isShown ? 350 : FADE}ms` }}
                                >
                                    {/* Big faint number */}
                                    <span
                                        aria-hidden="true"
                                        className="absolute top-[clamp(14px,1.6vw,26px)] right-[clamp(20px,2.4vw,40px)] text-[clamp(72px,8vw,140px)] leading-none font-normal tracking-[-0.04em] text-white/[0.07]"
                                    >
                                        {num(i)}
                                    </span>
                                    {/* Status pill: top-left corner, on its own */}
                                    <OutlinePill size="sm" solid className="relative gap-2 self-start">
                                        <span aria-hidden="true" className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(255,204,0,0.8)]" />
                                        Service {num(i)} / {num(CORE_SERVICES.length - 1)}
                                    </OutlinePill>

                                    {/* Icon, title, text and buttons sit at the bottom, with at least 24px below the pill */}
                                    <span aria-hidden="true" className="min-h-6 grow" />
                                    <span
                                        className="grid size-[clamp(44px,3.4vw,56px)] shrink-0 place-items-center rounded-[14px] text-black shadow-[0_10px_30px_rgba(255,204,0,0.3)]"
                                        style={{ background: GOLD }}
                                    >
                                        <ServiceIcon paths={s.icon} size={24} />
                                    </span>
                                    <h2
                                        className="mt-5 text-[clamp(26px,2.6vw,44px)] leading-[1.08] font-normal tracking-[-0.02em] md:whitespace-nowrap"
                                        style={{ WebkitTextStroke: HEADING_STROKE }}
                                    >
                                        {s.name}
                                    </h2>
                                    <p className="mt-3 max-w-[34rem] text-[clamp(14px,1.05vw,16px)] leading-[1.65] text-white/70">{s.description}</p>
                                    <div className="mt-6 flex flex-wrap items-center gap-3">
                                        <GoldButton href={COPY.explore.href}>{COPY.explore.label}</GoldButton>
                                        <a
                                            href={COPY.call.href}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                scrollParentTo(COPY.call.href);
                                            }}
                                            className="rounded-full transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(255,204,0,0.3)]"
                                        >
                                            <OutlinePill solid className="h-[42px] px-6">
                                                {COPY.call.label}
                                            </OutlinePill>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Closed card: number + name (vertical on desktop), in a box at the closed size */}
                            <div
                                aria-hidden="true"
                                className={`pointer-events-none absolute top-0 left-0 flex h-16 w-full items-center gap-4 px-5 transition-opacity duration-300 md:h-full md:w-(--strip) md:flex-col md:gap-6 md:px-0 md:py-7 ${
                                    showLabel ? "opacity-100" : "opacity-0"
                                }`}
                            >
                                <span className="text-[13px] tracking-[0.12em] text-accent">{num(i)}</span>
                                {/* Desktop: name centered in the strip (number stays at the top) */}
                                <span className="text-[15px] whitespace-nowrap text-white/80 transition-colors duration-300 group-hover:text-white md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:rotate-180 md:text-[clamp(15px,1.2vw,18px)] md:[writing-mode:vertical-rl]">
                                    {s.name}
                                </span>
                            </div>

                            {/* Closed card: the whole card opens it (hover with a mouse, tap, or keyboard) */}
                            {!isOpen && (
                                <button
                                    type="button"
                                    aria-label={`Show ${s.name}`}
                                    onClick={() => go(i)}
                                    onPointerEnter={(e) => e.pointerType === "mouse" && go(i)}
                                    className="absolute inset-0 cursor-pointer rounded-[24px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
