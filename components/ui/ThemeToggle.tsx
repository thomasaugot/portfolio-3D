"use client";

import { useEffect, useRef, useCallback } from "react";
import { IoSunny, IoMoon } from "react-icons/io5";
import { 
  initThemeToggleIdle, 
  snapThemeTogglePosition, 
  animateThemeToggleFlip 
} from "@/utils/animations/theme-toggle-animations";
import { useTheme } from "@/lib/providers/ThemeProvider";

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
          {/* Front face - Moon (Dark mode) */}
          <div
            style={{
              position: "absolute",
              width: `${size}px`,
              height: `${size}px`,
              transform: `translateZ(${size / 2}px)`,
              padding: "4px",
              background:
                "linear-gradient(222deg, var(--theme-secondary) 67.22%, var(--theme-primary) 93.57%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              className="bg-bg"
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IoMoon size={size * 0.6} className="text-text drop-shadow-lg" />
            </div>
          </div>

          {/* Top face - Sun (Light mode) */}
          <div
            style={{
              position: "absolute",
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateX(90deg) translateZ(${size / 2}px)`,
              padding: "4px",
              background:
                "linear-gradient(222deg, var(--theme-primary) 67.22%, var(--theme-secondary) 93.57%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              className="bg-bg"
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IoSunny
                size={size * 0.6}
                className="text-text drop-shadow-lg"
              />
            </div>
          </div>

          {/* Right face */}
          <div
            style={{
              position: "absolute",
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateY(90deg) translateZ(${size / 2}px)`,
              padding: "3px",
              background:
                "linear-gradient(45deg, var(--theme-primary) 30%, var(--theme-secondary) 70%)",
            }}
          >
            <div className="w-full h-full bg-bg" />
          </div>

          {/* Left face */}
          <div
            style={{
              position: "absolute",
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateY(-90deg) translateZ(${size / 2}px)`,
              padding: "3px",
              background:
                "linear-gradient(135deg, var(--theme-secondary) 40%, var(--theme-primary) 60%)",
            }}
          >
            <div className="w-full h-full bg-bg" />
          </div>

          {/* Back face */}
          <div
            style={{
              position: "absolute",
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateY(180deg) translateZ(${size / 2}px)`,
              padding: "3px",
              background:
                "linear-gradient(42deg, var(--theme-secondary) 6.43%, var(--theme-primary) 22.78%)",
            }}
          >
            <div className="w-full h-full bg-bg" />
          </div>

          {/* Bottom face */}
          <div
            style={{
              position: "absolute",
              width: `${size}px`,
              height: `${size}px`,
              transform: `rotateX(-90deg) translateZ(${size / 2}px)`,
              padding: "3px",
              background:
                "linear-gradient(315deg, var(--theme-primary) 50%, var(--theme-secondary) 50%)",
            }}
          >
            <div className="w-full h-full bg-bg" />
          </div>
        </div>
      </button>
    </div>
  );
}