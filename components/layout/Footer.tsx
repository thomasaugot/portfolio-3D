// components/Footer/Footer.tsx
"use client";

import Link from "next/link";
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
    <footer className="relative overflow-visible pt-32 pb-12">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-r from-primary/8 to-secondary/8 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-20 mb-24">
          <div data-animate="footer-logo">
            <Image
              src="/assets/images/logo/logo-full-gradient-no-bg.png"
              alt="Thomas Logo"
              width={280}
              height={120}
              className="hover:scale-105 transition-transform duration-300 h-auto w-auto mb-8"
            />
            <p className="text-text/60 text-xl leading-relaxed mb-10 max-w-md">
              {t("footer.tagline")}
            </p>
            <div className="flex gap-4" data-animate="footer-socials">
              {socialLinks.map((social) => (
                <button
                  key={social.name}
                  onClick={social.onClick}
                  className="relative w-16 h-16 flex items-center justify-center rounded-2xl bg-surface/40 backdrop-blur-sm border border-border/20 hover:border-primary/60 transition-all duration-300 group overflow-hidden"
                  aria-label={social.name}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-secondary/10 transition-all duration-300" />
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

          <div className="grid grid-cols-2 gap-x-16 gap-y-12">
            <div data-animate="footer-section">
              <h4 className="text-sm font-mono uppercase tracking-widest text-primary/60 mb-8">
                {t("footer.navigation.title")}
              </h4>
              <nav className="flex flex-col gap-4">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-lg text-text/60 hover:text-text hover:translate-x-1 transition-all duration-200 ${
                      pathname === link.href ? "text-primary translate-x-1" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div data-animate="footer-section">
              <h4 className="text-sm font-mono uppercase tracking-widest text-secondary/60 mb-8">
                {t("footer.services.title")}
              </h4>
              <ul className="flex flex-col gap-4">
                <li className="text-lg text-text/60 hover:text-text hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  {t("footer.services.web_development")}
                </li>
                <li className="text-lg text-text/60 hover:text-text hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  {t("footer.services.ui_design")}
                </li>
                <li className="text-lg text-text/60 hover:text-text hover:translate-x-1 transition-all duration-200 cursor-pointer">
                  {t("footer.services.interactive")}
                </li>
              </ul>
            </div>

            <div data-animate="footer-section" className="col-span-2">
              <h4 className="text-sm font-mono uppercase tracking-widest text-primary/60 mb-8">
                {t("footer.contact.title")}
              </h4>
              <div className="flex flex-wrap gap-8">
                
                 <a href="mailto:thomas.augot@gmail.com"
                  className="text-lg text-text/60 hover:text-text hover:translate-x-1 transition-all duration-200"
                >
                  thomas.augot@gmail.com
                </a>
                
                <a  href="tel:+34684736469"
                  className="text-lg text-text/60 hover:text-text hover:translate-x-1 transition-all duration-200"
                >
                  +34 684 736 469
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-border/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-text/40 text-base">
            <p className="flex items-center gap-2">
              {t("footer.credits")}
              <FaHeart className="w-4 h-4 text-red-500" />
              {t("footer.by")}
              <span className="gradient-primary bg-clip-text text-transparent font-bold">
                Thomas
              </span>
            </p>

            <p>© {currentYear} {t("footer.copyright")}</p>

            <div className="flex items-center gap-6">
              <Link
                href={`/${language}/privacy`}
                className="hover:text-primary transition-colors duration-200"
              >
                {t("footer.legal.privacy")}
              </Link>
              <span>·</span>
              <Link
                href={`/${language}/terms`}
                className="hover:text-primary transition-colors duration-200"
              >
                {t("footer.legal.terms")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}