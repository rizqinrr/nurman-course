"use client";

import { useEffect, useState } from "react";

export default function useClock(intervalMs = 60_000) {
  const [nowMs, setNowMs] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setNowMs(Date.now());
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") update();
    };
    const initialTimer = setTimeout(update, 0);
    const timer = setInterval(update, intervalMs);
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(timer);
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [intervalMs]);

  return nowMs;
}
