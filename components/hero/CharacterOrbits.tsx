"use client";

// Real 3D ring of cards around the character's head (Mindly-style).
// Two copies of the same ring spin together:
//   - BACK copy (z 1, behind the character img): shows only the far-side cards, dimmed
//   - FRONT copy (z 3, over the character): shows only the near-side cards
// The character <img> in HeroStage is z 2.


import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

// Ring position/size relative to the character's visible box. Tweak these to fit the head.
const RING = {
    cx: 52, // center X, % of the character's width
    cy: 31, // center Y, % of the character's height (forehead level)
    radius: 0.58, // ring radius = this × character width (smaller = cards closer together)
    tiltX: 7, // tilt (deg): above 0 the front of the ring is higher than the back
    tiltZ: -6, // sideways tilt to follow the head (deg)
    duration: 30, // seconds per full turn
};

const ROW_GAP = "clamp(4px, 0.3vw, 6px)"; // half the gap between the two rows of cards (desktop)

// Below 900px: 6 smaller cards on a ring that always fits inside the screen, at forehead level
const MOBILE_QUERY = "(max-width: 899px)";
const PERSPECTIVE = 2400; // px
const RING_MOBILE = {
    cy: 14, // center Y, % of the character's height (above the eyes)
    tiltX: -12, // tilt (deg): below 0 the front of the ring is lower than the back
    radius: 0.4, // max ring radius = this × screen width (shrinks further if cards would leave the screen)
    cardW: 96, // mobile info card width (px), keep in sync with Face
    edge: 10, // min gap between a card and the screen edge (px)
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
// Mobile: Strategy, image, SEO, Growth, image, Web
const MOBILE_CARDS = [0, 1, 3, 5, 7, 9].map((i) => CARDS[i]);

const GOLD = "linear-gradient(135deg, #ffdd65, #ffcc00)";
// Clean frosted glass (no gold tint)
const GLASS_BG = "linear-gradient(160deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.05))";
// Front copy: no backdrop blur (too heavy on 3D strips), a light dark tint under the glass gives the frosted look instead
const GLASS_BG_FRONT = `${GLASS_BG}, rgba(22, 22, 22, 0.38)`;

// Curved cards: each card is cut into this many vertical strips, each one turned a little around the ring
// center, so together they bend along the ring's circle. Neighbouring strip edges meet exactly (chord math in measure()).
const STRIPS = 6;
const SEAM = 1; // px each strip reaches into its neighbour (soft cross-fade, hides the seam lines)
const CURVE = 1; // 1 = cards bend exactly like the ring; lower = flatter (e.g. 0.7), higher = stronger

function Face({ card, glass }: { card: Card; glass?: boolean }) {
    if (card.type === "image") {
        return (
            <div
                className={`h-[clamp(40px,3.6vw,64px)] w-[clamp(90px,7.5vw,150px)] max-[899px]:h-[40px] max-[899px]:w-[72px] overflow-hidden rounded-[clamp(10px,1vw,16px)] shadow-[0_14px_40px_rgba(0,0,0,0.6)]`}
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
            className={`relative flex w-[clamp(130px,11vw,220px)] items-center gap-[clamp(7px,0.7vw,12px)] rounded-[clamp(10px,1vw,16px)] p-[clamp(8px,0.8vw,14px)] max-[899px]:w-[96px] max-[899px]:gap-[6px] max-[899px]:p-[7px] shadow-[0_14px_40px_rgba(0,0,0,0.6)]`}
            style={{ background: glass ? GLASS_BG_FRONT : GLASS_BG, border: "1px solid rgba(255, 255, 255, 0.18)" }}
        >
            {/* Thin white highlight along the top edge */}
            <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-3 top-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)" }}
            />
            <span
                className="grid size-[clamp(22px,2vw,36px)] max-[899px]:size-[20px] shrink-0 place-items-center rounded-[clamp(6px,0.6vw,10px)] text-black"
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
                <span className="mt-0.5 block truncate text-[clamp(9px,0.72vw,12px)] max-[899px]:hidden leading-tight text-white/60">
                    {card.text}
                </span>
            </span>
        </div>
    );
}

// One card bent along the ring: an invisible copy gives the card its size, the strips draw it.
// Strip j shows its slice of the card and is turned around a point var(--zx-r) behind the card (the ring center),
// by (j - middle) × --zx-da-*, so the strips sit on the ring's circle.
// Back copy: the card is flipped (rotateY 180) to face the viewer from the far side, so the curve bends the other way.
function CurvedCard({ card, back }: { card: Card; back: boolean }) {
    const kind = card.type === "image" ? "img" : "info";
    const r = "var(--zx-rc, 220px)"; // bend radius (ring radius / CURVE)
    return (
        <div style={{ transformStyle: "preserve-3d", transform: back ? "rotateY(180deg)" : undefined }}>
            <div data-face-sizer={kind} style={{ visibility: "hidden" }}>
                <Face card={card} />
            </div>
            {Array.from({ length: STRIPS }, (_, j) => {
                const sw = `var(--zx-sw-${kind}, 30px)`; // strip width (card width / STRIPS, set in measure())
                const k = j - (STRIPS - 1) / 2; // strip position from the middle
                const shift = STRIPS / 2 - (j + 0.5); // in strip widths: moves the strip to the card center first
                const angle = `calc(var(--zx-da-${kind}, 0deg) * ${back ? -k : k})`;
                const move = `translateX(calc(${sw} * ${shift}))`;
                const transform = back
                    ? `${move} translateZ(${r}) rotateY(${angle}) translateZ(calc(${r} * -1))`
                    : `${move} translateZ(calc(${r} * -1)) rotateY(${angle}) translateZ(${r})`;
                // No seams: each strip reaches SEAM px into its neighbours and fades out there while the neighbour
                // fades in (the two add up to the full card), so there's no see-through gap and no darker overlap line.
                // The card's own outer edges stay sharp.
                const fade = `${SEAM * 2}px`;
                const mask =
                    j === 0
                        ? `linear-gradient(to right, #000 calc(100% - ${fade}), transparent)`
                        : j === STRIPS - 1
                          ? `linear-gradient(to right, transparent, #000 ${fade})`
                          : `linear-gradient(to right, transparent, #000 ${fade}, #000 calc(100% - ${fade}), transparent)`;
                return (
                    <div
                        key={j}
                        className="absolute inset-y-0"
                        style={{
                            left: `calc(${sw} * ${j} - ${SEAM}px)`,
                            width: `calc(${sw} + ${SEAM * 2}px)`,
                            overflowX: "clip", // cut the slice sideways only, the shadow below stays
                            transform,
                            WebkitMaskImage: mask,
                            maskImage: mask,
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            opacity: back ? 0.4 : 0.85, // front: slightly see-through so the face stays visible
                        }}
                    >
                        <div
                            className="absolute top-0"
                            style={{ left: `calc(${SEAM}px - ${sw} * ${j})`, width: `calc(${sw} * ${STRIPS})` }}
                        >
                            <Face card={card} glass={!back} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function Ring({
    layer,
    cards,
    sceneRef,
}: {
    layer: "back" | "front";
    cards: Card[];
    sceneRef?: React.Ref<HTMLDivElement>;
}) {
    const back = layer === "back";
    return (
        <div
            ref={sceneRef}
            data-ring-scene=""
            aria-hidden="true"
            className={`pointer-events-none absolute top-0 left-0 size-0 ${back ? "z-[1]" : "z-[3]"}`}
            style={{ perspective: `${PERSPECTIVE}px` }}
        >
            {/* Static tilt */}
            <div
                style={{
                    transformStyle: "preserve-3d",
                    transform: `rotateX(${cards === MOBILE_CARDS ? RING_MOBILE.tiltX : RING.tiltX}deg) rotateZ(${RING.tiltZ}deg)`,
                }}
            >
                {/* Spinning part (GSAP rotates this) */}
                <div data-ring-spin="" style={{ transformStyle: "preserve-3d" }}>
                    {cards.map((card, i) => (
                        <div
                            key={i}
                            className="absolute top-0 left-0"
                            style={{
                                transformStyle: "preserve-3d",
                                // desktop: two rows with a small gap (even cards a bit higher, odd a bit lower); mobile: one row
                                transform: `translate(-50%, ${cards === MOBILE_CARDS ? "-50%" : i % 2 ? ROW_GAP : `calc(-100% - ${ROW_GAP})`}) rotateY(${(i * 360) / cards.length}deg) translateZ(var(--zx-r, 220px))`,
                            }}
                        >
                            {/* back copy: each strip shows only while it is on the far side (flip + backface hidden) */}
                            <CurvedCard card={card} back={back} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function CharacterOrbits() {
    const backRef = useRef<HTMLDivElement>(null);
    const [mobile, setMobile] = useState(false);

    // Fewer cards below 900px
    useEffect(() => {
        const mq = window.matchMedia(MOBILE_QUERY);
        const update = () => setMobile(mq.matches);
        update();
        mq.addEventListener("change", update);
        return () => mq.removeEventListener("change", update);
    }, []);

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

            const isMobile = window.matchMedia(MOBILE_QUERY).matches;
            const x = boxX + (RING.cx / 100) * bw;
            const y = boxY + ((isMobile ? RING_MOBILE.cy : RING.cy) / 100) * bh;
            scenes.forEach((scene) => {
                scene.style.left = `${x}px`;
                scene.style.top = `${y}px`;
            });

            let r = bw * RING.radius;
            if (isMobile) {
                // Largest radius where every card (incl. perspective zoom) stays inside the screen
                const W = wrapper.offsetWidth;
                const room = Math.min(x, W - x) - RING_MOBILE.edge;
                const half = RING_MOBILE.cardW / 2;
                r = RING_MOBILE.radius * W;
                while (r > 0 && Math.hypot(r, half) * (PERSPECTIVE / (PERSPECTIVE - r)) > room) r -= 2;
            }
            r = Math.max(r, 0);
            wrapper.style.setProperty("--zx-r", `${r}px`);

            // Curved cards: angle between two strips, so a strip (a chord of the ring) spans exactly its share of
            // the circle and neighbouring strip edges meet with no gap
            const rc = r > 0 ? r / CURVE : 0;
            wrapper.style.setProperty("--zx-rc", `${rc}px`);
            (["info", "img"] as const).forEach((kind) => {
                const sizer = wrapper.querySelector<HTMLElement>(`[data-face-sizer="${kind}"]`);
                if (!sizer) return;
                const sw = sizer.offsetWidth / STRIPS;
                wrapper.style.setProperty(`--zx-sw-${kind}`, `${sw.toFixed(3)}px`);
                const deg = rc > 0 ? (2 * Math.asin(Math.min(1, sw / (2 * rc))) * 180) / Math.PI : 0;
                wrapper.style.setProperty(`--zx-da-${kind}`, `${deg.toFixed(4)}deg`);
            });
        };
        measure();

        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const tween = reduce
            ? null
            : gsap.to(spins, { rotationY: "+=360", duration: RING.duration, ease: "none", repeat: -1 });

        const ro = new ResizeObserver(measure);
        ro.observe(wrapper);
        // Card sizes change with the screen (and at the mobile switch): re-measure the strip angles
        wrapper.querySelectorAll("[data-face-sizer]").forEach((el) => ro.observe(el));
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
            <Ring layer="back" cards={mobile ? MOBILE_CARDS : CARDS} sceneRef={backRef} />
            <Ring layer="front" cards={mobile ? MOBILE_CARDS : CARDS} />
        </>
    );
}