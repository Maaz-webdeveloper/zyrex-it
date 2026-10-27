"use client";

// Middle band of the Integrations section:
// glowing "pipe" lines + endlessly moving tool tiles (GSAP) + the golden Z box with a moving gold border.
// Tiles are in full color on the right, and turn grey/dim after they pass behind the center box.

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TOOLS } from "./data";

gsap.registerPlugin(useGSAP);

const SPEED = 45; // seconds for one full loop of the tools (bigger = slower)
const BEAM_SPEED = 4; // seconds for the gold light to go once around the Z box

// Pipe lines (viewBox 1440 x 600, stretched to the band). Pipe = between y 240 and 360.
const LINE_TOP =
  "M80 40 H140 C180 40, 200 60, 220 90 L320 210 C340 232, 360 240, 400 240 H1040 C1080 240, 1100 232, 1120 210 L1220 90 C1240 60, 1260 40, 1300 40 H1360";
const LINE_BOTTOM =
  "M80 560 H140 C180 560, 200 540, 220 510 L320 390 C340 368, 360 360, 400 360 H1040 C1080 360, 1100 368, 1120 390 L1220 510 C1240 540, 1260 560, 1300 560 H1360";

const FADE_X = "linear-gradient(to right, transparent, #000 14%, #000 86%, transparent)";
const TILE_BG = "linear-gradient(145deg, rgba(255, 255, 255, 0.09), rgba(255, 255, 255, 0.02))";
const BEAM =
  "conic-gradient(from 0deg, transparent 0deg, transparent 250deg, rgba(255, 204, 0, 0.2) 290deg, #ffdd65 340deg, #ffcc00 355deg, transparent 360deg)";

function Tile({ name, icon }: { name: string; icon: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className="grid size-(--tile) shrink-0 place-items-center rounded-[14px] border border-white/12 shadow-[0_10px_30px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)]"
      style={{ background: TILE_BG }}
    >
      {failed ? (
        <span className="text-[clamp(13px,1.2vw,17px)] font-extrabold text-white/80">{name.slice(0, 2)}</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={icon}
          alt={name}
          title={name}
          loading="lazy"
          draggable={false}
          className="size-[50%] object-contain"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

// One row: the list twice, so moving it by -50% loops without a jump
function Track({ hidden }: { hidden?: boolean }) {
  const items = [...TOOLS, ...TOOLS];
  return (
    <div data-track="" aria-hidden={hidden || undefined} className="flex w-max">
      {items.map((tool, i) => (
        <div key={`${tool.name}-${i}`} className="pr-(--gap)">
          <Tile name={tool.name} icon={tool.icon} />
        </div>
      ))}
    </div>
  );
}

export default function ToolsBand() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Animations: moving tools, rotating gold border, pulsing glow (paused when off-screen or reduced motion)
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tweens = [
        gsap.to("[data-track]", { xPercent: -50, duration: SPEED, ease: "none", repeat: -1 }),
        gsap.to("[data-beam]", { rotation: 360, duration: BEAM_SPEED, ease: "none", repeat: -1 }),
        gsap.fromTo(
          "[data-pulse]",
          { opacity: 0.55 },
          { opacity: 1, duration: 2.2, ease: "sine.inOut", yoyo: true, repeat: -1 }
        ),
      ];
      if (reduce) tweens.forEach((t) => t.pause());

      const io = new IntersectionObserver(([entry]) => {
        tweens.forEach((t) => (entry.isIntersecting && !reduce ? t.play() : t.pause()));
      });
      if (rootRef.current) io.observe(rootRef.current);
      return () => io.disconnect();
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className="relative mx-auto my-[clamp(40px,5vw,72px)] h-[clamp(200px,22vw,320px)] w-full [--gap:clamp(28px,3.4vw,56px)] [--tile:clamp(46px,4.2vw,64px)]"
    >
      {/* Glowing pipe lines (reach 50% above and below the band) */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-1/2 h-[200%] w-full"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="zx-pipe" x1="0" x2="1440" y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffcc00" stopOpacity="0" />
            <stop offset="0.12" stopColor="#ffcc00" stopOpacity="0.55" />
            <stop offset="0.88" stopColor="#ffcc00" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffcc00" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[LINE_TOP, LINE_BOTTOM].map((d, i) => (
          <g key={d}>
            <path d={d} fill="none" stroke="url(#zx-pipe)" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
            {/* Small light travelling along the line */}
            <path
              d={d}
              fill="none"
              stroke="#ffdd65"
              strokeWidth={3}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="0.025 0.975"
              style={{ filter: "drop-shadow(0 0 6px rgba(255, 204, 0, 0.9))" }}
            >
              <animate
                attributeName="stroke-dashoffset"
                from={i === 0 ? "1" : "0"}
                to={i === 0 ? "0" : "1"}
                dur={i === 0 ? "6s" : "7s"}
                repeatCount="indefinite"
              />
            </path>
          </g>
        ))}
      </svg>

      {/* Moving tools inside the pipe */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2"
        style={{ maskImage: FADE_X, WebkitMaskImage: FADE_X }}
      >
        <div className="relative h-(--tile)">
          {/* Right half: full color (tools arriving) */}
          <div className="absolute inset-0" style={{ clipPath: "inset(0 0 0 50%)" }}>
            <Track />
          </div>
          {/* Left half: grey and dim (tools already connected) */}
          <div
            className="absolute inset-0"
            style={{ clipPath: "inset(0 50% 0 0)", filter: "grayscale(1) brightness(0.45)" }}
          >
            <Track hidden />
          </div>
        </div>
      </div>

      {/* Center: golden Z box with a moving gold border and a breathing glow */}
      <div className="absolute top-1/2 left-1/2 z-10 size-[clamp(104px,10.5vw,196px)] -translate-x-1/2 -translate-y-1/2">
        {/* Breathing glow */}
        <div
          data-pulse=""
          aria-hidden="true"
          className="pointer-events-none absolute -inset-[35%] rounded-full"
          style={{ background: "radial-gradient(closest-side, rgba(255, 204, 0, 0.28), transparent)" }}
        />

        {/* Moving gold light around the border */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-[18px]">
          <div
            data-beam=""
            className="absolute top-1/2 left-1/2 size-[160%] -translate-x-1/2 -translate-y-1/2"
            style={{ background: BEAM }}
          />
        </div>

        {/* Inner box */}
        <div className="absolute inset-[1.5px] grid place-items-center rounded-[16.5px] bg-[#0a0a0a] shadow-[inset_0_0_0_1px_rgba(255,204,0,0.18),inset_0_1px_0_rgba(255,255,255,0.08)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://assets.cdn.filesafe.space/bGYkTtwdgUDkTHqNb1v2/media/6ac083557d735ea2a1ec64a6.png"
            alt="ZYREX IT"
            draggable={false}
            className="size-[62%] object-contain select-none"
            style={{ filter: "drop-shadow(0 4px 14px rgba(255, 204, 0, 0.35))" }}
          />
        </div>
      </div>
    </div>
  );
}