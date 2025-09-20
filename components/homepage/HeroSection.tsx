export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,212,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,212,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />
      </div>
      
      <div className="max-w-6xl mx-auto px-8 text-center relative z-10">
        <div data-animate="slide-up" className="mb-8">
          <span className="text-sm font-mono text-text-muted tracking-wider uppercase">
            Full-Stack Developer
          </span>
        </div>
        
        <h1 
          data-animate="slide-up" 
          className="text-6xl md:text-8xl lg:text-9xl font-bold font-inter mb-6 leading-none"
        >
          Building Digital
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue via-violet to-pink">
            Solutions
          </span>
        </h1>
        
        <p 
          data-animate="slide-up" 
          className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          3+ years crafting exceptional web experiences. Frontend specialist with full-stack capabilities, 
          delivering software, websites, and solutions across all industries.
        </p>
        
        <div data-animate="slide-up" className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button className="group relative px-8 py-4 bg-electric-blue text-white font-medium rounded-lg overflow-hidden transition-all duration-300 hover:scale-105">
            <span className="relative z-10">View My Work</span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet to-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          
          <button className="px-8 py-4 border border-border text-text font-medium rounded-lg hover:bg-surface transition-all duration-300">
            Get In Touch
          </button>
        </div>
      </div>
    </section>
  )
}