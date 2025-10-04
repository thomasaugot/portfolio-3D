"use client";

import Link from "next/link";
import { getFeaturedProjects } from "@/data/projects";
import { useTranslation } from "@/lib/TranslationProvider";

export default function ProjectsShowcase() {
  const { t, language } = useTranslation();
  const projects = getFeaturedProjects();

  return (
    <section
      data-projects-section
      className="relative min-h-[400vh] bg-bg z-50"
    >
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{ perspective: "2000px" }}
      >
        <div className="absolute top-12 left-16 z-50">
          <h2 className="text-6xl font-bold gradient-primary bg-clip-text text-transparent">
            {t("homepage.projects_section.title")}
          </h2>
          <p className="text-xl text-muted font-mono mt-4">
            {t("homepage.projects_section.subtitle")}
          </p>
        </div>

        {projects.map((project, index) => (
          <div
            key={project.id}
            data-project-panel={index}
            className="absolute inset-0 w-full h-full"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="relative w-full h-full flex items-center justify-center px-16 bg-bg">
              <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center">
                <div
                  data-project-image
                  className="relative"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="absolute -inset-8 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl blur-3xl" />
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-primary/20">
                    {project.media.coverVideo ? (
                      <video
                        src={project.media.coverVideo}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-[450px] object-cover"
                      />
                    ) : (
                      <img
                        src={project.media.coverImage}
                        alt={t(project.title)}
                        className="w-full h-[450px] object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                  </div>
                </div>

                <div
                  data-project-content
                  className="space-y-4"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div>
                    <div className="text-xs font-mono text-primary mb-2 tracking-widest uppercase">
                      {project.year} • {project.client}
                    </div>

                    <h3 className="text-5xl md:text-6xl font-bold mb-3 leading-tight gradient-primary bg-clip-text text-transparent">
                      {t(project.title)}
                    </h3>
                  </div>

                  <div className="backdrop-blur-md bg-surface/20 p-5 rounded-2xl space-y-4">
                    <div>
                      <div className="text-xs font-mono text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {t("common.project.overview")}
                      </div>
                      <p className="text-base text-text leading-snug">
                        {t(project.preview.tagline)}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs font-mono text-secondary uppercase tracking-wider mb-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                        {t("common.project.description")}
                      </div>
                      <p className="text-sm text-text-muted leading-snug">
                        {t(project.preview.description)}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {project.preview.keyPoints
                        .slice(0, 2)
                        .map((keyPoint, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2 p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border-l-2 border-primary"
                          >
                            <div className="w-1 h-1 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            <p className="text-sm text-text leading-snug">
                              {t(keyPoint)}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 text-xs font-mono bg-surface/50 backdrop-blur-sm rounded-lg border border-border/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/${language}/portfolio/${project.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-bg font-medium text-sm rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {t(project.preview.cta)}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
