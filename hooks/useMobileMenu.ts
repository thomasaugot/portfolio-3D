"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "@/lib/gsap";
import { initMobileMenuOpen } from "@/utils/animations/navbar-mobile-menu";

export function useMobileMenu(isDesktop: boolean) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<HTMLButtonElement[]>([]);
  const restoreFocusRef = useRef(false);
  const ignoreNextToggleClickRef = useRef(false);

  const getMenuFocusableElements = useCallback(() => {
    if (!menuRef.current) return [] as HTMLElement[];
    return Array.from(
      menuRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      )
    );
  }, []);

  // Close menu when switching to desktop
  useEffect(() => {
    if (isDesktop && isMobileMenuOpen) setIsMobileMenuOpen(false);
  }, [isDesktop, isMobileMenuOpen]);

  // Body scroll lock + initial focus
  useEffect(() => {
    if (isDesktop) return;

    const previousOverflow = document.body.style.overflow;

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const focusTarget = getMenuFocusableElements()[0];
      window.setTimeout(() => focusTarget?.focus(), 60);
    } else {
      document.body.style.overflow = previousOverflow;
    }

    return () => { document.body.style.overflow = previousOverflow; };
  }, [isMobileMenuOpen, isDesktop, getMenuFocusableElements]);

  // Restore focus to toggle button after close
  useEffect(() => {
    if (isMobileMenuOpen || !restoreFocusRef.current) return;
    restoreFocusRef.current = false;
    window.setTimeout(() => toggleButtonRef.current?.focus(), 0);
  }, [isMobileMenuOpen]);

  // Keyboard: Escape to close, Tab to trap focus
  useEffect(() => {
    if (!isMobileMenuOpen || isDesktop) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
        return;
      }

      if (event.key !== "Tab") return;

      const focusableItems = getMenuFocusableElements();
      if (focusableItems.length === 0) return;

      const first = focusableItems[0];
      const last = focusableItems[focusableItems.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen, isDesktop]); // eslint-disable-line react-hooks/exhaustive-deps

  // Animation on open
  useEffect(() => {
    if (!isMobileMenuOpen || !menuRef.current) return;
    initMobileMenuOpen(menuRef.current, itemsRef.current);
  }, [isMobileMenuOpen]);

  const closeMenu = useCallback((restoreFocus = false) => {
    restoreFocusRef.current = restoreFocus;

    if (menuRef.current) {
      gsap.killTweensOf(menuRef.current);
      gsap.killTweensOf(
        menuRef.current.querySelectorAll(
          "[data-ring-outer], [data-ring-middle], [data-menu-glow-1], [data-menu-glow-2]"
        )
      );
      itemsRef.current.forEach((item) => { if (item) gsap.killTweensOf(item); });
    }

    setIsMobileMenuOpen(false);
  }, []);

  const handleTogglePress = useCallback(() => {
    if (isMobileMenuOpen) closeMenu(true);
    else setIsMobileMenuOpen(true);
  }, [isMobileMenuOpen, closeMenu]);

  return {
    isMobileMenuOpen,
    menuRef,
    toggleButtonRef,
    itemsRef,
    ignoreNextToggleClickRef,
    closeMenu,
    handleTogglePress,
  };
}
