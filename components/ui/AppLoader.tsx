"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/utils/animations/gsap-init";

export default function AppLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-animate='logo']",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 1, ease: "power3.out" }
      );
      gsap.to("[data-animate='bar']", {
        scaleX: 1,
        duration: 2,
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
      });
    }, loaderRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[99999] h-scren w-screen flex flex-col items-center justify-center bg-black text-white"
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
