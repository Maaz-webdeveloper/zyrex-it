"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { MSG, inIframe, onParentMessage, sendToParent } from "@/lib/embed";

/**
 * Wraps every /embed/* section. Inside the GHL iframe it:
 * 1. reports its height (iframe resizes itself)
 * 2. receives the real screen height -> CSS variable --zx-vh
 * 3. forwards the mouse wheel to the GHL page (Lenis smooth scroll)
 * 4. forwards the mouse position to the GHL page (one cursor ball everywhere)
 * Opened directly (localhost / Vercel) it runs its own Lenis, so it scrolls like the GHL page.
 */
export default function EmbedShell({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Page setup: transparent background, no scrollbars inside the iframe
  useEffect(() => {
    const { documentElement: html, body } = document;
    html.style.background = "transparent";
    body.style.background = "transparent";
    body.style.margin = "0";
    if (inIframe()) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    }
  }, []);

  // Opened directly: Lenis smooth scroll. Never inside the iframe (the GHL page already has it).
  useEffect(() => {
    if (inIframe()) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      prevent: (node) => !!node.closest?.("[data-native-scroll]"), // inner scroll areas keep their own scroll
    });
    // Runs first in the GSAP tick, so sections read this frame's scroll position, not the last one
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf, false, true);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  // Screen height -> --zx-vh (use this instead of 100vh / h-screen inside embeds)
  useEffect(() => {
    const html = document.documentElement;
    const setVh = (h: number) => html.style.setProperty("--zx-vh", `${Math.round(h)}px`);

    if (!inIframe()) {
      // Opened directly (localhost / Vercel): use this window's height
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      let lastWidth = window.innerWidth;
      setVh(window.innerHeight);
      const onResize = () => {
        if (coarse && window.innerWidth === lastWidth) return; // ignore mobile URL-bar jumps
        lastWidth = window.innerWidth;
        setVh(window.innerHeight);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    // Inside GHL: safe fallback until the GHL page sends the real height
    setVh(800);
    const off = onParentMessage(MSG.viewport, (d) => {
      if (typeof d.height === "number") setVh(d.height);
    });
    sendToParent({ type: MSG.hello, id: pathname });
    return off;
  }, [pathname]);

  // Height reporting -> GHL resizes the iframe
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const send = () => {
      const height = Math.ceil(el.getBoundingClientRect().height);
      if (process.env.NODE_ENV === "development") console.log("[embed] height:", height);
      sendToParent({ type: MSG.height, id: pathname, height });
    };
    send();
    const ro = new ResizeObserver(send);
    ro.observe(el);
    window.addEventListener("load", send);
    document.fonts?.ready.then(send);
    return () => {
      ro.disconnect();
      window.removeEventListener("load", send);
    };
  }, [pathname]);

  // Mouse wheel -> GHL page (so Lenis smooth scroll works over this section)
  useEffect(() => {
    if (!inIframe()) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey) return; // trackpad pinch-zoom
      const target = e.target as Element | null;
      if (target?.closest?.("[data-native-scroll]")) return; // inner scroll areas keep their own scroll
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1;
      sendToParent({ type: MSG.wheel, deltaY: e.deltaY * unit });
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  // Mouse position -> GHL page (cursor ball follows across every section)
  useEffect(() => {
    if (!inIframe()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    let hover = false;
    const flush = () => {
      frame = 0;
      sendToParent({ type: MSG.pointer, x, y, hover });
    };
    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = e.target as Element | null;
      hover = !!target?.closest?.("a, button, [data-cursor-hover]");
      if (!frame) frame = requestAnimationFrame(flush);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} style={{ display: "flow-root" }}>
      {children}
    </div>
  );
}

export { EmbedShell };