"use client";

interface ProjectCounterProps {
  total: number;
}

export default function ProjectCounter({ total }: ProjectCounterProps) {
  return (
    <div
      data-project-counter
      className="fixed left-8 top-1/2 -translate-y-1/2 z-30 opacity-0 hidden lg:block"
    >
      <div className="flex flex-col items-center gap-3 py-8 px-4 bg-surface/50 backdrop-blur-sm rounded-full border border-border/50">
        {/* Current project number */}
        <div
          data-counter-number
          className="title-project"
        >
          01
        </div>

        {/* Divider */}
        <div className="w-px h-16 bg-gradient-to-b from-primary via-secondary to-primary opacity-50" />

        {/* Project name - vertical facing right */}
        <div
          data-counter-name
          className="text-label text-text/60"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          Client
        </div>

        {/* Divider */}
        <div className="w-px h-16 bg-gradient-to-b from-primary via-secondary to-primary opacity-50" />

        {/* Total projects */}
        <div
          data-counter-total
          className="text-label text-text/40"
        >
          {total.toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
}