// components/Stats/Stats.tsx
import React from "react";

interface Stat {
  value: string;
  label: string;
  isSmall?: boolean;
}

interface StatsProps {
  stats: Stat[];
}

export default function Stats({ stats }: StatsProps) {
  return (
    <div className="relative md:pt-20" data-stats-wrapper>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[200px] bg-primary/8 rounded-full blur-[80px]" />
      </div>
      
      <div className="relative flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            data-stat
            className="text-center relative"
            data-index={index}
          >
            <div className={`font-bold gradient-primary bg-clip-text text-transparent mb-3 ${stat.isSmall ? 'text-3xl md:text-4xl' : 'title-section'}`}>
              {stat.value}
            </div>
            <div className="text-label">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}