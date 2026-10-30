"use client";

import { PILLARS, PILLARS_COPY, type Pillar } from "./data";

const GOLD = "linear-gradient(135deg, #ffdd65, #ffcc00)";

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
    const bySide = (side: "left" | "right") => PILLARS.filter((p) => p.side === side).sort((a, b) => a.row - b.row);

    return (
        <section className="relative w-full overflow-hidden bg-[#0a0a0a] px-5 py-[clamp(72px,9vw,140px)] text-white">
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

            {/* ===== Desktop stage: left texts | line + visual | right texts ===== */}
            <div
                data-stage=""
                className="relative mx-auto mt-[clamp(56px,7vw,110px)] hidden max-w-[72rem] grid-cols-[1fr_clamp(240px,26vw,400px)_1fr] gap-[clamp(24px,3vw,56px)] md:grid"
                style={{ minHeight: "calc(var(--zx-vh, 100svh) * 0.85)" }}
            >
                <div className="flex flex-col justify-between py-[8%]">
                    {bySide("left").map((p) => (
                        <PillarText key={p.title} pillar={p} align="right" />
                    ))}
                </div>

                {/* Center: line + placeholder for the visual (Step 6) */}
                <div className="relative">
                    <span data-line-track="" className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/10" />
                    <span className="absolute top-0 left-1/2 size-2 -translate-x-1/2 bg-accent" />
                    <span className="absolute bottom-0 left-1/2 size-2 -translate-x-1/2 bg-accent" />
                    <div data-visual="" className="absolute top-1/2 left-1/2 aspect-square w-full -translate-x-1/2 -translate-y-1/2 rounded-[20px] border border-dashed border-white/10" />
                </div>

                <div className="flex flex-col justify-between py-[8%]">
                    {bySide("right").map((p) => (
                        <PillarText key={p.title} pillar={p} align="left" />
                    ))}
                </div>
            </div>

            {/* ===== Mobile: line on the left, pillars stacked ===== */}
            <div className="relative mx-auto mt-14 max-w-[30rem] pl-8 md:hidden">
                <span className="absolute inset-y-0 left-[3px] w-px bg-white/10" />
                <div className="flex flex-col gap-12">
                    {PILLARS.map((p) => (
                        <PillarText key={p.title} pillar={p} align="left" />
                    ))}
                </div>
            </div>
        </section>
    );
}