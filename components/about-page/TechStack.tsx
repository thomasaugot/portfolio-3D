"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import { technologies, technologyCategories } from "@/data/technologies";

export default function TechStack() {
  const { t } = useTranslation();

  const groupedTech = technologyCategories
    .map((category) => ({
      ...category,
      items: technologies.filter((tech) => tech.category === category.key),
    }))
    .filter((category) => category.items.length > 0);

  // Generate positions in 3D space - deterministic constellation around center
  // Tighter on mobile, wider on desktop
  const generatePositions = (items: typeof technologies, categoryIndex: number) => {
    return items.map((_, i) => {
      // Balanced spiral pattern - no randomness
      const ring = Math.floor(i / 8);
      const indexInRing = i % 8;
      // Larger base radius to avoid overlapping with category title
      const baseRadius = 18 + ring * 6;
      const angle = (indexInRing / 8) * Math.PI * 2 + ring * 0.4;

      const x = Math.cos(angle) * baseRadius;
      const y = Math.sin(angle) * (baseRadius * 0.45);
      // Negative Z = further away from camera, each category 1000px apart
      const z = -(categoryIndex * 1000);
      return { x, y, z };
    });
  };

  return (
    <section
      data-tech-section
      className="relative"
      style={{ height: "600vh" }}
    >
      {/* Viewport that gets pinned */}
      <div
        data-tech-viewport
        className="h-screen w-full overflow-hidden"
        style={{
          perspective: "1000px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* Title - fixed at top, outside 3D animation */}
        <div className="absolute top-8 md:top-12 left-0 right-0 text-center z-50 pointer-events-none px-4">
          <h2 className="title-section text-text">
            {t("about.tech_stack.title")}
          </h2>
          <p
            className="text-lg md:text-xl mt-1 md:mt-2"
            style={{
              backgroundImage: 'linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent'
            }}
          >
            {t("about.tech_stack.description")}
          </p>
        </div>

        {/* Particles - deterministic positions */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              data-particle
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${10 + ((i * 17) % 80)}%`,
                top: `${10 + ((i * 23) % 80)}%`,
                background: `rgba(var(--color-primary-rgb), ${0.2 + ((i % 10) * 0.03)})`,
              }}
            />
          ))}
        </div>

        {/* 3D Space */}
        <div
          data-tech-space
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {groupedTech.map((category, categoryIndex) => {
            const positions = generatePositions(category.items, categoryIndex);

            return (
              <div
                key={category.key}
                data-tech-layer={categoryIndex}
                className="absolute inset-0"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Category label */}
                <div
                  data-category-label={categoryIndex}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `translate3d(-50%, -50%, ${-(categoryIndex * 1000)}px)`,
                  }}
                >
                  <h3
                    className="title-section font-fun whitespace-nowrap gradient-text"
                    style={{
                      textShadow: "0 0 60px rgba(var(--color-primary-rgb), 0.6)",
                    }}
                  >
                    {t(category.titleKey)}
                  </h3>
                </div>

                {/* Logos */}
                {category.items.map((tech, techIndex) => {
                  const pos = positions[techIndex];
                  return (
                    <div
                      key={tech.id}
                      data-tech-logo={`${categoryIndex}-${techIndex}`}
                      className="absolute left-1/2 top-1/2 group cursor-pointer"
                      style={{
                        transform: `translate3d(calc(-50% + ${pos.x}vw), calc(-50% + ${pos.y}vh), ${pos.z}px)`,
                      }}
                    >
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center justify-center rounded-lg md:rounded-xl transition-transform duration-300 group-hover:scale-110"
                        style={{
                          background: "rgba(var(--color-surface-rgb), 0.95)",
                          border: "1px solid rgba(var(--color-primary-rgb), 0.4)",
                          boxShadow: `
                            0 0 20px rgba(var(--color-primary-rgb), 0.3),
                            0 8px 30px rgba(0, 0, 0, 0.4)
                          `,
                        }}
                      >
                        <div
                          className="w-6 h-6 sm:w-7 sm:h-7 md:w-10 md:h-10 lg:w-12 lg:h-12"
                          style={{
                            mask: `url(${tech.logo}) center/contain no-repeat`,
                            WebkitMask: `url(${tech.logo}) center/contain no-repeat`,
                            backgroundColor: "#fff",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Scroll hint */}
        <div
          data-scroll-hint
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-text/40 text-sm"
        >
          Scroll to explore
        </div>
      </div>
    </section>
  );
}
