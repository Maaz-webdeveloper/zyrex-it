"use client";

// Middle band of the Integrations section (clean, like the reference):
// thin gold lines forming a "pipe", endlessly moving tool tiles, and a dark glass box with the golden logo.
// Desktop: horizontal pipe, tiles move left -> right, bright on the right, dark after the box.
// Mobile:  vertical pipe,  tiles move top -> bottom, bright at the bottom, dark after the box.

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TOOLS } from "./data";

gsap.registerPlugin(useGSAP);

const SPEED = 45; // seconds for one full loop on desktop (bigger = slower)
const SPEED_MOBILE = 36; // seconds for one full loop on mobile
const LOGO = "https://assets.cdn.filesafe.space/bGYkTtwdgUDkTHqNb1v2/media/6ac083557d735ea2a1ec64a6.png";

// Pipe lines in a 1440 x 600 space (pipe = between y 240 and 360). Mobile uses the same lines turned upright.
const LINE_TOP =
    "M80 40 H170 C230 40, 250 60, 270 90 L340 200 C360 230, 380 240, 430 240 H1010 C1060 240, 1080 230, 1100 200 L1170 90 C1190 60, 1210 40, 1270 40 H1360";
const LINE_BOTTOM =
    "M80 560 H170 C230 560, 250 540, 270 510 L340 400 C360 370, 380 360, 430 360 H1010 C1060 360, 1080 370, 1100 400 L1170 510 C1190 540, 1210 560, 1270 560 H1360";

const FADE_X =
  "linear-gradient(to right, transparent 0%, transparent 10%, rgba(0, 0, 0, 0.4) 22%, #000 38%, #000 62%, rgba(0, 0, 0, 0.4) 78%, transparent 90%, transparent 100%)";
const FADE_Y =
  "linear-gradient(to bottom, transparent 0%, transparent 8%, rgba(0, 0, 0, 0.4) 20%, #000 36%, #000 64%, rgba(0, 0, 0, 0.4) 80%, transparent 92%, transparent 100%)";
const DIM = "grayscale(1) brightness(0.28)";
const TILE_BG = "linear-gradient(145deg, #f2f2f2, #cfcfcf)";

// Center box: thin gold edge (gradient border) + dark glass inside with a soft gold spotlight
const BOX_EDGE_LIGHT =
    "conic-gradient(from -45deg, transparent 0deg, rgba(255, 204, 0, 0.9) 30deg, transparent 80deg, transparent 180deg, rgba(255, 204, 0, 0.6) 210deg, transparent 260deg, transparent 360deg)";
const BOX_INSIDE = "radial-gradient(circle at 50% 35%, #1f1a0a 0%, #0d0d0d 60%, #080808 100%)";

/* ---------- pieces ---------- */

function PipeLines({ id, vertical }: { id: string; vertical?: boolean }) {
    return (
        <svg
            aria-hidden="true"
            className={
                vertical
                    ? "pointer-events-none absolute inset-0 h-full w-full"
                    : "pointer-events-none absolute inset-x-0 -top-1/2 h-[200%] w-full"
            }
            viewBox={vertical ? "0 0 600 1440" : "0 0 1440 600"}
            preserveAspectRatio="none"
        >
            <defs>
                <linearGradient id={id} x1="0" x2="1440" y1="0" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#ffcc00" stopOpacity="0" />
                  <stop offset="0.12" stopColor="#ffcc00" stopOpacity="0" />
                  <stop offset="0.28" stopColor="#ffcc00" stopOpacity="0.45" />
                  <stop offset="0.72" stopColor="#ffcc00" stopOpacity="0.45" />
                  <stop offset="0.88" stopColor="#ffcc00" stopOpacity="0" />
                  <stop offset="1" stopColor="#ffcc00" stopOpacity="0" />
                </linearGradient>
                <linearGradient id={`${id}-light`} x1="0" x2="1440" y1="0" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#ffdd65" stopOpacity="0" />
                  <stop offset="0.18" stopColor="#ffdd65" stopOpacity="0" />
                  <stop offset="0.32" stopColor="#ffdd65" stopOpacity="1" />
                  <stop offset="0.68" stopColor="#ffdd65" stopOpacity="1" />
                  <stop offset="0.82" stopColor="#ffdd65" stopOpacity="0" />
                  <stop offset="1" stopColor="#ffdd65" stopOpacity="0" />
                </linearGradient>
            </defs>
            {/* On mobile the whole drawing is flipped upright (x <-> y) */}
            <g transform={vertical ? "matrix(0 1 1 0 0 0)" : undefined}>
                {[LINE_TOP, LINE_BOTTOM].map((d, i) => (
                    <g key={d}>
                        <path d={d} fill="none" stroke={`url(#${id})`} strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
                        {/* Small gold light running along the line */}
                        <path
                            d={d}
                            fill="none"
                            stroke={`url(#${id}-light)`}
                            strokeWidth={3}
                            strokeLinecap="round"
                            pathLength={1}
                            strokeDasharray="0.03 0.97"
                            style={{ filter: "drop-shadow(0 0 6px rgba(255, 204, 0, 0.9))" }}
                        >
                            <animate
                                attributeName="stroke-dashoffset"
                                from={i === 0 ? "1" : "0"}
                                to={i === 0 ? "0" : "1"}
                                dur={i === 0 ? "3.5s" : "4s"}
                                repeatCount="indefinite"
                            />
                        </path>
                    </g>
                ))}
            </g>
        </svg>
    );
}

