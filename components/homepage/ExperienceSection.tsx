export default function ExperienceSection() {
  return (
    <section className="py-32">
      <div className="max-w-6xl mx-auto px-8">
        <div data-animate="slide-up" className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold font-inter mb-6">
            What I Build
          </h2>
          <p className="text-xl text-text-muted">
            From concept to deployment across all industries
          </p>
        </div>
        
        <div data-animate="stagger" className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-electric-blue rounded-full mt-3" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Web Applications</h3>
                <p className="text-text-muted">Complex SPAs, dashboards, and interactive platforms with modern UX/UI</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-violet rounded-full mt-3" />
              <div>
                <h3 className="text-xl font-semibold mb-2">E-commerce Solutions</h3>
                <p className="text-text-muted">Full-featured online stores with payment integration and admin panels</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-pink rounded-full mt-3" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Business Software</h3>
                <p className="text-text-muted">Custom tools, CRMs, and automation systems for workflow optimization</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-teal rounded-full mt-3" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Corporate Websites</h3>
                <p className="text-text-muted">Professional sites with CMS, SEO optimization, and performance focus</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-amber rounded-full mt-3" />
              <div>
                <h3 className="text-xl font-semibold mb-2">API Development</h3>
                <p className="text-text-muted">RESTful services, integrations, and backend infrastructure</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 bg-electric-blue rounded-full mt-3" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Mobile-First Design</h3>
                <p className="text-text-muted">Responsive, fast-loading experiences across all devices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}