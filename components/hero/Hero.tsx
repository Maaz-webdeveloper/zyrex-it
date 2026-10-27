"use client";

import { useState } from "react";
import Navbar from "./Navbar";

export default function Hero() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div
            id="top"
            className="relative w-full overflow-hidden bg-[linear-gradient(#0b0b0b,#000_60%)] text-white"
            style={{ height: "var(--zx-vh, 100svh)" }}
        >
            <Navbar open={menuOpen} onToggle={() => setMenuOpen((v) => !v)} />
        </div>
    );
}