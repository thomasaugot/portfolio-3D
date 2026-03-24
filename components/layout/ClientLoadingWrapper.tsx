"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useMemo } from "react";
import LoadingProvider from "@/contexts/LoadingProvider";

interface ClientLoadingWrapperProps {
  children: ReactNode;
}

export default function ClientLoadingWrapper({ children }: ClientLoadingWrapperProps) {
  const pathname = usePathname();

  const criticalScenes = useMemo(() => {
    // The hero scene (hex floor + laptop) must be ready before revealing the page
    return ["hero"];
  }, [pathname]);

  useEffect(() => {
    const keyboardKeys = new Set([
      "Tab",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
      "PageUp",
      "PageDown",
      "Enter",
      " ",
    ]);

    const setKeyboardModality = (event: KeyboardEvent) => {
      if (!keyboardKeys.has(event.key)) return;
      document.documentElement.dataset.inputModality = "keyboard";
    };

    const setPointerModality = () => {
      document.documentElement.dataset.inputModality = "pointer";
    };

    document.documentElement.dataset.inputModality = "pointer";

    window.addEventListener("keydown", setKeyboardModality, true);
    window.addEventListener("pointerdown", setPointerModality, true);
    window.addEventListener("touchstart", setPointerModality, true);

    return () => {
      window.removeEventListener("keydown", setKeyboardModality, true);
      window.removeEventListener("pointerdown", setPointerModality, true);
      window.removeEventListener("touchstart", setPointerModality, true);
    };
  }, []);

  return (
    <LoadingProvider criticalScenes={criticalScenes}>
      {children}
    </LoadingProvider>
  );
}
