"use client";

// Integrations section ("Point, Click & Connect" style), clean like the reference, ZYREX gold accents.
// Elements reveal in order when the section scrolls into view (works inside the GHL iframe too).

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { scrollParentTo } from "@/lib/embed";
import { COPY, FEATURES } from "./data";
import ToolsBand from "./ToolsBand";

gsap.registerPlugin(useGSAP);

export default function Integrations() {
    const rootRef = useRef<HTMLElement>(null);

    // Reveal on scroll: hidden at start, plays once when 20% of the section is visible
    useGSAP(
        () => {
            const root = rootRef.current;
            if (!root) return;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

            const q = gsap.utils.selector(root);
            gsap.set(q("[data-reveal]"), { autoAlpha: 0, y: 24 });

            const io = new IntersectionObserver(
                ([entry]) => {
                    if (!entry.isIntersecting) return;
                    io.disconnect();
                    gsap
                        .timeline({ defaults: { ease: "power3.out", duration: 0.9 } })
                        .to(q('[data-reveal="heading"]'), { autoAlpha: 1, y: 0, duration: 1.1 }, 0)
                        .to(q('[data-reveal="text"]'), { autoAlpha: 1, y: 0 }, 0.2)
                        .to(q('[data-reveal="link"]'), { autoAlpha: 1, y: 0 }, 0.3)
                        .to(q('[data-reveal="band"]'), { autoAlpha: 1, y: 0, duration: 1.2 }, 0.4)
                        .to(q('[data-reveal="feature"]'), { autoAlpha: 1, y: 0, stagger: 0.1 }, 0.7);
                },
                { threshold: 0.2 }
            );
            io.observe(root);
            return () => io.disconnect();
        },
        { scope: rootRef }
    );

    return (
        <section
            ref={rootRef}
            id="integrations"
            className="relative w-full overflow-hidden px-5 py-[clamp(64px,8vw,120px)] text-white"
            style={{
                background: "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(255, 255, 255, 0.03), transparent 70%), #0a0a0a",
            }}
        >
            {/* Top: heading, paragraph, link */}
            <div className="relative z-10 mx-auto flex max-w-[52rem] flex-col items-center text-center">
                <h2
                    data-reveal="heading"
                    className="text-[clamp(2.2rem,4.6vw,4.2rem)] leading-[1.05] font-normal tracking-[-0.02em] text-white"
                >
                    {COPY.heading.join(" ")} {COPY.headingAccent}
                </h2>

                <p
                    data-reveal="text"
                    className="mt-5 max-w-[44rem] text-[clamp(14px,1.15vw,17px)] leading-[1.65] text-balance text-white/85"
                >
                    {COPY.text}
                </p>

                <a
                    data-reveal="link"
                    href={COPY.linkHref}
                    onClick={(e) => {
                        e.preventDefault();
                        scrollParentTo(COPY.linkHref);
                    }}
                    className="group mt-2 inline-flex items-center gap-2 text-[clamp(14px,1.1vw,16px)] text-accent"
                >
                    {COPY.linkLabel}
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                    </span>
                </a>
            </div>

            {/* Middle: the moving tools band */}
            <div data-reveal="band">
                <ToolsBand />
            </div>

            {/* Bottom: 4 feature columns */}
            <div className="relative z-10 mx-auto grid max-w-[60rem] grid-cols-1 gap-8 min-[560px]:grid-cols-2 min-[1024px]:grid-cols-4">
                {FEATURES.map((f) => (
                    <div key={f.title} data-reveal="feature" className="relative border-l-2 border-white/10 pl-4">
                        {/* Gold part of the line, only next to the title */}
                        <span aria-hidden="true" className="absolute top-0 -left-[2px] h-[22px] w-[2px] bg-accent" />
                        <h3 className="text-[15px] leading-snug font-extrabold text-white">{f.title}</h3>
                        <p className="mt-3 text-[14px] leading-[1.6] text-white/75">{f.text}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}