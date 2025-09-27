"use client";

import { useEffect, useRef } from "react";
import { initLoaderAnimations } from "@/utils/animations/loader-animations";

export default function AppLoader() {
  const loaderRef: any = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanup = initLoaderAnimations(loaderRef);
    return cleanup;
  }, []);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[99999] h-screen w-screen flex flex-col items-center justify-center bg-black text-white"
    >
      <div data-animate="logo" className="text-4xl font-bold mb-8">
        loading ...
      </div>
      <div className="w-40 h-1 bg-white/20 overflow-hidden rounded-full">
        <div
          data-animate="bar"
          className="h-full w-full bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] origin-left scale-x-0"
        />
      </div>
    </div>
  );
}