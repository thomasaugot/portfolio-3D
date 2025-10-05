"use client";

import { useEffect, useRef, useCallback } from "react";
import { IoSunny, IoMoon } from "react-icons/io5";
import { useTheme } from "./ThemeProvider";
import { 
  initThemeToggleIdle, 
  snapThemeTogglePosition, 
  animateThemeToggleFlip 
} from "@/utils/animations/theme-toggle-animations";

type Props = {
  size?: number;
};

export function ThemeToggle({ size = 50 }: Props) {
  const { theme, setTheme } = useTheme();
  const cubeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cubeRef.current || !containerRef.current) return;

    const ctx = initThemeToggleIdle(cubeRef.current, containerRef.current, theme);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!cubeRef.current) return;
    snapThemeTogglePosition(cubeRef.current, theme);
  }, [theme]);

  const handleClick = useCallback(() => {
    if (!cubeRef.current) return;

    const nextTheme = theme === "light" ? "dark" : "light";

    animateThemeToggleFlip(cubeRef.current, theme, () => {
      setTheme(nextTheme);
    });
  }, [theme, setTheme]);

  return (
    <div ref={containerRef} style={{ perspective: "500px" }}>
      <button
        onClick={handleClick}
        className="block focus:outline-none"
        style={{ width: `${size}px`, height: `${size}px` }}
        aria-label="Toggle theme"
      >
        <div
          ref={cubeRef}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            position: "relative",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: `${size}px`,
              height: `${size}px`,
              transform: `translateZ(${size / 2}px)`,
              padding: "4px",
              background:
                "linear-gradient(222deg, var(--secondary-color-1) 67.22%, var(--primary-color-1) 93.57%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "var(--color-black)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IoMoon size={size * 0.6} className="text-white drop-shadow-lg" />
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateX(90deg) translateZ(${size / 2}px)`,
              padding: "4px",
              background:
                "linear-gradient(222deg, var(--primary-color-1) 67.22%, var(--secondary-color-1) 93.57%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "var(--color-black)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IoSunny
                size={size * 0.6}
                className="text-white drop-shadow-lg"
              />
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateY(90deg) translateZ(${size / 2}px)`,
              padding: "3px",
              background:
                "linear-gradient(45deg, var(--primary-color-1) 30%, var(--secondary-color-1) 70%)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "var(--color-black)",
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateY(-90deg) translateZ(${size / 2}px)`,
              padding: "3px",
              background:
                "linear-gradient(135deg, var(--secondary-color-1) 40%, var(--primary-color-1) 60%)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "var(--color-black)",
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateY(180deg) translateZ(${size / 2}px)`,
              padding: "3px",
              background:
                "linear-gradient(42deg, var(--secondary-color-1) 6.43%, var(--primary-color-1) 22.78%)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "var(--color-black)",
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateX(-90deg) translateZ(${size / 2}px)`,
              padding: "3px",
              background:
                "linear-gradient(315deg, var(--primary-color-1) 50%, var(--secondary-color-1) 50%)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "var(--color-black)",
              }}
            />
          </div>
        </div>
      </button>
    </div>
  );
}