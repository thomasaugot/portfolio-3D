import { Button } from '@/components/ui/Button';

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(204,255,2,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(2,188,204,0.1) 1px, transparent 1px)
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
          <span className="text-transparent bg-clip-text gradient-primary">
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
          <Button 
            variant="filled" 
            size="lg"
            className="transform hover:scale-105 transition-transform duration-300"
          >
            View My Work
          </Button>
          
          <Button 
            variant="outlined" 
            size="lg"
          >
            Get In Touch
          </Button>
        </div>
      </div>
    </section>
  )
}