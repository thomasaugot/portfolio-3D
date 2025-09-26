"use client";

import { useEffect, useState } from "react";

export function useAppReady(tasks: (() => Promise<void>)[]) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadAll() {
      try {
        await Promise.all(tasks.map((task) => task()));
        if (mounted) setIsReady(true);
      } catch (e) {
        console.error("Preload failed:", e);
        if (mounted) setIsReady(true); // fail gracefully
      }
    }

    loadAll();
    return () => {
      mounted = false;
    };
  }, [tasks]);

  return isReady;
}
