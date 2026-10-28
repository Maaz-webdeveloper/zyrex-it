"use client";

// Real 3D ring of cards around the character's head (Mindly-style).
// Two copies of the same ring spin together:
//   - BACK copy (z 1, behind the character img): shows only the far-side cards, dimmed, plus a thin gold ring line
//   - FRONT copy (z 3, over the character): shows only the near-side cards
// The character <img> in HeroStage is z 2.

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Ring position/size relative to the character's visible box. Tweak these to fit the head.
const RING = {
    cx: 52, // center X, % of the character's width
    cy: 24, // center Y, % of the character's height (forehead level)
    radius: 0.75, // ring radius = this × character width
    tiltX: -12, // tilt toward the viewer (deg)
    tiltZ: -6, // sideways tilt to follow the head (deg)
    duration: 30, // seconds per full turn
};

type Card =
    | { type: "info"; title: string; text: string; icon: string[] }
    | { type: "image"; src: string };

// Placeholder content (change freely)
const CARDS: Card[] = [
    { type: "info", title: "Strategy", text: "Plans that drive growth", icon: ["M12 3l8 4v6c0 4-3.5 7-8 8-4.5-1-8-4-8-8V7z"] },
    { type: "image", src: "https://picsum.photos/seed/zyrex-1/320/240?grayscale" },
    { type: "info", title: "Automation", text: "Work that runs itself", icon: ["M4 4h6v6H4z", "M14 14h6v6h-6z", "M10 7h4a3 3 0 0 1 3 3v4"] },
    { type: "info", title: "SEO", text: "Rank higher on Google", icon: ["M11 4a7 7 0 1 1 0 14a7 7 0 0 1 0-14z", "M21 21l-4.3-4.3"] },
    { type: "image", src: "https://picsum.photos/seed/zyrex-2/320/240?grayscale" },
    { type: "info", title: "Growth", text: "More leads, more sales", icon: ["M3 17l6-6 4 4 8-8", "M14 7h7v7"] },
    { type: "info", title: "Design", text: "Brands people remember", icon: ["M12 19l7-7 3 3-7 7-3-3z", "M18 13l-1.5-7.5L2 2l3.5 14.5L13 18z"] },
    { type: "image", src: "https://picsum.photos/seed/zyrex-3/320/240?grayscale" },
    { type: "info", title: "Ads", text: "Campaigns that convert", icon: ["M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z", "M16 9a4 4 0 0 1 0 6"] },
    { type: "info", title: "Web", text: "Fast, modern websites", icon: ["M3 4h18v12H3z", "M8 20h8", "M12 16v4"] },
];

const GOLD = "linear-gradient(135deg, #ffdd65, #ffcc00)";
// Clean frosted glass (no gold tint); only the front copy gets backdrop blur
const GLASS_BG = "linear-gradient(160deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.05))";

