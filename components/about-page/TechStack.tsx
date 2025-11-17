"use client";

import { useTranslation } from "@/lib/providers/TranslationProvider";
import Image from "next/image";
import { technologies } from "@/data/technologies";

export default function TechStack() {
  const { t } = useTranslation();

  return (
    <section data-tech-stack-3d className="relative py-32 px-6 md:px-12 lg:px-20" style={{ perspective: "2000px" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20" data-section-header>
          <h2 data-tetris-title className="title-section gradient-text mb-4">
            {t("about.tech_stack.title")}
          </h2>
          <p className="text-body text-text/70">
            {t("about.tech_stack.description")}
          </p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4 md:gap-6">
          {technologies.map((tech, index) => {
            const row = Math.floor(index / 7);
            const col = index % 7;
            const rotateY = ((col - 3) * 5);
            const rotateX = ((row - 2) * -3);

            return (
              <div
                key={tech.id}
                data-tech-card={index}
                className="group relative aspect-square"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Glow effect */}
                <div
                  className="absolute -inset-3 bg-gradient-to-br from-primary/0 to-secondary/0 group-hover:from-primary/30 group-hover:to-secondary/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700"
                  data-tech-glow
                />

                {/* Card with 3D transform */}
                <div
                  className="relative w-full h-full flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-bg/90 backdrop-blur-md border border-border/30 group-hover:border-primary/60 transition-all duration-500"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
                    transition: "all 0.5s cubic-bezier(0.23, 1, 0.32, 1)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "rotateY(0deg) rotateX(0deg) translateZ(40px) scale(1.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg) translateZ(0px) scale(1)`;
                  }}
                >
                  <div className="relative w-12 h-12 md:w-14 md:h-14 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-6">
                    <Image
                      src={tech.logo}
                      alt={tech.name}
                      fill
                      className="object-contain drop-shadow-xl"
                    />
                  </div>
                  <span className="text-xs font-mono text-text/60 group-hover:text-primary transition-colors duration-300 text-center">
                    {tech.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
