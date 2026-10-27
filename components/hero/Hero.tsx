"use client";

import { useCallback, useState } from "react";
import Navbar from "./Navbar";
import Menu from "./Menu";
import HeroCopy from "./HeroCopy";
import HeroButtons from "./HeroButtons";
import HeroStage from "./HeroStage";
import HeroBackdrop from "./HeroBackdrop";

export default function Hero() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);

    const toggleMenu = useCallback((rect?: DOMRect) => {
        if (rect) setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        setMenuOpen((v) => !v);
    }, []);
    const closeMenu = useCallback(() => setMenuOpen(false), []);

    return (
        <div
            id="top"
            className="relative flex min-h-(--hero-h) w-full flex-col overflow-hidden bg-[linear-gradient(#0b0b0b,#000_60%)] text-white min-[900px]:h-(--hero-h)"
            style={{ "--hero-h": "var(--zx-vh, 100svh)" } as React.CSSProperties}
        >
            <HeroBackdrop />
            <HeroCopy />
            <HeroStage />
            <HeroButtons />
            <Navbar open={menuOpen} onToggle={toggleMenu} />
            <Menu open={menuOpen} origin={origin} onClose={closeMenu} />
        </div>
    );
}