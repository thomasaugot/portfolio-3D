"use client";

import { type RefObject, type CSSProperties } from "react";

interface Props {
  toggleButtonRef: RefObject<HTMLButtonElement | null>;
  ignoreNextToggleClickRef: RefObject<boolean>;
  isMobileMenuOpen: boolean;
  onToggle: () => void;
  className?: string;
  style?: CSSProperties;
}

export default function MobileToggleButton({
  toggleButtonRef,
  ignoreNextToggleClickRef,
  isMobileMenuOpen,
  onToggle,
  className,
  style,
}: Props) {
  const handleClick = () => {
    if (ignoreNextToggleClickRef.current) {
      ignoreNextToggleClickRef.current = false;
      return;
    }
    onToggle();
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    event.preventDefault();
    ignoreNextToggleClickRef.current = true;
    onToggle();
  };

  return (
    <button
      ref={toggleButtonRef}
      type="button"
      onClick={handleClick}
      onTouchEnd={handleTouchEnd}
      className={`keyboard-focus-ring pointer-events-auto inline-flex h-12 items-center justify-center gap-2.5 px-2 touch-manipulation ${className}`}
      aria-label="Toggle menu"
      aria-expanded={isMobileMenuOpen}
      aria-controls="mobile-menu"
      style={style}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-text/55">Menu</span>

      <div className="relative h-3.5 w-3.5">
        <span className={`absolute left-1/2 top-1/2 h-[2px] rounded-full bg-primary transition-all duration-400 ease-out ${
          isMobileMenuOpen ? "w-3.5 -translate-x-1/2 -translate-y-1/2 rotate-45" : "w-3.5 -translate-x-1/2 -translate-y-[5px]"
        }`} />
        <span className={`absolute left-1/2 top-1/2 h-[2px] rounded-full bg-secondary transition-all duration-300 ease-out ${
          isMobileMenuOpen ? "w-0 -translate-x-1/2 -translate-y-1/2 opacity-0" : "w-3.5 -translate-x-1/2 -translate-y-1/2 opacity-100"
        }`} />
        <span className={`absolute left-1/2 top-1/2 h-[2px] rounded-full bg-primary transition-all duration-400 ease-out ${
          isMobileMenuOpen ? "w-3.5 -translate-x-1/2 -translate-y-1/2 -rotate-45" : "w-3.5 -translate-x-1/2 translate-y-[3px]"
        }`} />
      </div>
    </button>
  );
}
