'use client';

import { useEffect, useRef } from 'react';

export default function EmbedShell({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set html and body styles
    const html = document.documentElement;
    const body = document.body;

    html.style.overflow = 'hidden';
    html.style.background = 'transparent';
    html.style.margin = '0';

    body.style.overflow = 'hidden';
    body.style.background = 'transparent';
    body.style.margin = '0';

    // Function to send height
    const sendHeight = () => {
      if (!wrapperRef.current) return;
      const height = Math.ceil(wrapperRef.current.getBoundingClientRect().height);
      const id = window.location.pathname; // e.g., "/embed/test"
      window.parent.postMessage(
        { type: 'zyrex-embed-height', id, height },
        '*'
      );
      // Development only log
      if (process.env.NODE_ENV === 'development') {
        console.log(`[EmbedShell] Sent height: ${height} for ${id}`);
      }
    };

    // Initial attempts after load and fonts ready
    const handleLoad = () => {
      // Wait a bit for initial render
      setTimeout(sendHeight, 0);
    };

    const handleFontsReady = async () => {
      try {
        if (document.fonts) {
          await document.fonts.ready;
          sendHeight();
        }
      } catch (e) {
        // Ignore if fonts API not available
        sendHeight();
      }
    };

    // Event listeners
    window.addEventListener('load', handleLoad);
    // Also send on DOMContentLoaded as fallback
    window.addEventListener('DOMContentLoaded', handleLoad);

    // ResizeObserver
    const resizeObserver = new ResizeObserver(sendHeight);
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    // Cleanup
    return () => {
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('DOMContentLoaded', handleLoad);
      resizeObserver.disconnect();
    };
  }, []);

  return <div ref={wrapperRef}>{children}</div>;
}