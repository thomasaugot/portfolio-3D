"use client";

import { useThreeScene } from "@/hooks/useThreeScene";
import { initHero3DScene } from "@/utils/animations/hero-3d-scene";

export default function HeroSection() {
  const containerRef = useThreeScene(initHero3DScene, "hero");

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-bg"
      data-hero-section
      aria-hidden="true"
    >
      <div className="hidden" data-hero-content data-hero-bg data-laptop />

      {/* Background gradient */}
      <div data-hero-backdrop className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-bg-surface via-bg to-bg-surface" />
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
