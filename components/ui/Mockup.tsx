import Image from "next/image";
import type { MockupProps } from "@/types/mockup";

export function Mockup({ variant, src, alt, className = "" }: MockupProps) {
  
  if (variant === "laptop") {
    return (
      <div className={`relative w-full ${className}`}>
        <div className="relative" style={{ aspectRatio: "16/10" }}>
          <div className="absolute inset-0 rounded-2xl bg-[#1a1a1a] shadow-2xl" style={{ padding: "3.5%" }}>
            <div className="absolute inset-0 rounded-2xl opacity-30 blur-xl" style={{ background: "radial-gradient(circle, rgba(2,188,204,0.3), transparent 70%)" }} />
            <div className="relative w-full h-full rounded-lg overflow-hidden bg-black">
              <Image src={src} alt={alt} fill className="object-contain" sizes="(max-width: 768px) 100vw, 1200px" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.1), transparent 50%)" }} />
            </div>
            <div className="absolute top-[1.5%] left-1/2 -translate-x-1/2 w-[15%] h-[2%] bg-black rounded-full flex items-center justify-center">
              <div className="w-[8%] h-[40%] rounded-full bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div className={`relative w-full ${className}`} style={{ aspectRatio: "9/19.5" }}>
        <div className="absolute inset-0 rounded-[1.25rem] sm:rounded-[1.75rem] md:rounded-[2.5rem] bg-[#1a1a1a]" style={{ padding: "2.5%", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)" }}>
          <div className="absolute inset-0 rounded-[1.25rem] sm:rounded-[1.75rem] md:rounded-[2.5rem] opacity-20 blur-2xl" style={{ background: "radial-gradient(circle, rgba(204,255,2,0.4), transparent 70%)" }} />
          <div className="relative w-full h-full rounded-[1rem] sm:rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-black">
            <Image src={src} alt={alt} fill className="object-contain" sizes="400px" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08), transparent 60%)" }} />
          </div>
          <div className="absolute top-[3%] left-1/2 -translate-x-1/2 w-[30%] h-[2.5%] bg-black rounded-full flex items-center justify-center gap-2">
            <div className="w-[15%] h-[35%] rounded-full bg-gray-900" />
            <div className="w-[8%] h-[8%] rounded-full bg-gray-900" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "tablet") {
    return (
      <div className={`relative w-full ${className}`} style={{ aspectRatio: "4/3" }}>
        <div className="absolute inset-0 rounded-3xl bg-[#1a1a1a]" style={{ padding: "3%", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7)" }}>
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black">
            <Image src={src} alt={alt} fill className="object-contain" sizes="800px" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06), transparent 50%)" }} />
          </div>
          <div className="absolute top-[1%] left-1/2 -translate-x-1/2 w-[1.5%] h-[1.5%] rounded-full bg-gray-900" />
        </div>
      </div>
    );
  }

  if (variant === "desktop") {
    return (
      <div className={`relative w-full ${className}`}>
        <div className="relative w-full" style={{ aspectRatio: "16/10" }}>
          <div className="absolute inset-0 rounded-2xl bg-[#1a1a1a]" style={{ padding: "2%", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)" }}>
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
              <Image src={src} alt={alt} fill className="object-contain" sizes="1400px" />
              <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle, rgba(2,188,204,0.3), transparent 60%)" }} />
            </div>
          </div>
        </div>
        <div className="relative w-full flex flex-col items-center">
          <div className="w-[4%] h-[40px] bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a]" />
          <div className="w-[25%] h-[15px] rounded-full bg-[#1a1a1a]" style={{ boxShadow: "0 5px 15px rgba(0,0,0,0.5)" }} />
        </div>
      </div>
    );
  }

  if (variant === "browser") {
    return (
      <div className={`relative w-full rounded-2xl overflow-hidden bg-[#1a1a1a] ${className}`} style={{ boxShadow: "0 25px 50px -12px rgba(0,0,0,0.8)" }}>
        <div className="flex items-center gap-3 px-4 py-3 border-b bg-[#2a2a2a] border-[#3a3a3a]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#3a3a3a]">
            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-label text-text/50">yourproject.com</span>
          </div>
        </div>
        <div className="relative w-full" style={{ aspectRatio: "16/10" }}>
          <Image src={src} alt={alt} fill className="object-contain" sizes="1200px" />
        </div>
      </div>
    );
  }

  return null;
}