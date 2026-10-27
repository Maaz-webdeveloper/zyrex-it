"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Navbar from "./Navbar";
import Menu from "./Menu";
import HeroCopy from "./HeroCopy";
import HeroButtons from "./HeroButtons";
import HeroStage from "./HeroStage";
import HeroBackdrop from "./HeroBackdrop";
import HeroDetails from "./HeroDetails";
import { usePreloaderDone } from "@/components/embed/usePreloaderDone";
import { signalReady } from "@/lib/embed";

gsap.registerPlugin(useGSAP);

// Images the preloader should wait for
const HERO_IMAGES = ["/hero/character.svg", "/hero/golden-z.png", "/hero/clients-avatars.svg"];

const MAGNET = 0.3; // how strongly buttons follow the mouse (0 = off)

export default function Hero() {
    const rootRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const preloaderDone = usePreloaderDone();

    const [menuOpen, setMenuOpen] = useState(false);
    const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);

    const toggleMenu = useCallback((rect?: DOMRect) => {
        if (rect) setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        setMenuOpen((v) => !v);
    }, []);
    const closeMenu = useCallback(() => setMenuOpen(false), []);

    // 1. Tell the GHL preloader when our images and fonts are loaded
    useEffect(() => {
        const images = HERO_IMAGES.map(
            (src) =>
                new Promise<void>((resolve) => {
                    const img = new Image();
                    img.onload = () => resolve();
                    img.onerror = () => resolve();
                    img.src = src;
                })
        );
        const fonts = document.fonts?.ready ?? Promise.resolve();
        Promise.all([...images, fonts]).then(() => signalReady(pathname));
    }, [pathname]);

    // 2. Hide everything that animates in (before the first paint)
    useGSAP(
        () => {
            gsap.set("[data-anim]", { autoAlpha: 0 });
        },
        { scope: rootRef }
    );

    // 3. Entrance, then mouse parallax + magnetic buttons (mouse devices only)
    useGSAP(
        () => {
            if (!preloaderDone || !rootRef.current) return;
            const root = rootRef.current;
            const cleanups: (() => void)[] = [];

            const startInteractions = () => {
                const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
                const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                if (!fine || reduce) return;

                // Parallax: every [data-depth] layer moves by its depth (px) toward/away from the mouse
                const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", root).map((el) => ({
                    depth: parseFloat(el.dataset.depth || "0"),
                    x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
                    y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
                }));
                const onMove = (e: MouseEvent) => {
                    const nx = e.clientX / window.innerWidth - 0.5;
                    const ny = e.clientY / window.innerHeight - 0.5;
                    layers.forEach((l) => {
                        l.x(nx * l.depth);
                        l.y(ny * l.depth);
                    });
                };
                window.addEventListener("mousemove", onMove);
                cleanups.push(() => window.removeEventListener("mousemove", onMove));

                // Magnetic buttons
                gsap.utils.toArray<HTMLElement>('[data-anim="cta"]', root).forEach((btn) => {
                    const xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
                    const yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });
                    const move = (e: MouseEvent) => {
                        const r = btn.getBoundingClientRect();
                        xTo((e.clientX - (r.left + r.width / 2)) * MAGNET);
                        yTo((e.clientY - (r.top + r.height / 2)) * MAGNET);
                    };
                    const leave = () => {
                        xTo(0);
                        yTo(0);
                    };
                    btn.addEventListener("mousemove", move);
                    btn.addEventListener("mouseleave", leave);
                    cleanups.push(() => {
                        btn.removeEventListener("mousemove", move);
                        btn.removeEventListener("mouseleave", leave);
                    });
                });
            };

            const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 }, onComplete: startInteractions });
            tl.fromTo('[data-anim="glow"]', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.6 }, 0)
                .fromTo('[data-anim="giant"]', { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1.4 }, 0.1)
                .fromTo(
                    '[data-anim="character"]',
                    { autoAlpha: 0, y: 80, scale: 0.96 },
                    { autoAlpha: 1, y: 0, scale: 1, duration: 1.4 },
                    0.2
                )
                .fromTo('[data-anim="nav"]', { autoAlpha: 0, y: -24 }, { autoAlpha: 1, y: 0 }, 0.3)
                .fromTo('[data-anim="eyebrow"]', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0 }, 0.4)
                .fromTo('[data-anim="line"]', { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.12 }, 0.5)
                .fromTo('[data-anim="text"]', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0 }, 0.8)
                .fromTo('[data-anim="cta"]', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, stagger: 0.1 }, 0.95)
                .fromTo(
                    '[data-anim="card"]',
                    { autoAlpha: 0, y: 40, scale: 0.9 },
                    { autoAlpha: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.15 },
                    1.05
                )
                .fromTo(
                    "[data-draw]",
                    { strokeDashoffset: 1 },
                    { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut", stagger: 0.15 },
                    1.35
                );

            return () => cleanups.forEach((fn) => fn());
        },
        { scope: rootRef, dependencies: [preloaderDone] }
    );

    return (
        <div
            ref={rootRef}
            id="top"
            className="relative flex min-h-(--hero-h) w-full flex-col overflow-hidden bg-[linear-gradient(#0b0b0b,#000_60%)] text-white min-[900px]:h-(--hero-h)"
            style={{ "--hero-h": "var(--zx-vh, 100svh)" } as React.CSSProperties}
        >
            <HeroBackdrop />
            <HeroCopy />
            <HeroButtons />
            <HeroStage />
            <HeroDetails />
            <Navbar open={menuOpen} onToggle={toggleMenu} />
            <Menu open={menuOpen} origin={origin} onClose={closeMenu} />
        </div>
    );
}