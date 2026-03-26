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
      className={`keyboard-focus-ring pointer-events-auto h-14 items-center justify-center gap-1 touch-manipulation ${className}`}
      aria-label="Toggle menu"
      aria-expanded={isMobileMenuOpen}
      aria-controls="mobile-menu"
      style={style}
    >
      <span className={`font-mono text-3xl font-light transition-all duration-500 ${isMobileMenuOpen ? "text-secondary" : "text-primary"}`}>
        {"{"}
      </span>

      <div className="flex items-center gap-1">
        <span className={`rounded-full bg-primary transition-all duration-500 ease-out origin-center ${isMobileMenuOpen ? "w-4 h-[2px] rotate-45 -mr-3" : "w-1.5 h-1.5"}`} />
        <span className={`rounded-full bg-secondary transition-all duration-500 ease-out ${isMobileMenuOpen ? "w-0 h-0 opacity-0" : "w-1.5 h-1.5 opacity-100"}`} />
        <span className={`rounded-full bg-primary transition-all duration-500 ease-out origin-center ${isMobileMenuOpen ? "w-4 h-[2px] -rotate-45 -ml-3" : "w-1.5 h-1.5"}`} />
      </div>

      <span className={`font-mono text-3xl font-light transition-all duration-500 ${isMobileMenuOpen ? "text-secondary" : "text-primary"}`}>
        {"}"}
      </span>
    </button>
  );
}
