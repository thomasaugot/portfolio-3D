"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/providers/TranslationProvider";
import { X, Briefcase, GraduationCap, MapPin } from "lucide-react";

export default function Timeline() {
  const { t } = useTranslation();
  const [selectedTimelineItem, setSelectedTimelineItem] = useState<number | null>(null);

  // Manually create array of 8 web dev timeline items
  const timelineIndices = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <>
      <section data-timeline-blobs className="relative py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20" data-section-header>
            <h2 data-tetris-title className="title-section gradient-text">
              {t("about.timeline.title")}
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-primary-light to-primary transform -translate-x-1/2 hidden md:block" />

            <div className="space-y-12 md:space-y-16">
              {timelineIndices.map((itemIndex, arrayIndex) => {
                const isEven = arrayIndex % 2 === 0;
                const isWork = t(`about.timeline.items.${itemIndex}.type`) === "work";
                const isCurrent = t(`about.timeline.items.${itemIndex}.current`) === "true";

                return (
                  <div
                    key={itemIndex}
                    data-timeline-blob={arrayIndex}
                    className={`relative flex items-center ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    } flex-col gap-8`}
                  >
                    <div className="w-full md:w-1/2 flex justify-center md:justify-end">
                      <button
                        onClick={() => setSelectedTimelineItem(itemIndex)}
                        className="group relative w-full max-w-md"
                      >
                        {/* Animated glow */}
                        <div
                          className={`absolute -inset-4 blur-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-700 ${
                            isWork ? "bg-primary/40" : "bg-primary-light/40"
                          }`}
                          style={{
                            borderRadius: "40% 60% 70% 30% / 40% 50% 60% 50%",
                            animation: `blobMorph ${7 + arrayIndex * 0.3}s ease-in-out infinite`
                          }}
                        />

                        {/* Main blob card */}
                        <div
                          className={`relative p-8 backdrop-blur-xl transition-all duration-700 group-hover:scale-105 ${
                            isWork
                              ? "bg-primary/5 hover:bg-primary/15 border-2 border-primary/40 hover:border-primary/80"
                              : "bg-primary-light/5 hover:bg-primary-light/15 border-2 border-primary-light/40 hover:border-primary-light/80"
                          }`}
                          style={{
                            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                            animation: `blobMorph ${6 + arrayIndex * 0.5}s ease-in-out infinite`,
                            transformStyle: "preserve-3d"
                          }}
                        >
                          {isCurrent && (
                            <div className="absolute -top-3 right-4">
                              <span className={`px-3 py-1.5 text-xs font-mono font-semibold ${isWork ? "bg-primary" : "bg-primary-light"} text-bg rounded-full shadow-lg`}>
                                Current
                              </span>
                            </div>
                          )}

                          <div className="relative z-10 text-left">
                            <div className="flex items-center gap-3 mb-4">
                              {isWork ? (
                                <div className="p-2 rounded-xl bg-primary/20">
                                  <Briefcase className="w-5 h-5 text-primary" />
                                </div>
                              ) : (
                                <div className="p-2 rounded-xl bg-primary-light/20">
                                  <GraduationCap className="w-5 h-5 text-primary-light" />
                                </div>
                              )}
                              <span className="text-sm font-mono text-text/70 group-hover:text-text transition-colors">
                                {t(`about.timeline.items.${itemIndex}.period`)}
                              </span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-text mb-3 group-hover:text-primary transition-colors duration-300">
                              {t(`about.timeline.items.${itemIndex}.title`)}
                            </h3>
                            <p className="text-base font-medium text-text/80 mb-2">
                              {t(`about.timeline.items.${itemIndex}.organization`)}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-text/60">
                              <MapPin className="w-4 h-4" />
                              {t(`about.timeline.items.${itemIndex}.location`)}
                            </div>
                          </div>

                          <div className="mt-6 flex items-center gap-2 text-sm font-mono text-primary/70 group-hover:text-primary group-hover:gap-3 transition-all">
                            <span>View details</span>
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                          </div>
                        </div>
                      </button>
                    </div>

                    <div className="hidden md:block md:w-1/2" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes blobMorph {
          0%, 100% {
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
          }
          25% {
            border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%;
          }
          50% {
            border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%;
          }
          75% {
            border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%;
          }
        }
      `}</style>

      {/* Timeline Modal */}
      {selectedTimelineItem !== null && (
        <div
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
          onClick={() => setSelectedTimelineItem(null)}
        >
          <div
            className="relative w-full max-w-3xl bg-bg border border-border/50 rounded-3xl p-8 md:p-12 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedTimelineItem(null)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-xl bg-surface/50 hover:bg-primary/20 transition-all"
            >
              <X className="w-5 h-5 text-primary" />
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-mono flex items-center gap-2 ${
                  t(`about.timeline.items.${selectedTimelineItem}.type`) === "work"
                    ? "bg-primary/10 text-primary"
                    : "bg-primary-light/10 text-primary-light"
                }`}>
                  {t(`about.timeline.items.${selectedTimelineItem}.type`) === "work" ? (
                    <>
                      <Briefcase className="w-4 h-4" />
                      <span>Work</span>
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-4 h-4" />
                      <span>Education</span>
                    </>
                  )}
                </span>
                <span className="text-sm font-mono text-text/60">
                  {t(`about.timeline.items.${selectedTimelineItem}.period`)}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                {t(`about.timeline.items.${selectedTimelineItem}.title`)}
              </h2>

              <h3 className="text-xl text-text/80">
                {t(`about.timeline.items.${selectedTimelineItem}.organization`)}
              </h3>

              <p className="text-base text-text/60 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t(`about.timeline.items.${selectedTimelineItem}.location`)}
              </p>

              <div className="pt-4 border-t border-border/30">
                <p className="text-lg text-text/80 leading-relaxed">
                  {t(`about.timeline.items.${selectedTimelineItem}.description`)}
                </p>
              </div>

              {t(`about.timeline.items.${selectedTimelineItem}.tech`) && (
                <div className="pt-4">
                  <div className="text-sm font-mono uppercase tracking-wider text-primary/70 mb-2">
                    Technologies
                  </div>
                  <div className="text-base text-text/70">
                    {t(`about.timeline.items.${selectedTimelineItem}.tech`)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
