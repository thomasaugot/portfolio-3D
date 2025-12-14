// components/Footer/Footer.tsx
"use client";

import SafeLink from "@/components/ui/SafeLink";
import Image from "next/image";
import { useTranslation } from "@/lib/providers/TranslationProvider";
import { usePathname } from "next/navigation";
import {
  FaWhatsapp,
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaHeart,
} from "react-icons/fa";

export default function Footer() {
  const { t, language } = useTranslation();
  const pathname = usePathname();

  const navigationLinks = [
    { href: `/${language}`, label: t("nav.home") },
    { href: `/${language}/portfolio`, label: t("nav.portfolio") },
    { href: `/${language}/about`, label: t("nav.about") },
    { href: `/${language}/contact`, label: t("nav.contact.menu-item") },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      icon: "github",
      onClick: () => window.open("https://github.com/thomasaugot", "_blank"),
    },
    {
      name: "LinkedIn",
      icon: "linkedin",
      onClick: () =>
        window.open("https://www.linkedin.com/in/thomas-augot/", "_blank"),
    },
    {
      name: "WhatsApp",
      icon: "whatsapp",
      onClick: () => window.open("https://wa.me/34684736469", "_blank"),
    },
    {
      name: "Email",
      icon: "email",
      onClick: () => (window.location.href = "mailto:thomas.augot@gmail.com"),
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-visible pt-16 md:pt-32 pb-12 bg-bg">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* Background glow effect */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[800px] h-[300px] gradient-primary-reverse opacity-[0.08] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-8 overflow-visible">
        <div className="grid lg:grid-cols-2 gap-20 mb-24 overflow-visible">
          {/* Logo & Socials Section */}
          <div data-animate="footer-logo">
            <Image
              src="/assets/images/logo/logo-full-gradient-no-bg.png"
              alt="Thomas Logo"
              width={280}
              height={120}
              className="hover:scale-105 transition-transform duration-300 h-auto w-auto max-w-[180px] md:max-w-[280px] mb-8"
            />
            <p className="subtitle mb-10 max-w-md">{t("footer.tagline")}</p>
            <div className="flex gap-4" data-animate="footer-socials">
              {socialLinks.map((social) => (
                <button
                  key={social.name}
                  onClick={social.onClick}
                  className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-bg/40 backdrop-blur-sm border border-border/20 hover:border-primary/60 transition-all duration-300 group overflow-hidden"
                  aria-label={social.name}
                >
                  <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 rounded-2xl scale-0 group-hover:scale-100 transition-transform duration-500" />
                  {social.icon === "github" && (
                    <FaGithub className="w-6 h-6 relative z-10 text-text/60 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                  )}
                  {social.icon === "linkedin" && (
                    <FaLinkedin className="w-6 h-6 relative z-10 text-text/60 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                  )}
                  {social.icon === "whatsapp" && (
                    <FaWhatsapp className="w-6 h-6 relative z-10 text-text/60 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                  )}
                  {social.icon === "email" && (
                    <FaEnvelope className="w-6 h-6 relative z-10 text-text/60 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-8 sm:gap-y-12 overflow-visible">
            {/* Navigation */}
            <div data-animate="footer-section" className="overflow-visible">
              <h4 className="title-item gradient-text mb-8 overflow-visible">
                {t("footer.navigation.title")}
              </h4>
              <nav className="flex flex-col gap-4">
                {navigationLinks.map((link) => (
                  <SafeLink
                    key={link.href}
                    href={link.href}
                    className={`text-body hover:text-text hover:translate-x-1 transition-all duration-200 ${
                      pathname === link.href ? "text-primary translate-x-1" : ""
                    }`}
                  >
                    {link.label}
                  </SafeLink>
                ))}
              </nav>
            </div>

            {/* Services */}
            <div data-animate="footer-section" className="overflow-visible">
              <h4 className="title-item gradient-text mb-8 overflow-visible">
                {t("footer.services.title")}
              </h4>
              <ul className="flex flex-col gap-4">
                <li className="text-body hover:text-text hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  {t("footer.services.frontend")}
                </li>
                <li className="text-body hover:text-text hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  {t("footer.services.fullstack")}
                </li>
                <li className="text-body hover:text-text hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  {t("footer.services.mobile")}
                </li>
                <li className="text-body hover:text-text hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  {t("footer.services.animations")}
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div
              data-animate="footer-section"
              className="sm:col-span-2 overflow-visible"
            >
              <h4 className="title-item gradient-text mb-8 overflow-visible">
                {t("footer.contact.title")}
              </h4>
              <div className="flex flex-wrap gap-8">
                <a
                  href="mailto:thomas.augot@gmail.com"
                  className="text-body hover:text-primary hover:translate-x-1 transition-all duration-200"
                >
                  thomas.augot@gmail.com
                </a>
                <a
                  href="tel:+34684736469"
                  className="text-body hover:text-primary hover:translate-x-1 transition-all duration-200"
                >
                  +34 684 736 469
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-border/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-text/40 text-body">
            <p className="text-base md:text-lg text-text/60 flex items-center gap-2 normal-case">
              {t("footer.credits")}
              <FaHeart className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-text">{t("footer.brand")}</span>
            </p>

            <p>
              © {currentYear} {t("footer.copyright")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
