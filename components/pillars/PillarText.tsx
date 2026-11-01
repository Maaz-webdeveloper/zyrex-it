import { PILLARS, type Pillar } from "./data";

export const LINE_GOLD = "linear-gradient(to bottom, #ffdd65, #ffcc00)";

// One pillar (number, title, text). Used by the desktop stage and the mobile list.
export default function PillarText({ pillar, align }: { pillar: Pillar; align: "left" | "right" }) {
    const n = PILLARS.indexOf(pillar) + 1;
    return (
        <div data-pillar={n - 1} className={align === "right" ? "text-right" : "text-left"}>
            <span className="text-[12px] font-extrabold tracking-[0.2em] text-accent">{String(n).padStart(2, "0")}</span>
            <h3 className="mt-2 text-[clamp(22px,2vw,30px)] leading-tight font-extrabold">{pillar.title}</h3>
            <p className="mt-3 text-[clamp(14px,1.05vw,16px)] leading-[1.65] text-white/70">{pillar.text}</p>
        </div>
    );
}
