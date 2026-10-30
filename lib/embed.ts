// ZYREX embed bridge: messages between the Next.js sections (inside iframes)
// and the GHL page. The GHL side lives in the "GHL Bridge" custom code element.

export const MSG = {
  height: "zyrex-embed-height",
  hello: "zyrex-hello",
  viewport: "zyrex-viewport",
  wheel: "zyrex-wheel",
  pointer: "zyrex-pointer",
  lock: "zyrex-lock",
  scrollTo: "zyrex-scroll-to",
  scroll: "zyrex-scroll",
  ready: "zyrex-embed-ready",
  preloaderStatus: "zyrex-preloader-status",
  preloaderDone: "zyrex-preloader-done",
} as const;

type Message = { type: string; [key: string]: unknown };

/** True when this page is running inside an iframe (e.g. on the GHL page). */
export function inIframe(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

/** Send a message to the GHL page (does nothing when opened directly). */
export function sendToParent(message: Message) {
  if (!inIframe()) return;
  window.parent.postMessage(message, "*");
}

/** Listen for one message type from the GHL page. Returns an unsubscribe function. */
export function onParentMessage(
  type: string,
  callback: (data: Message) => void,
) {
  const handler = (event: MessageEvent) => {
    if (event.source !== window.parent) return;
    const data = event.data as Message | null;
    if (data && typeof data === "object" && data.type === type) callback(data);
  };
  window.addEventListener("message", handler);
  return () => window.removeEventListener("message", handler);
}

/** Stop / allow scrolling of the GHL page (used by the menu). */
export function lockParentScroll(locked: boolean) {
  sendToParent({ type: MSG.lock, locked });
}

/** Smooth-scroll the GHL page to a section, e.g. "#services" or "#top". */
export function scrollParentTo(target: string) {
  if (inIframe()) {
    sendToParent({ type: MSG.scrollTo, target });
    return;
  }
  try {
    if (target === "#" || target === "#top")
      window.scrollTo({ top: 0, behavior: "smooth" });
    else document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
  } catch {
    /* invalid selector: ignore */
  }
}

/** Tell the preloader this section has finished loading its images/fonts. */
export function signalReady(id: string) {
  sendToParent({ type: MSG.ready, id });
}
