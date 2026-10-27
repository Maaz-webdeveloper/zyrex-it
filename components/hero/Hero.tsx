"use client";

import { useCallback, useState } from "react";
import Navbar from "./Navbar";
import Menu from "./Menu";

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
            className="relative w-full overflow-hidden bg-[linear-gradient(#0b0b0b,#000_60%)] text-white"
            style={{ height: "var(--zx-vh, 100svh)" }}
        >
            <Navbar open={menuOpen} onToggle={toggleMenu} />
            <Menu open={menuOpen} origin={origin} onClose={closeMenu} />
        </div>
    );
}