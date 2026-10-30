"use client";

// Big outline "ZYREX IT" at the very bottom of the footer.
// Desktop: a soft gold light follows the mouse and fills the letters where it is (Sheryians style).
// Mobile / touch: the gold light slowly moves across the word by itself.

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const WORD = "ZYREX IT";
const W = 1000; // drawing width
const H = 192; // drawing height

const TEXT = {
    x: "0",
    y: "182",
    textLength: String(W),
    lengthAdjust: "spacingAndGlyphs",
    fontSize: "230",
    fontWeight: "800",
    style: { fontFamily: "var(--font-garet), Arial, sans-serif" },
} as const;

export default function FooterWordmark() {
    const rootRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const lightRef = useRef<SVGCircleElement>(null);
    const glowRef = useRef<SVGGElement>(null);

    useGSAP(() => {
        const root = rootRef.current;
        const svg = svgRef.current;
        const light = lightRef.current;
        const glow = glowRef.current;
        if (!root || !svg || !light || !glow) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        // Touch devices: the light moves across the word by itself
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            gsap.set(glow, { opacity: 1 });
            const tween = gsap.fromTo(
                light,
                { attr: { cx: 80 } },
                { attr: { cx: W - 80 }, duration: 5, ease: "sine.inOut", yoyo: true, repeat: -1 }
            );
            return () => tween.kill();
        }

        // Mouse: the light follows the cursor (mouse position -> drawing units)
        const toSvg = (e: MouseEvent) => {
            const r = svg.getBoundingClientRect();
            return { cx: ((e.clientX - r.left) / r.width) * W, cy: ((e.clientY - r.top) / r.height) * H };
        };
        const onEnter = (e: MouseEvent) => {
            gsap.set(light, { attr: toSvg(e) });
            gsap.to(glow, { opacity: 1, duration: 0.4, overwrite: true });
        };
        const onMove = (e: MouseEvent) => {
            gsap.to(light, { attr: toSvg(e), duration: 0.5, ease: "power3.out", overwrite: "auto" });
        };
        const onLeave = () => gsap.to(glow, { opacity: 0, duration: 0.6, overwrite: true });

        root.addEventListener("mouseenter", onEnter);
        root.addEventListener("mousemove", onMove);
        root.addEventListener("mouseleave", onLeave);
        return () => {
            root.removeEventListener("mouseenter", onEnter);
            root.removeEventListener("mousemove", onMove);
            root.removeEventListener("mouseleave", onLeave);
        };
    });

    return (
        <div ref={rootRef} aria-hidden="true" className="mt-[clamp(32px,4vw,64px)] pb-[clamp(16px,2vw,32px)] select-none">
            <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible">
                <defs>
                    <linearGradient id="zx-wm-gold" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#fff3b0" />
                        <stop offset="0.35" stopColor="#ffdd65" />
                        <stop offset="0.7" stopColor="#ffcc00" />
                        <stop offset="1" stopColor="#b38f00" />
                    </linearGradient>
                    <radialGradient id="zx-wm-light">
                        <stop offset="0" stopColor="#fff" stopOpacity="1" />
                        <stop offset="0.45" stopColor="#fff" stopOpacity="0.55" />
                        <stop offset="1" stopColor="#fff" stopOpacity="0" />
                    </radialGradient>
                    <mask id="zx-wm-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
                        <circle ref={lightRef} cx={W / 2} cy={H / 2} r="190" fill="url(#zx-wm-light)" />
                    </mask>
                </defs>

                {/* Outline (always visible) */}
                <text
                    {...TEXT}
                    fill="transparent"
                    stroke="rgba(255, 255, 255, 0.22)"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                >
                    {WORD}
                </text>

                {/* Gold fill, only visible inside the moving light */}
                <g ref={glowRef} mask="url(#zx-wm-mask)" style={{ opacity: 0 }}>
                    <text {...TEXT} fill="url(#zx-wm-gold)" stroke="#ffdd65" strokeWidth="1" vectorEffect="non-scaling-stroke">
                        {WORD}
                    </text>
                </g>
            </svg>
        </div>
    );
}