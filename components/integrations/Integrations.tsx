"use client";

// Integrations section ("Point, Click & Connect" style), ZYREX dark + gold theme.

import { scrollParentTo } from "@/lib/embed";
import { COPY, FEATURES } from "./data";
import ToolsBand from "./ToolsBand";

export default function Integrations() {
  return (
    <section
      id="integrations"
      className="relative w-full overflow-hidden bg-black px-5 py-[clamp(64px,8vw,120px)] text-white"
      style={{
        background:
          "radial-gradient(ellipse 60% 50% at 50% 45%, rgba(255, 204, 0, 0.06), transparent 70%), #000000",
      }}
    >
      {/* Top: heading, paragraph, link */}
      <div className="relative z-10 mx-auto flex max-w-[52rem] flex-col items-center text-center">
        <h2 className="text-[clamp(2rem,4.4vw,4rem)] leading-[1.05] font-extrabold tracking-[-0.01em] uppercase">
          {COPY.heading.join(" ")} <span className="text-accent">{COPY.headingAccent}</span>
        </h2>

        <p className="mt-5 max-w-[44rem] text-[clamp(14px,1.15vw,17px)] leading-[1.65] text-balance text-white/75">
          {COPY.text}
        </p>

        <a
          href={COPY.linkHref}
          onClick={(e) => {
            e.preventDefault();
            scrollParentTo(COPY.linkHref);
          }}
          className="group mt-4 inline-flex items-center gap-2 text-[clamp(14px,1.1vw,16px)] font-extrabold text-accent"
        >
          {COPY.linkLabel}
          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </a>
      </div>

      {/* Middle: the moving tools band (built in Step B) */}
      <div className="relative mx-auto my-[clamp(40px,5vw,72px)] h-[clamp(200px,22vw,320px)] w-full">
        <ToolsBand />
      </div>

      {/* Bottom: 4 feature columns */}
      <div className="relative z-10 mx-auto grid max-w-[64rem] grid-cols-1 gap-8 min-[560px]:grid-cols-2 min-[1024px]:grid-cols-4">
        {FEATURES.map((f) => (
          <div key={f.title} className="border-l-2 border-accent pl-4">
            <h3 className="text-[15px] leading-snug font-extrabold text-white">{f.title}</h3>
            <p className="mt-3 text-[14px] leading-[1.6] text-white/65">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}