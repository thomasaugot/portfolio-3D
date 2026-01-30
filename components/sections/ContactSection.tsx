"use client";

import { useTranslation } from "@/contexts/TranslationProvider";
import { ArrowUpRight } from "lucide-react";
import { SOCIAL_LINKS } from "@/data/contact";

export default function ContactSection() {
  const { t } = useTranslation();

  return (
    <section
      id="contact"
      data-contact-section
      className="fixed inset-0 bg-transparent overflow-hidden"
      style={{ visibility: "hidden", opacity: 0 }}
    >
      {/* Container matching navbar max-width */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 h-full relative">
        {/* Left side - Social links */}
        <div className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-[300px] lg:w-[320px]">
        {/* Gradient glow orbs */}
        <div className="absolute w-[250px] h-[250px] bg-primary/25 rounded-full blur-[70px] -top-16 -left-16 animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute w-[200px] h-[200px] bg-secondary/20 rounded-full blur-[50px] bottom-0 -right-10 animate-[float_8s_ease-in-out_infinite_1s]" />

        {/* Rotating decorative rings */}
        <div className="absolute -inset-6 border-2 border-dashed border-primary/25 rounded-full animate-[spin_30s_linear_infinite]" />
        <div className="absolute -inset-12 border border-secondary/15 rounded-full animate-[spin_45s_linear_infinite_reverse]" />

        {/* Content container */}
        <div className="relative group/container">
          {/* Floating accent dots */}
          <div className="absolute -top-3 left-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" />
          <div className="absolute -bottom-3 left-1/2 w-2 h-2 bg-secondary rounded-full animate-pulse" />
          <div className="absolute top-1/2 -left-3 w-2 h-2 bg-primary rounded-full animate-pulse" />
          <div className="absolute top-1/2 -right-3 w-2 h-2 bg-secondary rounded-full animate-pulse" />

          {/* Glass panel */}
          <div className="relative bg-[#1a1a1a]/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl shadow-primary/10">
            {/* Header */}
            <div className="mb-6">
              <p className="text-primary text-xs font-mono uppercase tracking-[0.3em] mb-2">
                {t("footer.social_kicker")}
              </p>
              <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                {t("footer.social_title")}
              </h2>
            </div>

            {/* Social links */}
            <div className="space-y-2">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.label !== "Email" ? "_blank" : undefined}
                    rel={social.label !== "Email" ? "noreferrer" : undefined}
                    className="group flex items-center gap-4 p-3 -mx-3 rounded-xl transition-all duration-300 hover:bg-white/5"
                  >
                    <div
                      className="w-11 h-11 bg-[#252525] border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:scale-110"
                      style={{
                        clipPath: "polygon(15% 0, 85% 0, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0 85%, 0 15%)"
                      }}
                    >
                      <Icon className="w-5 h-5 text-white/60 group-hover:text-primary transition-colors duration-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-white/40 uppercase tracking-wider font-mono">{social.label}</p>
                      <p className="text-[14px] text-white/90 font-medium group-hover:text-primary transition-colors duration-300">{social.handle}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-primary transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                );
              })}
            </div>

            {/* Availability badge */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              <span className="text-sm text-white/70 font-mono">
                {t("footer.available")}
              </span>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
