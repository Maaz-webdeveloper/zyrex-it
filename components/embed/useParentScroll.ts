"use client";

import { useEffect, useRef } from "react";
import { MSG, inIframe, onParentMessage } from "@/lib/embed";

export type ParentScroll = { top: number; viewport: number };

/**
 * Where the top of this embed page is on the visible screen (px), plus the screen height.
 * Inside GHL: comes from the bridge ("zyrex-scroll"). Opened directly: uses this window's scroll.
 * It never re-renders: read ref.current inside requestAnimationFrame / GSAP.
 */
export function useParentScroll() {
  const ref = useRef<ParentScroll>({ top: 0, viewport: 800 });

  useEffect(() => {
    if (!inIframe()) {
      const update = () => {
        ref.current = { top: -window.scrollY, viewport: window.innerHeight };
      };
      update();
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      return () => {
        window.removeEventListener("scroll", update);
        window.removeEventListener("resize", update);
      };
    }

    return onParentMessage(MSG.scroll, (d) => {
      if (typeof d.top === "number" && typeof d.viewport === "number") {
        ref.current = { top: d.top, viewport: d.viewport };
      }
    });
  }, []);

  return ref;
}
