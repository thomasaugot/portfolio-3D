"use client";

import Image from "next/image";
import { useTranslation } from "@/contexts/TranslationProvider";
import { useEffect, useRef } from "react";

interface AboutPortraitProps {
  visible: boolean;
  desktop?: boolean;
}

export default function AboutPortrait({ visible, desktop = false }: AboutPortraitProps) {
  const { t } = useTranslation();
  const cardRef  = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef<number>(0);
  const tilt     = useRef({ rx: 0, ry: 0, trx: 0, try: 0 });
  const hovered  = useRef(false);
  const hoverAmt = useRef(0);

  useEffect(() => {
    if (!desktop) return;
    const card  = cardRef.current;
    const glare = glareRef.current;
    if (!card) return;

    const face   = card.querySelector<HTMLElement>(".about-portrait-card__face");
    const glass  = card.querySelector<HTMLElement>(".about-portrait-card__glass");
    const fInner = card.querySelector<HTMLElement>(".about-portrait-frame--inner");
    const fEcho  = card.querySelector<HTMLElement>(".about-portrait-frame--echo");
    const fOuter = card.querySelector<HTMLElement>(".about-portrait-frame--outer");

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const inside = e.clientX >= rect.left && e.clientX <= rect.right
                  && e.clientY >= rect.top  && e.clientY <= rect.bottom;
      hovered.current = inside;
      if (inside) {
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        tilt.current.trx = -y * 8;
        tilt.current.try =  x * 10;
        if (glare) {
          glare.style.background = `radial-gradient(circle at ${(x+0.5)*100}% ${(y+0.5)*100}%, rgba(255,255,255,0.15) 0%, transparent 65%)`;
          glare.style.opacity = "1";
        }
      } else {
        tilt.current.trx = 0;
        tilt.current.try = 0;
        if (glare) glare.style.opacity = "0";
      }
    };
    window.addEventListener("mousemove", onMove);

    const tick = () => {
      rafRef.current = requestAnimationFrame(tick);
      tilt.current.rx += (tilt.current.trx - tilt.current.rx) * 0.08;
      tilt.current.ry += (tilt.current.try - tilt.current.ry) * 0.08;
      const h = hoverAmt.current;
      hoverAmt.current += ((hovered.current ? 1 : 0) - h) * 0.07;

      card.style.transform = `rotateX(${tilt.current.rx - 4*h}deg) rotateY(${tilt.current.ry + 8*h}deg)`;
      if (face)   face.style.transform   = `translate3d(0, ${-4*h}px, ${40*h}px)`;
      if (fInner) fInner.style.transform = `translate3d(0, ${-2*h}px, ${8*h}px)`;
      if (fEcho)  fEcho.style.transform  = `translate3d(0,  ${0}px,   ${-18*h}px) rotateZ(-4deg)`;
      if (fOuter) fOuter.style.transform = `translate3d(0,  ${1*h}px, ${-40*h}px)`;
      if (glass)  glass.style.transform  = `translate3d(0,  ${2*h}px, ${-10 - 50*h}px)`;
    };
    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
    };
  }, [desktop]);

  if (!visible) return null;

  // ── Desktop version ───────────────────────────────────────────────
  if (desktop) {
    return (
      <div
        data-about-portrait
        className="relative h-[420px] xl:h-[600px] flex items-center justify-center"
        style={{ perspective: "320px" }}
      >
        <div className="about-portrait-card__glow" aria-hidden="true" />
        <div
          ref={cardRef}
          className="about-portrait-card relative"
          data-about-portrait-card
          style={{ transformStyle: "preserve-3d", transition: "none" }}
        >
          <div className="about-portrait-frame about-portrait-frame--outer" aria-hidden="true" />
          <div className="about-portrait-frame about-portrait-frame--inner" aria-hidden="true" />
          <div className="about-portrait-frame about-portrait-frame--echo" aria-hidden="true" />
          <div className="about-portrait-card__glass" aria-hidden="true" />
          <div className="about-portrait-card__face relative">
            <Image
              src="/assets/images/portrait/portrait.webp"
              alt={t("about.name")}
              fill
              className="about-portrait-card__image object-contain object-[44%_100%]"
              priority
            />
          </div>
        </div>
      </div>
    );
  }

  // ── Panel / mobile version ────────────────────────────────────────
  return (
    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border animate-fadeIn [html[data-theme='light']_&]:border-b-[#d1c2aa]">
      <div className="relative w-28 h-28 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-[linear-gradient(180deg,rgba(16,185,129,0.04),rgba(245,158,11,0.06))] shadow-[0_10px_30px_rgba(16,185,129,0.08)] [html[data-theme='light']_&]:border-[#ccb99b]">
        <Image
          src="/assets/images/portrait/portrait.webp"
          alt={t("about.name")}
          fill
          className="object-cover object-[center_22%]"
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-text">{t("about.name")}</p>
        <p className="text-xs text-primary font-mono mt-1">{t("hero.role")}</p>
      </div>
    </div>
  );
}
