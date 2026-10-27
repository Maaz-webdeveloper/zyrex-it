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

    // 3. Entrance: plays when the preloader starts revealing the page
    useGSAP(
        () => {
            if (!preloaderDone) return;
            const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
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