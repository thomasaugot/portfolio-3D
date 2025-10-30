// components/ui/BlobCursor.tsx
"use client";

export default function BlobCursor() {
  return (
    <div
      data-blob-cursor
      className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 opacity-0"
    >
      <div className="relative w-[200px] h-[200px] flex items-center justify-center">
        {/* Background fill (bg-bg) */}
        <div 
          className="absolute inset-0 bg-bg z-[1]"
          style={{
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            animation: 'blobMorph 6s ease-in-out infinite'
          }}
        />
        
        {/* Gradient border */}
        <div 
          className="absolute -inset-1 z-0 blur-[2px]"
          style={{
            background: 'linear-gradient(135deg, #02bccc, #ccff02, #02bccc)',
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            animation: 'blobMorph 6s ease-in-out infinite'
          }}
        />
        
        {/* Content */}
        <div className="relative z-[2] flex flex-col items-center gap-2 px-5 py-4">
          <span className="font-mono text-[15px] font-bold uppercase tracking-wider bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
            View Details
          </span>
          <svg 
            className="w-[22px] h-[22px] stroke-primary"
            style={{
              animation: 'arrowBounce 1.5s ease-in-out infinite',
              filter: 'drop-shadow(0 0 4px rgba(2, 188, 204, 0.5))'
            }}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </div>
  );
}