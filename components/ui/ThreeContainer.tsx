"use client";

import { RefObject } from "react";

interface ThreeContainerProps {
  containerRef: RefObject<HTMLDivElement | null>;
  name: string;
}

export default function ThreeContainer({ containerRef, name }: ThreeContainerProps) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div
        ref={containerRef}
        data-3d-container={name}
        className="w-full h-full"
      />
    </div>
  );
}
