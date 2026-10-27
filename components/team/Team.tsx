"use client";

// Team slider ("Meet Our Awesome People" style), ZYREX dark + gold theme.
// Drag with the mouse or swipe on mobile, arrows on the sides, endless loop.
// Hover (mouse devices): photo turns to color, gold ring appears, name + role pills rise.
// Touch devices: names and colors are always visible (there is no hover).

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { TEAM, TEAM_COPY } from "./data";

const GOLD = "linear-gradient(135deg, #ffdd65, #ffcc00)";

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
        <article className="group relative mx-auto aspect-[41/58] w-full max-w-[410px] rounded-full p-0 transition-[padding,background-color] duration-500 hover:bg-white/[0.04] hover:p-[7%] [@media(hover:none)]:bg-white/[0.04] [@media(hover:none)]:p-[5%]">
            {/* Gold ring */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 scale-95 rounded-full border-[1.5px] border-accent opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100 [@media(hover:none)]:scale-100 [@media(hover:none)]:opacity-100"
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
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
    const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    return (
        <section
            id="team"
            className="relative w-full overflow-hidden px-5 py-[clamp(64px,8vw,120px)] text-white"
            style={{ background: "radial-gradient(ellipse 60% 45% at 50% 55%, rgba(255, 204, 0, 0.05), transparent 70%), #0a0a0a" }}
        >
            {/* Heading */}
            <div className="mx-auto flex max-w-[52rem] flex-col items-center text-center">
                <span className="rounded-full border border-accent/70 px-5 py-2 text-[11px] font-extrabold tracking-[0.18em] text-white uppercase">
                    {TEAM_COPY.label}
                </span>
                <h2 className="mt-6 text-[clamp(2.2rem,4.4vw,4rem)] leading-[1.08] font-extrabold tracking-[-0.01em]">
                    {TEAM_COPY.heading}
                    <br />
                    {TEAM_COPY.headingLine2} <span className="text-accent">{TEAM_COPY.headingAccent}</span>
                </h2>
            </div>

            {/* Slider with side arrows (arrows go below on mobile) */}
            <div className="mx-auto mt-[clamp(40px,5vw,64px)] flex max-w-[1500px] items-center gap-[clamp(12px,2vw,32px)] max-[767px]:flex-col">
                <div className="max-[767px]:hidden">
                    <Arrow dir="prev" onClick={prev} />
                </div>

                <div ref={emblaRef} className="w-full cursor-grab overflow-hidden active:cursor-grabbing">
                    <div className="-ml-[clamp(16px,1.6vw,24px)] flex touch-pan-y">
                        {TEAM.map((member) => (
                            <div
                                key={member.name}
                                className="min-w-0 shrink-0 grow-0 basis-[78%] pl-[clamp(16px,1.6vw,24px)] min-[640px]:basis-1/2 min-[1024px]:basis-1/3"
                            >
                                <Card {...member} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="max-[767px]:hidden">
                    <Arrow dir="next" onClick={next} />
                </div>

                {/* Mobile arrows */}
                <div className="hidden gap-4 max-[767px]:flex">
                    <Arrow dir="prev" onClick={prev} />
                    <Arrow dir="next" onClick={next} />
                </div>
            </div>
        </section>
    );
}