"use client";

import { scrollParentTo } from "@/lib/embed";

// Shared size/shape for both buttons (same as the old design)
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
            {/* BOOK A CALL: gold, black circle with arrow */}
            <a
                href="#contact"
                onClick={go("#contact")}
                className={`${BASE} group bg-[linear-gradient(135deg,var(--color-accent-light),var(--color-accent))] pr-[34px] pl-3.5 text-black hover:shadow-[0_10px_30px_rgba(255,204,0,0.35)] max-[560px]:pr-7 max-[560px]:pl-2`}
                data-anim="cta"
            >
                Book a call
                <span
                    aria-hidden="true"
                    className="absolute top-1/2 right-1 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-black text-accent transition-transform duration-300 group-hover:translate-x-[3px] max-[560px]:size-[28px]"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="max-[560px]:size-3.5"
                    >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                </span>
            </a>

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