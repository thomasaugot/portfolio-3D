"use client";

import { useEffect, useRef } from "react";

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
  }, []);

  return (
    <section 
      data-projects-section
      className="relative min-h-screen flex items-center justify-center py-32"
    >
      <div
        ref={containerRef}
        data-3d-container="projects"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-bg/50 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-8 w-full">
        <div className="space-y-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-border glass mb-8">
              <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-mono uppercase tracking-wider font-medium text-muted">
                The Journey
              </span>
            </div>

            <h2 className="text-6xl md:text-8xl font-bold mb-8">
              From
              <br />
              <span className="gradient-primary bg-clip-text text-transparent font-light">
                Hospitality
              </span>
              <br />
              to Code
            </h2>
          </div>

          <div className="space-y-12 text-lg leading-relaxed text-text-muted">
            <p className="text-2xl text-text">
              I didn't start here. My career began in hospitality and customer service, navigating the chaos of busy restaurants and airport cabins. But something changed during the pandemic.
            </p>

            <p>
              While the world paused, I discovered coding. What started as curiosity quickly became obsession. I built my first website, then another, then mobile apps. Each line of code felt like solving a puzzle I didn't know I was meant to solve.
            </p>

            <p>
              <span className="text-text font-medium">From France to Spain, from Australia to the Canary Islands</span> — I've lived the nomadic life, always seeking new experiences. That same spirit of adventure drove me into tech. No bootcamp could contain what I wanted to learn, so I taught myself, project by project.
            </p>

            <p>
              Today, I build production applications for real companies. <span className="text-text font-medium">CRM systems with live dashboards. Mobile banking apps. Energy monitoring platforms.</span> Each project pushed me further than the last.
            </p>

            <p className="text-2xl text-text">
              I speak three languages fluently. I code in even more. And I'm just getting started.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-12">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
                2021
              </div>
              <div className="text-sm text-muted">
                First line of code
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
                2023
              </div>
              <div className="text-sm text-muted">
                First production app
              </div>
            </div>

            <div className="text-center space-y-2">
              <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
                Now
              </div>
              <div className="text-sm text-muted">
                Building the future
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}