function Tile({ name, icon }: { name: string; icon: string }) {
    const [failed, setFailed] = useState(false);
    return (
        <div className="grid size-(--tile) shrink-0 place-items-center rounded-[4px]" style={{ background: TILE_BG }}>
            {failed ? (
                <span className="text-[clamp(13px,1.2vw,17px)] font-extrabold text-black/70">{name.slice(0, 2)}</span>
            ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={icon}
                    alt={name}
                    title={name}
                    loading="lazy"
                    draggable={false}
                    className="size-[46%] object-contain"
                    onError={() => setFailed(true)}
                />
            )}
        </div>
    );
}

// One row/column: the list twice, so moving it by -50% loops without a jump
function Track({ vertical, hidden }: { vertical?: boolean; hidden?: boolean }) {
    const items = [...TOOLS, ...TOOLS];
    return (
        <div
            data-track={vertical ? "y" : "x"}
            aria-hidden={hidden || undefined}
            className={vertical ? "flex h-max flex-col" : "flex w-max"}
        >
            {items.map((tool, i) => (
                <div key={`${tool.name}-${i}`} className={vertical ? "pb-(--gap)" : "pr-(--gap)"}>
                    <Tile name={tool.name} icon={tool.icon} />
                </div>
            ))}
        </div>
    );
}

/* ---------- band ---------- */

