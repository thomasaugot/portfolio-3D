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
    <div className="relative" data-stats-wrapper>
      <div 
        data-stats-glow
        className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-3xl blur-2xl opacity-0"
      />
      
      <div className="absolute -inset-[1px] bg-gradient-to-r from-primary via-secondary to-primary rounded-3xl opacity-60" />
      
      <div className="relative flex flex-col md:flex-row items-center justify-center gap-12 p-12 rounded-3xl bg-bg backdrop-blur-xl">
        {stats.map((stat, index) => (
          <React.Fragment key={stat.label}>
            <div 
              data-stat 
              className="text-center relative group cursor-default" 
              data-index={index}
            >
              <div className="absolute inset-0 bg-primary/5 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-300 -m-4" />
              <div className="relative">
                <div className={`font-bold gradient-primary bg-clip-text text-transparent mb-2 ${stat.isSmall ? 'text-3xl' : 'text-6xl'}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-text-muted uppercase tracking-wider font-mono">
                  {stat.label}
                </div>
              </div>
            </div>
            {index < stats.length - 1 && (
              <div className="hidden md:block w-px h-20 bg-gradient-to-b from-transparent via-border to-transparent" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}