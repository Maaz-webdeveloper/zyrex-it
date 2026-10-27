"use client";

// Middle band of the Integrations section (clean, like the reference):
// thin gold lines forming a "pipe", endlessly moving tool tiles, and a plain white box with the logo.
// Tiles are bright on the right and turn dark/grey after they pass behind the center box.

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TOOLS } from "./data";

gsap.registerPlugin(useGSAP);

const SPEED = 45; // seconds for one full loop of the tools (bigger = slower)
const LOGO = "https://assets.cdn.filesafe.space/bGYkTtwdgUDkTHqNb1v2/media/6ac083557d735ea2a1ec64a6.png";

// Pipe lines (viewBox 1440 x 600, stretched to the band). Pipe = between y 240 and 360.
const LINE_TOP =
  "M80 40 H170 C230 40, 250 60, 270 90 L340 200 C360 230, 380 240, 430 240 H1010 C1060 240, 1080 230, 1100 200 L1170 90 C1190 60, 1210 40, 1270 40 H1360";
const LINE_BOTTOM =
  "M80 560 H170 C230 560, 250 540, 270 510 L340 400 C360 370, 380 360, 430 360 H1010 C1060 360, 1080 370, 1100 400 L1170 510 C1190 540, 1210 560, 1270 560 H1360";

const FADE_X = "linear-gradient(to right, transparent, #000 14%, #000 86%, transparent)";
const TILE_BG = "linear-gradient(145deg, #f2f2f2, #cfcfcf)";

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

  // Moving tools (paused when off-screen or with reduced motion)
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const marquee = gsap.to("[data-track]", { xPercent: -50, duration: SPEED, ease: "none", repeat: -1 });
      if (reduce) marquee.pause();
      const io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !reduce) marquee.play();
        else marquee.pause();
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
      {/* Thin gold pipe lines (reach 50% above and below the band) */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-1/2 h-[200%] w-full"
        viewBox="0 0 1440 600"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="zx-pipe" x1="0" x2="1440" y1="0" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffcc00" stopOpacity="0" />
            <stop offset="0.14" stopColor="#ffcc00" stopOpacity="0.45" />
            <stop offset="0.86" stopColor="#ffcc00" stopOpacity="0.45" />
            <stop offset="1" stopColor="#ffcc00" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[LINE_TOP, LINE_BOTTOM].map((d, i) => (
          <g key={d}>
            <path d={d} fill="none" stroke="url(#zx-pipe)" strokeWidth={1.25} vectorEffect="non-scaling-stroke" />
            {/* Small gold light running along the line */}
            <path
              d={d}
              fill="none"
              stroke="#ffdd65"
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
        ))})
      </svg>

      {/* Moving tools inside the pipe */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2"
        style={{ maskImage: FADE_X, WebkitMaskImage: FADE_X }}
      >
        <div className="relative h-(--tile)">
          {/* Right half: bright (tools arriving) */}
          <div className="absolute inset-0" style={{ clipPath: "inset(0 0 0 50%)" }}>
            <Track />
          </div>
          {/* Left half: dark and grey (tools already connected) */}
          <div
            className="absolute inset-0"
            style={{ clipPath: "inset(0 50% 0 0)", filter: "grayscale(1) brightness(0.28)" }}
          >
            <Track hidden />
          </div>
        </div>
      </div>

      {/* Center: plain white box with the logo */}
      <div className="absolute top-1/2 left-1/2 z-10 grid size-[clamp(104px,10.5vw,196px)] -translate-x-1/2 -translate-y-1/2 place-items-center bg-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO} alt="ZYREX IT" draggable={false} className="size-[58%] object-contain select-none" />
      </div>
    </div>
  );
}