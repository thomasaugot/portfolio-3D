"use client";

import { useThreeScene } from "@/hooks/useThreeScene";
import { initHero3DScene } from "@/utils/animations/hero-3d-scene";

export default function HeroSection() {
  const containerRef = useThreeScene(initHero3DScene, "hero");

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#1e1e1e]" data-hero-section>
      <div className="hidden" data-hero-content data-hero-bg data-laptop />

      {/* Background gradient */}
      <div data-hero-backdrop className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#252525] via-[#1e1e1e] to-[#1a1a1a]" />
      </div>

      {/* 3D scene container */}
      <div
        ref={containerRef}
        data-hero-3d
        className="absolute inset-0 z-0"
      />

      <div data-hero-branding className="hidden" />
    </div>
  );
}