export default function ToolsBand() {
    const rootRef = useRef<HTMLDivElement>(null);

    // Moving tools: only the visible version animates (desktop row or mobile column).
    // gsap.matchMedia switches automatically when the screen size changes. Paused off-screen / reduced motion.
    useGSAP(
        () => {
            const mm = gsap.matchMedia(rootRef.current ?? undefined);
            mm.add(
                {
                    desktop: "(min-width: 768px)",
                    mobile: "(max-width: 767px)",
                    reduce: "(prefers-reduced-motion: reduce)",
                },
                (ctx) => {
                    const { desktop, reduce } = ctx.conditions as { desktop: boolean; mobile: boolean; reduce: boolean };
                    if (reduce) return;

                    const tween = desktop
                        ? gsap.fromTo('[data-track="x"]', { xPercent: -50 }, { xPercent: 0, duration: SPEED, ease: "none", repeat: -1 })
                        : gsap.fromTo('[data-track="y"]', { yPercent: -50 }, { yPercent: 0, duration: SPEED_MOBILE, ease: "none", repeat: -1 });

                    const edge = gsap.to("[data-edge]", { rotation: 360, duration: 6, ease: "none", repeat: -1 });

                    const io = new IntersectionObserver(([entry]) => {
                        if (entry.isIntersecting) {
                            tween.play();
                            edge.play();
                        } else {
                            tween.pause();
                            edge.pause();
                        }
                    });
                    if (rootRef.current) io.observe(rootRef.current);
                    return () => io.disconnect();
                }
            );
            return () => mm.revert();
        },
        { scope: rootRef }
    );

    return (
        <div
            ref={rootRef}
            className="relative mx-auto my-[clamp(40px,5vw,72px)] h-[clamp(200px,22vw,320px)] w-full [--gap:clamp(28px,3.4vw,56px)] [--tile:clamp(46px,4.2vw,64px)] max-[767px]:my-8 max-[767px]:h-[440px] max-[767px]:[--gap:16px] max-[767px]:[--tile:56px]"
        >
            {/* ===== Desktop: horizontal pipe ===== */}
            <div className="absolute inset-0 max-[767px]:hidden">
                <PipeLines id="zx-pipe-h" />
                <div
                    className="absolute inset-x-0 top-1/2 -translate-y-1/2"
                    style={{ maskImage: FADE_X, WebkitMaskImage: FADE_X }}
                >
                    <div className="relative h-(--tile)">
                        {/* Right half: bright */}
                        <div className="absolute inset-0" style={{ clipPath: "inset(0 0 0 50%)" }}>
                            <Track />
                        </div>
                        {/* Left half: dark */}
                        <div className="absolute inset-0" style={{ clipPath: "inset(0 50% 0 0)", filter: DIM }}>
                            <Track hidden />
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== Mobile: vertical pipe ===== */}
            <div className="absolute inset-0 hidden max-[767px]:block">
                <PipeLines id="zx-pipe-v" vertical />
                <div
                    className="absolute inset-y-0 left-1/2 w-(--tile) -translate-x-1/2"
                    style={{ maskImage: FADE_Y, WebkitMaskImage: FADE_Y }}
                >
                    <div className="relative h-full">
                        {/* Bottom half: bright */}
                        <div className="absolute inset-0" style={{ clipPath: "inset(50% 0 0 0)" }}>
                            <Track vertical />
                        </div>
                        {/* Top half: dark */}
                        <div className="absolute inset-0" style={{ clipPath: "inset(0 0 50% 0)", filter: DIM }}>
                            <Track vertical hidden />
                        </div>
                    </div>
                </div>
            </div>

            {/* Soft dark shadow on both sides of the center box (tiles fade into it) */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-1/2 z-[5] -translate-x-1/2 -translate-y-1/2 max-[767px]:hidden"
                style={{
                    width: "calc(clamp(104px, 10.5vw, 196px) + clamp(120px, 12vw, 240px))",
                    height: "calc(var(--tile) * 2)",
                    background: "radial-gradient(closest-side, rgba(10, 10, 10, 0.7) 40%, transparent)",
                }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-1/2 z-[5] hidden -translate-x-1/2 -translate-y-1/2 max-[767px]:block"
                style={{
                    width: "calc(var(--tile) * 2)",
                    height: "calc(clamp(104px, 10.5vw, 196px) + 160px)",
                    background: "radial-gradient(closest-side, rgba(10, 10, 10, 0.7) 40%, transparent)",
                }}
            />
            {/* Center: dark glass box with a moving gold light on its edge, and the golden logo (shared) */}
            <div
                className="absolute top-1/2 left-1/2 z-10 size-[clamp(104px,10.5vw,196px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[14px] shadow-[0_24px_70px_rgba(0,0,0,0.7),0_0_50px_rgba(255,204,0,0.12)]"
                style={{ background: "rgba(255, 255, 255, 0.06)" }}
            >
                {/* Gold light that travels around the edge */}
                <div
                    data-edge=""
                    aria-hidden="true"
                    className="absolute top-1/2 left-1/2 size-[150%] -translate-x-1/2 -translate-y-1/2"
                    style={{ background: BOX_EDGE_LIGHT }}
                />
                <div
                    className="absolute inset-px grid place-items-center overflow-hidden rounded-[13px]"
                    style={{ background: BOX_INSIDE }}
                >
                    {/* Thin light along the top edge */}
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-5 top-0 h-px"
                        style={{ background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent)" }}
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={LOGO}
                        alt="ZYREX IT"
                        draggable={false}
                        className="relative size-[70%] object-contain select-none"
                        style={{ filter: "drop-shadow(0 6px 18px rgba(255, 204, 0, 0.35))" }}
                    />
                </div>
            </div>
        </div>
    );
}