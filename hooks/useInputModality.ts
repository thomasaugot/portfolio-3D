"use client";

import { useEffect } from "react";

const KEYBOARD_KEYS = new Set([
  "Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
  "Home", "End", "PageUp", "PageDown", "Enter", " ",
]);

export function useInputModality() {
  useEffect(() => {
    const setKeyboard = (event: KeyboardEvent) => {
      if (!KEYBOARD_KEYS.has(event.key)) return;
      document.documentElement.dataset.inputModality = "keyboard";
    };
    const setPointer = () => {
      document.documentElement.dataset.inputModality = "pointer";
    };

    document.documentElement.dataset.inputModality = "pointer";
    window.addEventListener("keydown", setKeyboard, true);
    window.addEventListener("pointerdown", setPointer, true);
    window.addEventListener("touchstart", setPointer, true);

    return () => {
      window.removeEventListener("keydown", setKeyboard, true);
      window.removeEventListener("pointerdown", setPointer, true);
      window.removeEventListener("touchstart", setPointer, true);
    };
  }, []);
}
