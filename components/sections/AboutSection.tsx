"use client";

import AboutPortrait from "@/components/ui/AboutPortrait";

export default function AboutSection() {
  return (
    <div
      className="fixed inset-0 z-20 pointer-events-none"
      style={{ visibility: "hidden", opacity: 0 }}
      data-about-section
      aria-hidden="true"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 h-full relative">
        <div className="desktop-layout-only absolute left-1/2 -translate-x-[145%] xl:left-16 xl:translate-x-0 top-1/2 -translate-y-1/2 pointer-events-auto">
          <AboutPortrait visible={true} desktop={true} />
        </div>
      </div>
    </div>
  );
}
