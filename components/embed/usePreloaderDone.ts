"use client";

import { useEffect, useState } from "react";
import { MSG, inIframe, onParentMessage, sendToParent } from "@/lib/embed";

/** Becomes true when the GHL preloader starts revealing the page (or there is none). */
export function usePreloaderDone(fallbackMs = 15000) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!inIframe()) {
      const t = setTimeout(() => setDone(true), 300);
      return () => clearTimeout(t);
    }
    const off = onParentMessage(MSG.preloaderDone, () => setDone(true));
    sendToParent({ type: MSG.preloaderStatus });
    const t = setTimeout(() => setDone(true), fallbackMs); // safety net
    return () => {
      off();
      clearTimeout(t);
    };
  }, [fallbackMs]);

  return done;
}
