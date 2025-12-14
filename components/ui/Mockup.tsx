import Image from "next/image";
import type { MockupProps } from "@/types/mockup";

export function Mockup({ variant, src, alt, className = "" }: MockupProps) {
  if (variant === "laptop") {
    return (
      <div className={`relative w-full ${className}`}>
        <div className="relative" style={{ aspectRatio: "16/10" }}>
          <div
            className="absolute inset-0 rounded-2xl shadow-2xl bg-bg"
            style={{ padding: "3.5%" }}
          >
            <div className="absolute inset-0 rounded-2xl opacity-30 blur-xl bg-gradient-to-br from-secondary/30 to-transparent" />
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-bg">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            </div>
            <div className="absolute top-[1.5%] left-1/2 -translate-x-1/2 w-[15%] h-[2%] rounded-full flex items-center justify-center bg-bg">
              <div className="w-[8%] h-[40%] rounded-full bg-border" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div
        className={`relative w-full ${className}`}
        style={{ aspectRatio: "9/19.5" }}
      >
        <div
          className="absolute inset-0 rounded-[1.25rem] sm:rounded-[1.75rem] md:rounded-[2.5rem] bg-bg shadow-xl border border-border"
          style={{ padding: "2.5%" }}
        >
          <div className="absolute inset-0 rounded-[1.25rem] sm:rounded-[1.75rem] md:rounded-[2.5rem] opacity-20 blur-2xl bg-gradient-to-br from-primary/40 to-transparent" />
          <div className="relative w-full h-full rounded-[1rem] sm:rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-bg">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="400px"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-transparent" />
          </div>
          <div className="absolute top-[3%] left-1/2 -translate-x-1/2 w-[30%] h-[2.5%] rounded-full flex items-center justify-center gap-2 bg-bg">
            <div className="w-[15%] h-[35%] rounded-full bg-border" />
            <div className="w-[8%] h-[8%] rounded-full bg-border" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "tablet") {
    return (
      <div
        className={`relative w-full ${className}`}
        style={{ aspectRatio: "4/3" }}
      >
        <div
          className="absolute inset-0 rounded-3xl bg-bg shadow-2xl"
          style={{ padding: "3%" }}
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-bg">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              sizes="800px"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/6 to-transparent" />
          </div>
          <div className="absolute top-[1%] left-1/2 -translate-x-1/2 w-[1.5%] h-[1.5%] rounded-full bg-border" />
        </div>
      </div>
    );
  }

  if (variant === "desktop") {
    return (
      <div className={`relative w-full ${className}`}>
        <div className="relative w-full" style={{ aspectRatio: "16/10" }}>
          <div
            className="absolute inset-0 rounded-2xl bg-bg shadow-2xl"
            style={{ padding: "2%" }}
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-bg">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="1400px"
              />
              <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-secondary/30 to-transparent" />
            </div>
          </div>
        </div>
        <div className="relative w-full flex flex-col items-center">
          <div className="w-[4%] h-[40px] bg-gradient-to-b from-border to-bg" />
          <div className="w-[25%] h-[15px] rounded-full bg-bg shadow-lg" />
        </div>
      </div>
    );
  }

  if (variant === "browser") {
    return (
      <div
        className={`relative w-full rounded-2xl overflow-hidden bg-bg shadow-2xl ${className}`}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b bg-border/50 border-border">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg border border-border">
            <svg
              className="w-4 h-4 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span className="text-label text-text/50">yourproject.com</span>
          </div>
        </div>
        <div className="relative w-full" style={{ aspectRatio: "16/10" }}>
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            sizes="1200px"
          />
        </div>
      </div>
    );
  }

  return null;
}
