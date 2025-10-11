"use client";

import Link from "next/link";
import { getFeaturedProjects } from "@/data/projects";
import { useTranslation } from "@/lib/providers/TranslationProvider";
import { Button } from "../ui/Button";

export default function ProjectsShowcase() {
  const { t, language } = useTranslation();
  const projects = getFeaturedProjects();

  return (
    <>
      <div className="hidden lg:block relative overflow-visible">
        <section
          data-projects-section
          className="relative overflow-visible bg-gradient-to-b from-bg via-bg to-transparent"
          style={{ height: `${projects.length * 150}vh` }}
        >
          <div
            className="sticky top-0 h-screen overflow-visible flex items-center justify-center"
            style={{
              perspective: "2000px",
              perspectiveOrigin: "50% 50%",
            }}
          >
            <div className="absolute top-16 left-16 z-50 pointer-events-none">
              <h2 className="text-3xl text-text/60 font-light mb-2">
                {t("homepage.projects_section.subtitle")}
              </h2>
              <h3 className="text-7xl font-bold gradient-primary bg-clip-text text-transparent">
                {t("homepage.projects_section.title")}
              </h3>
            </div>

            <div className="absolute inset-0 pointer-events-none opacity-40">
              <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[150px]" />
              <div className="absolute bottom-1/3 right-1/3 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[150px]" />
            </div>

            {projects.map((project, index) => (
              <div
                key={project.id}
                data-project-panel={index}
                className="absolute inset-0 w-full h-full flex items-center justify-center"
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity",
                }}
              >
                <div className="w-full max-w-[1400px] px-20 grid grid-cols-2 gap-20 items-center">
                  <div
                    data-project-image
                    className="relative"
                    style={{
                      transformStyle: "preserve-3d",
                      willChange: "transform, opacity",
                    }}
                  >
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-surface/5">
                      {project.media.coverVideo ? (
                        <video
                          src={project.media.coverVideo}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-auto object-contain"
                        />
                      ) : (
                        <img
                          src={project.media.coverImage}
                          alt={t(project.title)}
                          className="w-full h-[500px] object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent" />
                    </div>

                    <div className="absolute -bottom-6 left-6 right-6 flex gap-2 flex-wrap">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 text-xs font-mono bg-surface/90 backdrop-blur-md rounded-lg border border-border/50 text-text"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    data-project-content
                    className="space-y-6"
                    style={{
                      transformStyle: "preserve-3d",
                      willChange: "transform, opacity",
                    }}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface/50 backdrop-blur-sm rounded-full border border-border/50">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-xs font-mono text-text/70 tracking-wide uppercase">
                        {project.year} • {project.client}
                      </span>
                    </div>

                    <h3 className="text-6xl font-bold gradient-primary bg-clip-text text-transparent leading-tight">
                      {t(project.title)}
                    </h3>

                    <div className="space-y-4">
                      <div className="bg-surface/30 backdrop-blur-sm p-6 rounded-xl border border-border/30">
                        <p className="text-lg text-text/90 leading-relaxed">
                          {t(project.preview.tagline)}
                        </p>
                      </div>

                      <div className="bg-surface/20 backdrop-blur-sm p-5 rounded-xl border border-border/20">
                        <p className="text-base text-text/70 leading-relaxed">
                          {t(project.preview.description)}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {project.preview.keyPoints
                          .slice(0, 2)
                          .map((keyPoint, idx) => (
                            <div
                              key={idx}
                              className="bg-surface/20 backdrop-blur-sm p-4 rounded-lg border border-border/20"
                            >
                              <div className="flex items-start gap-2">
                                <div className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                                <p className="text-sm text-text/80 leading-relaxed">
                                  {t(keyPoint)}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>

                    <Button
                      asLink
                      href={`/${language}/portfolio/${project.slug}`}
                      className="gap-2"
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
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="lg:hidden py-20 px-4 space-y-20 bg-gradient-to-b from-bg via-bg to-transparent relative overflow-visible">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-20 left-10 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-10 w-64 h-64 bg-secondary/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 mb-12">
          <h2 className="text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-4">
            {t("homepage.projects_section.title")}
          </h2>
          <p className="text-lg text-text/60 font-mono">
            {t("homepage.projects_section.subtitle")}
          </p>
        </div>

        {projects.map((project, index) => (
          <div
            key={project.id}
            data-project-panel={index}
            className="relative space-y-6"
          >
            <div data-project-image className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-border/50">
                {project.media.coverVideo ? (
                  <video
                    src={project.media.coverVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto object-contain"
                  />
                ) : (
                  <img
                    src={project.media.coverImage}
                    alt={t(project.title)}
                    className="w-full h-[280px] object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent" />
              </div>
            </div>

            <div data-project-content className="space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface/50 backdrop-blur-sm rounded-full border border-border/50">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-xs font-mono text-text/70 tracking-wide uppercase">
                  {project.year} • {project.client}
                </span>
              </div>

              <h3 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent leading-tight">
                {t(project.title)}
              </h3>

              <div className="bg-surface/30 backdrop-blur-sm p-5 rounded-xl border border-border/30 space-y-3">
                <p className="text-base text-text/90 leading-relaxed">
                  {t(project.preview.tagline)}
                </p>
                <p className="text-sm text-text/70 leading-relaxed">
                  {t(project.preview.description)}
                </p>
              </div>

              <div className="flex gap-2 flex-wrap">
                {project.technologies.slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 text-xs font-mono bg-surface/50 backdrop-blur-sm rounded-lg border border-border/30 text-text/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <Button
                asLink
                href={`/${language}/portfolio/${project.slug}`}
                className="gap-2"
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
