export default function CTASection() {
  return (
    <section className="py-32 bg-surface/50">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <h2 data-animate="slide-up" className="text-4xl md:text-5xl font-bold font-inter mb-6">
          Ready to Build Something Great?
        </h2>
        <p data-animate="slide-up" className="text-xl text-text-muted mb-12">
          Let's discuss your project and create a solution that drives results
        </p>
        
        <div data-animate="slide-up" className="flex flex-col sm:flex-row gap-6 justify-center">
          <button className="group relative px-12 py-6 bg-gradient-to-r from-electric-blue to-violet text-white font-semibold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105">
            <span className="relative z-10">Start a Project</span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet to-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          
          <button className="px-12 py-6 border border-border text-text font-semibold rounded-lg hover:bg-surface transition-all duration-300">
            View Portfolio
          </button>
        </div>
      </div>
    </section>
  )
}