"use client";

import { scrollParentTo } from "@/lib/embed";
import GoldButton from "@/components/ui/GoldButton";

// Size/shape of the outline button (the gold one is components/ui/GoldButton.tsx, same size)
const BASE =
    "relative inline-flex h-[42px] w-[170px] items-center justify-center rounded-full text-[11px] leading-none tracking-[0.12em] uppercase font-extrabold transition-[translate,box-shadow,opacity] duration-300 hover:-translate-y-0.5 max-[560px]:h-[44px] max-[560px]:w-full max-[560px]:text-[10px]";

// Mobile: CSS outline instead of the SVG (the SVG keeps its own aspect ratio and draws shorter than the box)
const OUTLINE_MOBILE =
    "max-[560px]:border-[1.5px] max-[560px]:border-transparent max-[560px]:[background:linear-gradient(100deg,rgba(255,204,0,0.22),transparent_42%,transparent_62%,rgba(255,204,0,0.18))_padding-box,linear-gradient(#0b0b0b,#0b0b0b)_padding-box,linear-gradient(135deg,#ffdd65,#ffcc00)_border-box]";

export default function HeroButtons() {
    // Button click: smooth-scroll the GHL page to that section
    const go = (href: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        scrollParentTo(href);
    };

    return (
        <div className="relative z-[7] mt-6 flex flex-wrap justify-center gap-3.5 max-[560px]:mx-auto max-[560px]:mt-7 max-[560px]:grid max-[560px]:w-full max-[560px]:max-w-[340px] max-[560px]:grid-cols-2 max-[560px]:gap-2 max-[560px]:px-5 min-[900px]:absolute min-[900px]:inset-x-0 min-[900px]:bottom-[3%] min-[900px]:mt-0">
            {/* BOOK A CALL: the shared gold button (components/ui/GoldButton.tsx) */}
            <GoldButton href="#contact" magnetic={false} data-anim="cta" className="max-[560px]:w-full max-[560px]:min-w-0">
                Book a call
            </GoldButton>

            {/* EXPLORE SERVICES: your outline SVG as the background */}
            <a
                href="#services"
                onClick={go("#services")}
                className={`${BASE} bg-[url('/hero/btn-outline.svg')] bg-size-[100%_100%] bg-center bg-no-repeat px-3.5 text-[#f9f3f3] hover:opacity-90 hover:shadow-[0_5px_20px_rgba(255,204,0,0.3)] max-[560px]:px-1 ${OUTLINE_MOBILE}`}
                data-anim="cta"
            >
                Explore services
            </a>
        </div>
    );
}