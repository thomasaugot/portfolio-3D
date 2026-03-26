"use client";

import { useTranslation } from "@/contexts/TranslationProvider";
import { SOCIAL_LINKS } from "@/data/contact";
import SocialLinkCard from "./SocialLinkCard";
import AvailabilityBadge from "./AvailabilityBadge";

export default function ContactSection() {
  const { t } = useTranslation();

  return (
    <section
      id="contact"
      data-contact-section
      aria-labelledby="contact-section-title"
      className="fixed inset-0 bg-transparent overflow-hidden"
      style={{ visibility: "hidden", opacity: 0 }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 h-full relative">
        <div className="desktop-layout-only absolute left-1/2 -translate-x-[124%] xl:left-8 xl:translate-x-0 top-1/2 -translate-y-1/2 w-[300px] lg:w-[320px]">

          {/* Decorative rings */}
          <div aria-hidden="true" className="absolute w-[250px] h-[250px] bg-primary/25 rounded-full blur-[70px] -top-16 -left-16 animate-[float_6s_ease-in-out_infinite]" />
          <div aria-hidden="true" className="absolute w-[200px] h-[200px] bg-secondary/20 rounded-full blur-[50px] bottom-0 -right-10 animate-[float_8s_ease-in-out_infinite_1s]" />
          <div aria-hidden="true" className="absolute -inset-6 border-2 border-dashed border-primary/25 rounded-full animate-[spin_30s_linear_infinite]" />
          <div aria-hidden="true" className="absolute -inset-12 border border-secondary/15 rounded-full animate-[spin_45s_linear_infinite_reverse]" />

          <div className="relative group/container">
            {/* Accent dots */}
            <div aria-hidden="true" className="absolute -top-3 left-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div aria-hidden="true" className="absolute -bottom-3 left-1/2 w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <div aria-hidden="true" className="absolute top-1/2 -left-3 w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div aria-hidden="true" className="absolute top-1/2 -right-3 w-2 h-2 bg-secondary rounded-full animate-pulse" />

            <div className="relative bg-bg-surface/96 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-2xl [html[data-theme='light']_&]:border-[#c8b99f] [html[data-theme='light']_&]:bg-[#f8f3e9]/96 [html[data-theme='light']_&]:shadow-[0_28px_80px_rgba(16,185,129,0.08),0_18px_40px_rgba(149,115,37,0.12)]">
              <div className="mb-6">
                <p className="text-primary text-xs font-mono uppercase tracking-[0.3em] mb-2">{t("footer.social_kicker")}</p>
                <h2 id="contact-section-title" className="text-2xl lg:text-3xl font-bold text-text leading-tight">{t("footer.social_title")}</h2>
              </div>

              <div className="space-y-2">
                {SOCIAL_LINKS.map((social) => (
                  <SocialLinkCard key={social.label} {...social} />
                ))}
              </div>

              <AvailabilityBadge label={t("footer.available")} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
