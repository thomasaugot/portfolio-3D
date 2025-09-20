export default function SkillsSection() {
  return (
    <section className="py-32 bg-surface/50">
      <div className="max-w-6xl mx-auto px-8">
        <div data-animate="slide-up" className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold font-inter mb-6">
            Technical Expertise
          </h2>
          <p className="text-xl text-text-muted">
            Specialized in modern technologies and frameworks
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div data-animate="slide-up" className="group p-8 bg-bg border border-border rounded-xl hover:border-electric-blue/50 transition-all duration-300">
            <div className="w-12 h-12 bg-electric-blue/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-electric-blue/20 transition-colors">
              <div className="w-6 h-6 bg-electric-blue rounded" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Frontend Development</h3>
            <p className="text-text-muted mb-4">React, Next.js, TypeScript, Tailwind CSS, GSAP</p>
            <div className="text-sm text-electric-blue font-mono">Primary Focus</div>
          </div>
          
          <div data-animate="slide-up" className="group p-8 bg-bg border border-border rounded-xl hover:border-violet/50 transition-all duration-300">
            <div className="w-12 h-12 bg-violet/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-violet/20 transition-colors">
              <div className="w-6 h-6 bg-violet rounded" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Backend Development</h3>
            <p className="text-text-muted mb-4">Node.js, Python, APIs, Databases, Cloud Services</p>
            <div className="text-sm text-violet font-mono">Full-Stack Ready</div>
          </div>
          
          <div data-animate="slide-up" className="group p-8 bg-bg border border-border rounded-xl hover:border-pink/50 transition-all duration-300">
            <div className="w-12 h-12 bg-pink/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-pink/20 transition-colors">
              <div className="w-6 h-6 bg-pink rounded" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Solution Architecture</h3>
            <p className="text-text-muted mb-4">System Design, Performance, Scalability, Best Practices</p>
            <div className="text-sm text-pink font-mono">End-to-End</div>
          </div>
        </div>
      </div>
    </section>
  )
}