function Face({ card, glass }: { card: Card; glass?: boolean }) {
    if (card.type === "image") {
        return (
            <div
                className={`h-[clamp(40px,3.6vw,64px)] w-[clamp(90px,7.5vw,150px)] overflow-hidden rounded-[clamp(10px,1vw,16px)] shadow-[0_14px_40px_rgba(0,0,0,0.6)] ${glass ? "backdrop-blur-xl" : ""}`}
                style={{ border: "1px solid rgba(255, 255, 255, 0.2)" }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={card.src} alt="" draggable={false} className="size-full object-cover opacity-90"
                    style={{ filter: "grayscale(1) brightness(0.75) contrast(1.05)" }}
                />
            </div>
        );
    }
    return (
        <div
            className={`relative flex w-[clamp(130px,11vw,220px)] items-center gap-[clamp(7px,0.7vw,12px)] rounded-[clamp(10px,1vw,16px)] p-[clamp(8px,0.8vw,14px)] shadow-[0_14px_40px_rgba(0,0,0,0.6)] ${glass ? "backdrop-blur-xl" : ""}`}
            style={{ background: GLASS_BG, border: "1px solid rgba(255, 255, 255, 0.18)" }}
        >
            {/* Thin white highlight along the top edge */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-3 top-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)" }}
            />
            <span
                className="grid size-[clamp(22px,2vw,36px)] shrink-0 place-items-center rounded-[clamp(6px,0.6vw,10px)] text-black"
                style={{ background: GOLD }}
            >
                <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-[55%]"
                >
                    {card.icon.map((d) => (
                        <path key={d} d={d} />
                    ))}
                </svg>
            </span>
            <span className="min-w-0">
                <span className="block text-[clamp(11px,1vw,16px)] leading-tight font-extrabold text-white">
                    {card.title}
                </span>
                <span className="mt-0.5 block truncate text-[clamp(9px,0.72vw,12px)] leading-tight text-white/60">
                    {card.text}
                </span>
            </span>
        </div>
    );
}

function Ring({ layer, sceneRef }: { layer: "back" | "front"; sceneRef?: React.Ref<HTMLDivElement> }) {
    const back = layer === "back";
    return (
        <div
            ref={sceneRef}
            data-ring-scene=""
            aria-hidden="true"
            className={`pointer-events-none absolute top-0 left-0 size-0 ${back ? "z-[1]" : "z-[3]"}`}
            style={{ perspective: "2400px" }}
        >
            {/* Static tilt */}
            <div style={{ transformStyle: "preserve-3d", transform: `rotateX(${RING.tiltX}deg) rotateZ(${RING.tiltZ}deg)` }}>
                {/* Spinning part (GSAP rotates this) */}
                <div data-ring-spin="" style={{ transformStyle: "preserve-3d" }}>
                    {/* Thin gold ring line (back copy only) */}
                    {back && (
                        <span
                            className="absolute rounded-full"
                            style={{
                                width: "calc(var(--zx-r, 220px) * 2.3)",
                                height: "calc(var(--zx-r, 220px) * 2.3)",
                                left: "calc(var(--zx-r, 220px) * -1.15)",
                                top: "calc(var(--zx-r, 220px) * -1.15)",
                                border: "1px solid rgba(255, 204, 0, 0.35)",
                                transform: "rotateX(90deg)",
                            }}
                        />
                    )}

                    {CARDS.map((card, i) => (
                        <div
                            key={i}
                            className="absolute top-0 left-0"
                            style={{
                                transformStyle: "preserve-3d",
                                // two rows: even cards a bit higher, odd cards a bit lower
                                transform: `translate(-50%, ${i % 2 ? "0%" : "-100%"}) rotateY(${(i * 360) / CARDS.length}deg) translateZ(var(--zx-r, 220px))`,
                            }}
                        >
                            <div
                                style={{
                                    backfaceVisibility: "hidden",
                                    WebkitBackfaceVisibility: "hidden",
                                    // back copy: show the card only while it is on the far side
                                    transform: back ? "rotateY(180deg)" : undefined,
                                    opacity: back ? 0.4 : 0.85, // front: slightly see-through so the face stays visible
                                }}
                            >
                                <Face card={card} glass={!back} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function CharacterOrbits() {
    const backRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const wrapper = backRef.current?.parentElement; // the character wrapper
        const img = wrapper?.querySelector("img");
        if (!wrapper || !img) return;

        const scenes = Array.from(wrapper.querySelectorAll<HTMLElement>("[data-ring-scene]"));
        const spins = Array.from(wrapper.querySelectorAll<HTMLElement>("[data-ring-spin]"));

        // Place the ring on the head, based on where the character is actually drawn
        const measure = () => {
            const s = wrapper.getBoundingClientRect();
            const i = img.getBoundingClientRect();
            if (!i.width || !i.height) return;
            const k = wrapper.offsetWidth ? s.width / wrapper.offsetWidth : 1; // undo the GSAP scale
            const ratio =
                img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : i.width / i.height;
            const h = Math.min(i.height, i.width / ratio);
            const w = h * ratio;
            const boxX = (i.left - s.left + (i.width - w) / 2) / k;
            const boxY = (i.bottom - s.top - h) / k;
            const bw = w / k;
            const bh = h / k;

            const x = boxX + (RING.cx / 100) * bw;
            const y = boxY + (RING.cy / 100) * bh;
            scenes.forEach((scene) => {
                scene.style.left = `${x}px`;
                scene.style.top = `${y}px`;
            });
            wrapper.style.setProperty("--zx-r", `${bw * RING.radius}px`);
        };
        measure();

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const tween = reduce
            ? null
            : gsap.to(spins, { rotationY: "+=360", duration: RING.duration, ease: "none", repeat: -1 });

        const ro = new ResizeObserver(measure);
        ro.observe(wrapper);
        img.addEventListener("load", measure);

        // Pause while the hero is off-screen
        const io = new IntersectionObserver(([entry]) => {
            if (!tween) return;
            if (entry.isIntersecting) tween.play();
            else tween.pause();
        });
        io.observe(wrapper);

        return () => {
            tween?.kill();
            ro.disconnect();
            io.disconnect();
            img.removeEventListener("load", measure);
        };
    }, []);

    return (
        <>
            <Ring layer="back" sceneRef={backRef} />
            <Ring layer="front" />
        </>
    );
}