"use client";

import { useEffect, useRef } from "react";
import { MSG, inIframe, onParentMessage } from "@/lib/embed";

export type ParentScroll = {
  top: number;
  viewport: number;
  pinTop?: number; // only inside a [data-zyrex-pin] wrapper: its top on the visible screen (px)
  pinHeight?: number; // ...and its height (px)
};

/**
 * Where the top of this embed page is on the visible screen (px), plus the screen height.
 * Inside GHL: comes from the bridge ("zyrex-scroll"). Opened directly: uses this window's scroll
 * and the [data-zyrex-pin] element on this page, if there is one.
 * It never re-renders: read ref.current inside requestAnimationFrame / GSAP.
 */
export function useParentScroll() {
  const ref = useRef<ParentScroll>({ top: 0, viewport: 800 });

  useEffect(() => {
    if (!inIframe()) {
      const pin = document.querySelector("[data-zyrex-pin]");
      // Read live: the "scroll" event fires a frame late
      ref.current = {
        get top() {
          return -window.scrollY;
        },
        get viewport() {
          return window.innerHeight;
        },
        get pinTop() {
          return pin?.getBoundingClientRect().top;
        },
        get pinHeight() {
          return pin?.getBoundingClientRect().height;
        },
      };
      return;
    }

    return onParentMessage(MSG.scroll, (d) => {
      if (typeof d.top === "number" && typeof d.viewport === "number") {
        ref.current = {
          top: d.top,
          viewport: d.viewport,
          pinTop: typeof d.pinTop === "number" ? d.pinTop : undefined,
          pinHeight: typeof d.pinHeight === "number" ? d.pinHeight : undefined,
        };
      }
    });
  }, []);

  return ref;
}
