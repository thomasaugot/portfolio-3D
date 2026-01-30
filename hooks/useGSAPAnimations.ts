"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@/lib/gsap";
export function useGSAPAnimations(initFunction: () => void | (() => void)) {
  const hasRunRef = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useGSAP(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;
    const cleanup = initFunction();
    return () => {
      if (typeof cleanup === "function") {
        cleanup();
      }
    };
  }, []);
}
