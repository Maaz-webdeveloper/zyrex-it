"use client";

import { scrollParentTo } from "@/lib/embed";

type NavbarProps = {
    open: boolean;
    onToggle: (rect?: DOMRect) => void;
};

const EASE = "ease-[cubic-bezier(0.76,0,0.24,1)]";

export default function Navbar({ open, onToggle }: NavbarProps) {
    return (
        <header className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-3.5 sm:px-[clamp(12px,2.5vw,40px)] sm:py-[22px]" data-anim="nav">
            {/* Logo: scrolls the GHL page back to the top */}
            <a
                href="#top"
                aria-label="ZYREX IT, back to top"
                className="block sm:-ml-[26px]"
                onClick={(e) => {
                    e.preventDefault();
                    if (open) onToggle();
                    scrollParentTo("#top");
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/hero/logo.png"
                    alt="ZYREX IT"
                    draggable={false}
                    className="block h-[37px] w-auto select-none sm:h-[45px] lg:h-[60px]"
                />
            </a>

            {/* Menu / Close button */}
            <button
                type="button"
                onClick={(e) => onToggle(e.currentTarget.getBoundingClientRect())}
                aria-expanded={open}
                aria-controls="zx-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="group relative flex origin-right scale-[0.9] items-center after:absolute after:-inset-[6px] after:rounded-full sm:after:hidden gap-[5px] rounded-full bg-[url('/hero/menu-btn.svg')] bg-size-[100%_100%] bg-center bg-no-repeat py-1.5 pr-1.5 pl-[18px] text-[12px] leading-none tracking-[0.14em] text-[#f6f1f1] transition-[translate,scale,box-shadow,opacity] duration-300 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-[0_0_24px_rgba(255,204,0,0.28)] sm:scale-100"
            >
                {/* Label slides MENU -> CLOSE */}
                <span className="block h-3 overflow-hidden uppercase">
                    <span className={`block transition-transform duration-500 ${EASE} ${open ? "-translate-y-1/2" : ""}`}>
                        <span className="block h-3 leading-3">Menu</span>
                        <span className="block h-3 leading-3">Close</span>
                    </span>
                </span>

                {/* Yellow circle: two lines -> X */}
                <span
                    aria-hidden="true"
                    className="relative size-8 rounded-full bg-[linear-gradient(135deg,var(--color-accent-light),var(--color-accent))]"
                >
                    <svg viewBox="0 0 32 32" className="absolute inset-0 size-8 overflow-visible">
                        <rect
                            x="9"
                            y="11"
                            width="14"
                            height="2"
                            rx="1"
                            className={`origin-center fill-black transition-transform duration-[450ms] ${EASE} ${open ? "translate-y-[4px] rotate-45" : "group-hover:-translate-y-0.5"
                                }`}
                        />
                        <rect
                            x="9"
                            y="17"
                            width="14"
                            height="2"
                            rx="1"
                            className={`origin-center fill-black transition-transform duration-[450ms] ${EASE} ${open ? "-translate-y-[2px] -rotate-45" : "group-hover:translate-y-0.5"
                                }`}
                        />
                    </svg>
                </span>
            </button>
        </header>
    );
}