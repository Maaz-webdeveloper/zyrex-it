"use client";

// Gold "Book a call" button: the hero button (components/hero/HeroButtons.tsx) used everywhere.
// Gold gradient, heavy small caps, black circle with an arrow on the right.
// Hover: lifts a little with a gold shadow, the arrow nudges right.
// Magnetic (mouse devices, no reduced motion): the button follows the mouse a little.
// Section links ("#contact") smooth-scroll the GHL page.

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { scrollParentTo } from "@/lib/embed";

export const MAGNET = 0.3; // how strongly the button follows the mouse (the hero uses this too)

export default function GoldButton({
    href,
    children,
    magnetic = true,
    className = "",
    onClick,
    ...rest
}: {
    href: string;
    children: React.ReactNode;
    magnetic?: boolean; // the hero turns this off: it runs its own magnet after its entrance animation
    className?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "children" | "className">) {
    const ref = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || !magnetic) return;
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
        const move = (e: MouseEvent) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * MAGNET);
            yTo((e.clientY - (r.top + r.height / 2)) * MAGNET);
        };
        const leave = () => {
            xTo(0);
            yTo(0);
        };
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", leave);
        return () => {
            el.removeEventListener("mousemove", move);
            el.removeEventListener("mouseleave", leave);
            gsap.set(el, { x: 0, y: 0 });
        };
    }, [magnetic]);

    return (
        <a
            ref={ref}
            href={href}
            {...rest}
            onClick={(e) => {
                onClick?.(e);
                if (e.defaultPrevented || !href.startsWith("#")) return;
                e.preventDefault();
                scrollParentTo(href);
            }}
            className={`group/gold relative inline-flex h-[42px] w-fit min-w-[170px] shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-accent-light),var(--color-accent))] pr-[34px] pl-3.5 text-[11px] leading-none zx-medium tracking-[0.12em] whitespace-nowrap text-black uppercase transition-[translate,box-shadow,opacity] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(255,204,0,0.35)] max-[560px]:h-[44px] max-[560px]:pr-7 max-[560px]:pl-2 max-[560px]:text-[10px] ${className}`}
        >
            {/* Side padding keeps long labels clear of the arrow; "Book a call" sits exactly where it does in the hero */}
            <span className="px-2.5">{children}</span>
            <span
                aria-hidden="true"
                className="absolute top-1/2 right-1 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-black text-accent transition-transform duration-300 group-hover/gold:translate-x-[3px] max-[560px]:size-[28px]"
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
    );
}
