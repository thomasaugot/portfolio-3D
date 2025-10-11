"use client";
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/animations';

export default function PortfolioDetail() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-screen]').forEach((screen: any, i) => {
        gsap.from(screen, {
          scale: 0.85,
          opacity: 0,
          y: 100,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: screen,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const screenshots = [
    '/assets/images/portfolio/energia-solar-canarias/energia-solar-canarias-1.png',
    '/assets/images/portfolio/energia-solar-canarias/energia-solar-canarias-2.png',
    '/assets/images/portfolio/energia-solar-canarias/energia-solar-canarias-3.png',
    '/assets/images/portfolio/energia-solar-canarias/energia-solar-canarias-4.png',
    '/assets/images/portfolio/energia-solar-canarias/energia-solar-canarias-5.png',
    '/assets/images/portfolio/energia-solar-canarias/energia-solar-canarias-6.png',
    '/assets/images/portfolio/energia-solar-canarias/energia-solar-canarias-7.png',
    '/assets/images/portfolio/energia-solar-canarias/energia-solar-canarias-8.png',
    '/assets/images/portfolio/energia-solar-canarias/energia-solar-canarias-9.png',
  ];

  return (
    <div ref={containerRef} className="bg-bg text-text">
      <section className="min-h-screen flex items-center justify-center px-16">
        <div className="max-w-7xl w-full">
          <div className="glass inline-flex items-center gap-3 px-6 py-3 rounded-2xl border border-border backdrop-blur-xl bg-bg/5 mb-8">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-mono uppercase tracking-wider text-muted">CRM Platform · 2025</span>
          </div>
          
          <h1 className="text-8xl font-bold leading-tight mb-8">
            <span className="block text-text">Solar Plant</span>
            <span className="block gradient-primary bg-clip-text text-transparent font-light">Monitoring CRM</span>
          </h1>

          <p className="text-2xl text-text-muted mb-12 max-w-3xl">
            Unified platform for Energía Solar Canarias consolidating Victron, SolarEdge, and GoodWe
          </p>

          <div className="grid grid-cols-3 gap-8 max-w-2xl">
            <div className="glass p-6 rounded-2xl border border-border backdrop-blur-xl bg-bg/5 text-center">
              <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">3</div>
              <div className="text-sm text-muted">Providers</div>
            </div>
            <div className="glass p-6 rounded-2xl border border-border backdrop-blur-xl bg-bg/5 text-center">
              <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">2</div>
              <div className="text-sm text-muted">Roles</div>
            </div>
            <div className="glass p-6 rounded-2xl border border-border backdrop-blur-xl bg-bg/5 text-center">
              <div className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-2">Native</div>
              <div className="text-sm text-muted">Apps</div>
            </div>
          </div>
        </div>
      </section>

      {screenshots.map((src, i) => (
        <section key={i} className="min-h-screen flex items-center justify-center px-16 py-32">
          <div className="max-w-6xl w-full">
            <div data-screen className="relative">
              <div className="absolute -inset-12 bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-50" />
              <div className="relative glass border-2 border-border rounded-3xl overflow-hidden backdrop-blur-xl bg-bg/5 shadow-2xl">
                <img src={src} alt={`Screenshot ${i + 1}`} className="w-full" />
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="min-h-screen flex items-center justify-center px-16">
        <div className="max-w-4xl text-center space-y-8">
          <h2 className="text-7xl font-bold gradient-primary bg-clip-text text-transparent">Ready?</h2>
          <div className="flex gap-6 justify-center">
            <button className="px-10 py-5 bg-primary text-bg font-semibold text-lg rounded-xl">
              View Live
            </button>
            <button className="px-10 py-5 glass border border-border rounded-xl font-semibold text-lg backdrop-blur-xl bg-bg/5">
              Next Project
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}