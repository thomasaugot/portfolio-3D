"use client";

export default function ProjectsShowcase() {
  const projects = [
    {
      title: "DOS × DOS",
      client: "Internal CRM Platform",
      year: "2024",
      challenge: "Legacy CRM needed complete redesign for modern workflows",
      solution: "Built real-time dashboard with Redux state management, custom data viz, and role-based access",
      result: "40% increase in team efficiency",
      tech: ["Next.js 15", "TypeScript", "Redux", "Tailwind"],
      image: "/assets/images/portfolio/placeholder-1.jpg",
    },
    {
      title: "ENERGÍA SOLAR",
      client: "Solar Energy Company",
      year: "2024",
      challenge: "Monitor 50+ solar installations in real-time",
      solution: "Integrated 5+ APIs for live monitoring with predictive analytics and alert system",
      result: "99.9% uptime monitoring 50+ installations",
      tech: ["Next.js", "Redux", "WebSockets", "APIs"],
      image: "/assets/images/portfolio/placeholder-2.jpg",
    },
    {
      title: "GALAGA AGENCY",
      client: "Digital Agency Website",
      year: "2024",
      challenge: "Stand out in competitive agency market",
      solution: "Created cinematic scroll experience with GSAP animations and SEO optimization",
      result: "Featured on Awwwards, 95+ Lighthouse score",
      tech: ["Next.js 15", "GSAP", "Three.js", "SEO"],
      image: "/assets/images/portfolio/placeholder-3.jpg",
    },
    {
      title: "OSLY SOLUTIONS",
      client: "Building Access Startup",
      year: "2023",
      challenge: "Digitize building access control for modern residents",
      solution: "Built React Native app with offline-first architecture and biometric auth",
      result: "Live on App Store & Play Store, 1000+ users",
      tech: ["React Native", "TypeScript", "Supabase"],
      image: "/assets/images/portfolio/placeholder-1.jpg",
    },
  ];

  return (
    <section 
      data-projects-section
      className="relative min-h-[400vh] bg-bg z-50"
    >
      <div className="sticky top-0 h-screen overflow-hidden" style={{ perspective: '2000px' }}>
        <div className="absolute top-12 left-16 z-50">
          <h2 className="text-6xl font-bold gradient-primary bg-clip-text text-transparent">
            Selected Work
          </h2>
          <p className="text-xl text-muted font-mono mt-4">
            Real projects, real impact
          </p>
        </div>

        {projects.map((project, index) => (
          <div
            key={index}
            data-project-panel={index}
            className="absolute inset-0 w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="relative w-full  h-full flex items-center justify-center px-16 bg-bg">
              <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center">
                <div 
                  data-project-image
                  className="relative"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="absolute -inset-8 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl blur-3xl" />
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-primary/20">
                    <img 
                      src={project.image}
                      alt={project.title}
                      className="w-full h-[500px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                  </div>
                </div>

                <div 
                  data-project-content
                  className="space-y-8"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div>
                    <div className="text-sm font-mono text-primary mb-4 tracking-widest uppercase">
                      {project.year} • {project.client}
                    </div>
                    
                    <h3 className="text-7xl md:text-8xl font-bold mb-8 leading-none gradient-primary bg-clip-text text-transparent">
                      {project.title}
                    </h3>
                  </div>

                  <div className="backdrop-blur-md bg-surface/20 p-8 rounded-3xl space-y-6">
                    <div>
                      <div className="text-xs font-mono text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        Challenge
                      </div>
                      <p className="text-lg text-text leading-relaxed">
                        {project.challenge}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs font-mono text-secondary uppercase tracking-wider mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                        Solution
                      </div>
                      <p className="text-lg text-text leading-relaxed">
                        {project.solution}
                      </p>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border-l-4 border-primary">
                      <div className="text-xs font-mono text-muted uppercase tracking-wider mb-2">
                        Result
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {project.result}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-wrap">
                    {project.tech.map(tag => (
                      <span 
                        key={tag}
                        className="px-4 py-2 text-sm font-mono bg-surface/50 backdrop-blur-sm rounded-xl border border-border/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}