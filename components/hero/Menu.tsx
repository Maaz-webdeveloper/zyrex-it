"use client";

import { useEffect } from "react";
import { lockParentScroll, scrollParentTo } from "@/lib/embed";

const MENU_ITEMS = [
    { label: "Home", href: "#top" },
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "Blog", href: "#blog" },
    { label: "Career", href: "#career" },
    { label: "About", href: "#about" },
    { label: "Team", href: "#team" },
    { label: "Contact", href: "#contact" },
];

const FOOT_LINKS = [
    { label: "hello@zyrexit.com", href: "mailto:hello@zyrexit.com" },
    { label: "Facebook", href: "https://www.facebook.com/zyrexit" },
    { label: "Instagram", href: "https://www.instagram.com/zyrexit" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/zyrex-it" },
];

const EASE = "ease-[cubic-bezier(0.76,0,0.24,1)]";

type MenuProps = {
    open: boolean;
    origin: { x: number; y: number } | null; // where the circle opens from (the button)
    onClose: () => void;
};

export default function Menu({ open, origin, onClose }: MenuProps) {
    // Menu open -> the GHL page cannot scroll
    useEffect(() => {
        lockParentScroll(open);
    }, [open]);
    useEffect(() => () => lockParentScroll(false), []);

    // Esc closes the menu
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // Link click: close menu, then smooth-scroll the GHL page to that section
    const go = (href: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        onClose();
        lockParentScroll(false);
        setTimeout(() => scrollParentTo(href), 150);
    };

    const at = origin ? `${origin.x}px ${origin.y}px` : "calc(100% - 60px) 48px";

    return (
        <nav
            id="zx-menu"
            aria-label="Main menu"
            inert={!open}
            className={`fixed inset-0 z-40 flex flex-col justify-center px-[clamp(24px,8vw,120px)] pt-[100px] pb-10 transition-[clip-path,visibility] duration-[900ms] ${EASE} ${open ? "visible" : "invisible delay-[0ms,900ms]"
                }`}
            style={{
        clipPath: open ? `circle(150% at ${at})` : `circle(0px at ${at})`,
        background: "radial-gradient(circle at 85% 15%, rgba(255, 204, 0, 0.12), transparent 50%), #050505",
      }}
        >
            <ul>
                {MENU_ITEMS.map((item, i) => (
                    <li
                        key={item.label}
                        className={`transition-[opacity,translate] ${open ? `translate-y-0 opacity-100 duration-[700ms,900ms] ${EASE}` : "translate-y-10 opacity-0 duration-[400ms]"
                            }`}
                        style={{ transitionDelay: open ? `${0.3 + i * 0.07}s` : "0s" }}
                    >
                        <a
                            href={item.href}
                            onClick={go(item.href)}
                            className="flex items-baseline gap-[18px] py-[0.05em] text-[clamp(1.5rem,4.5vw,3.2rem)] leading-[1.1] font-extrabold text-white/85 uppercase transition-[color,padding] duration-300 hover:pl-3.5 hover:text-accent"
                        >
                            <small className="text-[0.8rem] tracking-[0.2em] text-accent">
                                {String(i + 1).padStart(2, "0")}
                            </small>
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>

            <div
                className={`mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[13px] tracking-[0.08em] text-white/70 transition-opacity duration-700 ${open ? "opacity-100 delay-[900ms]" : "opacity-0"
                    }`}
            >
                {FOOT_LINKS.map((link) => (
                    <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-accent"
                    >
                        {link.label}
                    </a>
                ))}
            </div>
        </nav>
    );
}