"use client";

export default function SkillsSection() {
  const services = [
    {
      title: "Web Development",
      description:
        "Fast, modern websites and web applications built for performance and user experience",
      skills: "React, Next.js, TypeScript, Node.js",
    },
    {
      title: "UI/UX Design",
      description:
        "Beautiful, intuitive interfaces that users love and converts visitors into customers",
      skills: "Tailwind CSS, SCSS, Responsive Design",
    },
    {
      title: "Interactive Experiences",
      description:
        "Smooth animations and engaging interactions that bring your brand to life",
      skills: "GSAP, Framer Motion, Three.js",
    },
    {
      title: "Mobile Apps",
      description:
        "Native mobile applications for iOS and Android from a single codebase",
      skills: "React Native",
    },
  ];

  return (
    <section
      data-skills-section
      className="min-h-screen flex items-center justify-center relative z-20 -mt-[100vh] opacity-0 py-32"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/50 to-bg pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-8 w-full">
        <div className="text-center mb-24">
          <h2 className="text-6xl md:text-8xl font-bold mb-6">
            Services &
            <br />
            <span className="gradient-primary bg-clip-text text-transparent font-light">
              Expertise
            </span>
          </h2>
          <p className="text-xl text-text-muted max-w-2xl mx-auto">
            Full-stack solutions from concept to deployment
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {services.map((service) => (
            <div
              key={service.title}
              data-service-card
              className="group relative"
            >
              <div
                data-card-glow
                className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-3xl blur-2xl opacity-0"
              />

              <div className="relative bg-bg glass border border-border rounded-3xl p-8 hover:border-primary/30 transition-all duration-300 h-full">
                <h3 className="text-3xl font-bold mb-4">{service.title}</h3>
                <p className="text-lg text-text-muted mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="text-sm font-mono text-primary/60">
                  {service.skills}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          <div data-stat className="text-center">
            <div className="text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
              3+
            </div>
            <div className="text-sm text-muted uppercase tracking-wider">
              Years Experience
            </div>
          </div>

          <div className="hidden md:block w-px h-16 bg-border" />

          <div data-stat className="text-center">
            <div className="text-5xl font-bold mb-2">
              <div className="gradient-primary bg-clip-text text-transparent leading-tight">
                FR / EN / ES
              </div>
            </div>
            <div className="text-sm text-muted uppercase tracking-wider">
              Trilingual Communication
            </div>
          </div>

          <div className="hidden md:block w-px h-16 bg-border" />

          <div data-stat className="text-center">
            <div className="text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
              20+
            </div>
            <div className="text-sm text-muted uppercase tracking-wider">
              Projects Delivered
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
