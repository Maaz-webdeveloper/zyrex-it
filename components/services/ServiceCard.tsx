"use client";

import type { CSSProperties } from "react";
import { scrollParentTo } from "@/lib/embed";
import { SERVICES, type Service } from "./data";

const GOLD = "linear-gradient(135deg, #ffdd65, #ffcc00)";
const CARD_EDGE =
    "linear-gradient(140deg, rgba(255, 204, 0, 0.5), rgba(255, 255, 255, 0.08) 35%, rgba(255, 255, 255, 0.04) 70%, rgba(255, 204, 0, 0.25))";
const CARD_BG = "linear-gradient(160deg, rgba(24, 24, 24, 0.96), rgba(10, 10, 10, 0.96))";
// Stacked cards are solid, so the card underneath never shows through
const CARD_BG_SOLID = "linear-gradient(160deg, rgb(24, 24, 24), rgb(10, 10, 10))";

const n = (i: number) => String(i).padStart(2, "0");

/**
 * One service card. Normal: full height, used in the list (mobile, reduced motion).
 * stacked: fills its box and scales with the screen height, used in the pinned desktop stack.
 * slide: as tall as the tallest card, with the button at the bottom, used in the mobile slider.
 */
export default function ServiceCard({
    service,
    index,
    stacked,
    slide,
    style,
}: {
    service: Service;
    index: number;
    stacked?: boolean;
    slide?: boolean;
    style?: CSSProperties;
}) {
    return (
        <article
            data-service-card=""
            className={`rounded-[28px] p-px shadow-[0_30px_80px_rgba(0,0,0,0.55)] ${
                stacked ? "absolute inset-x-0 top-0 h-(--card-h) origin-top will-change-transform" : slide ? "h-full" : "origin-bottom"
            }`}
            style={{ background: stacked ? `${CARD_EDGE}, #0a0a0a` : CARD_EDGE, ...style }}
        >
            <div
                className={slide ? "flex h-full flex-col overflow-hidden rounded-[27px]" : `grid overflow-hidden rounded-[27px] md:grid-cols-[1fr_1.1fr] ${stacked ? "h-full" : ""}`}
                style={{ background: stacked ? CARD_BG_SOLID : CARD_BG }}
            >
                {/* Text */}
                <div
                    className={
                        stacked
                            ? "flex min-h-0 flex-col justify-center p-[clamp(20px,4.2vh,56px)]"
                            : slide
                              ? "order-2 flex flex-1 flex-col p-6"
                              : "order-2 flex flex-col justify-center p-[clamp(24px,3.2vw,56px)] md:order-1"
                    }
                >
                    <span className="text-[13px] tracking-[0.12em] text-white/60">
                        <span className="text-accent">{n(index + 1)}</span> / {n(SERVICES.length)}
                    </span>
                    <span className={`block h-px w-10 ${stacked ? "mt-[clamp(8px,1.4vh,12px)]" : "mt-3"}`} style={{ background: GOLD }} />
                    <h3
                        className={`leading-[1.08] font-normal tracking-[-0.02em] ${
                            stacked ? "mt-[clamp(10px,2vh,20px)] text-[clamp(24px,min(3vw,5.4vh),48px)]" : "mt-5 text-[clamp(28px,3vw,48px)]"
                        }`}
                    >
                        {service.title}
                    </h3>

                    <ul className={`flex flex-wrap gap-2 ${stacked ? "mt-[clamp(12px,2.4vh,24px)]" : "mt-6"}`}>
                        {service.tags.map((t) => (
                            <li
                                key={t}
                                className={`rounded-full border border-accent/25 bg-accent/[0.06] text-white/80 ${
                                    stacked ? "px-3 py-1 text-[clamp(11.5px,1.6vh,12.5px)]" : "px-3.5 py-1.5 text-[12.5px]"
                                }`}
                            >
                                {t}
                            </li>
                        ))}
                    </ul>

                    <p
                        className={`max-w-[34rem] leading-[1.65] text-white/65 ${
                            stacked ? "mt-[clamp(12px,2.4vh,24px)] text-[clamp(13px,min(1.05vw,1.95vh),16px)]" : "mt-6 text-[clamp(14px,1.05vw,16px)]"
                        }`}
                    >
                        {service.text}
                    </p>

                    {/* Slider: pushes the button to the bottom, so it lines up on every card */}
                    {slide && <span aria-hidden="true" className="min-h-8 grow" />}

                    <a
                        href="#contact"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollParentTo("#contact");
                        }}
                        className={`group/cta relative inline-flex h-[46px] w-fit shrink-0 items-center rounded-full pr-[52px] pl-6 text-[12px] font-extrabold tracking-[0.12em] text-black uppercase transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,204,0,0.35)] ${
                            stacked ? "mt-[clamp(14px,3vh,32px)]" : slide ? "" : "mt-8"
                        }`}
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
                <div
                    className={
                        stacked
                            ? "relative min-h-0"
                            : slide
                              ? "relative order-1 aspect-[4/3] shrink-0"
                              : "relative order-1 aspect-[4/3] md:order-2 md:aspect-auto md:min-h-[clamp(420px,38vw,640px)]"
                    }
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={service.image}
                        alt=""
                        loading={stacked ? "eager" : "lazy"}
                        decoding="async"
                        draggable={false}
                        className="absolute inset-0 size-full object-cover"
                    />
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

            {/* Stack: darkens as more cards land on top. An overlay, because filter on 8 big cards is heavy. */}
            {stacked && <div data-card-dim="" aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[28px] bg-black opacity-0" />}
        </article>
    );
}
