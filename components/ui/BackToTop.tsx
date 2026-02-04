"use client";

import { ChevronUp } from "lucide-react";
import { useCanva } from "@/components/ui/Canva";

export default function BackToTop() {
  const { stage, heroReady, isMorphing, goToHero } = useCanva();

  const visible = heroReady && stage !== "hero" && !isMorphing;

  if (!heroReady) return null;

  return (
    <button
      onClick={() => {
        if (!isMorphing) goToHero();
      }}
      disabled={isMorphing}
      aria-label="Back to top"
      className={`fixed bottom-12 md:bottom-6 right-6 md:right-auto md:left-6 z-[100002] p-3 rounded-xl
        bg-white/5 border border-white/10 text-primary backdrop-blur-sm
        transition-all duration-300 ease-out
        hover:bg-white/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10
        active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed
        ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}
    >
      <ChevronUp size={20}/>
    </button>
  );
}
