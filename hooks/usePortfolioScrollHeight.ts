"use client";

import { useEffect } from "react";

export function usePortfolioScrollHeight(projectCount: number) {
  useEffect(() => {
    const updateScrollHeight = () => {
      const multiplier = window.innerWidth < 768 ? 100 : 300;
      const section = document.querySelector("[data-portfolio-section]") as HTMLElement;
      if (section) {
        section.style.setProperty(
          "--portfolio-height",
          `${(projectCount + 1) * multiplier}vh`
        );
      }
    };

    updateScrollHeight();
    window.addEventListener("resize", updateScrollHeight);
    return () => window.removeEventListener("resize", updateScrollHeight);
  }, [projectCount]);
}
