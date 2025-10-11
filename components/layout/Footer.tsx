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
    <footer className="relative bg-gradient-to-b from-bg to-bg overflow-visible py-32">
      <div className="relative max-w-7xl mx-auto px-8">
        <div className="grid lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-4 space-y-8" data-animate="footer-logo">
            <Image
              src="/assets/images/logo/logo-full-gradient-no-bg.png"
              alt="Thomas Logo"
              width={260}
              height={110}
              className="hover:scale-105 transition-transform duration-300 h-auto w-auto"
            />

            <p className="text-text/70 text-lg leading-relaxed">
              {t("footer.tagline")}
            </p>

            <div className="flex gap-3" data-animate="footer-socials">
              {socialLinks.map((social) => (
                <button
                  key={social.name}
                  onClick={social.onClick}
                  className="relative w-14 h-14 flex items-center justify-center rounded-xl bg-surface/30 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300 group overflow-hidden"
                  aria-label={social.name}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {social.icon === "github" && (
                    <FaGithub className="w-6 h-6 relative z-10 text-text/70 group-hover:text-primary transition-all duration-300 group-hover:scale-110" />
                  )}
                  {social.icon === "linkedin" && (
                    <FaLinkedin className="w-6 h-6 relative z-10 text-text/70 group-hover:text-primary transition-all duration-300 group-hover:scale-110" />
                  )}
                  {social.icon === "whatsapp" && (
                    <FaWhatsapp className="w-6 h-6 relative z-10 text-text/70 group-hover:text-primary transition-all duration-300 group-hover:scale-110" />
                  )}
                  {social.icon === "email" && (
                    <FaEnvelope className="w-6 h-6 relative z-10 text-text/70 group-hover:text-primary transition-all duration-300 group-hover:scale-110" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 grid md:grid-cols-2 gap-6">
            <div
              data-animate="footer-card"
              className="group relative"
              style={{ perspective: "1000px" }}
            >
              <div
                data-card-glow
                className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-3xl blur-2xl opacity-0"
              />

              <div className="absolute -inset-[1px] bg-gradient-to-br from-primary via-secondary to-primary rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative bg-bg backdrop-blur-xl rounded-3xl p-8 transition-all duration-500 h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <h4 className="text-xl font-bold mb-6 group-hover:text-primary transition-colors duration-300">
                    {t("footer.navigation.title")}
                  </h4>
                  <nav className="flex flex-col gap-3">
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`text-base text-text/70 hover:text-primary transition-colors duration-200 ${
                          pathname === link.href ? "text-primary font-semibold" : ""
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
            </div>

            <div
              data-animate="footer-card"
              className="group relative"
              style={{ perspective: "1000px" }}
            >
              <div
                data-card-glow
                className="absolute inset-0 bg-gradient-to-br from-secondary/40 to-primary/40 rounded-3xl blur-2xl opacity-0"
              />

              <div className="absolute -inset-[1px] bg-gradient-to-br from-secondary via-primary to-secondary rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative bg-bg backdrop-blur-xl rounded-3xl p-8 transition-all duration-500 h-full overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-secondary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <h4 className="text-xl font-bold mb-6 group-hover:text-secondary transition-colors duration-300">
                    {t("footer.services.title")}
                  </h4>
                  <ul className="flex flex-col gap-3">
                    <li className="text-base text-text/70 hover:text-secondary transition-colors duration-200 cursor-pointer">
                      {t("footer.services.web_development")}
                    </li>
                    <li className="text-base text-text/70 hover:text-secondary transition-colors duration-200 cursor-pointer">
                      {t("footer.services.ui_design")}
                    </li>
                    <li className="text-base text-text/70 hover:text-secondary transition-colors duration-200 cursor-pointer">
                      {t("footer.services.interactive")}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div
              data-animate="footer-card"
              className="group relative md:col-span-2"
              style={{ perspective: "1000px" }}
            >
              <div
                data-card-glow
                className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-3xl blur-2xl opacity-0"
              />

              <div className="absolute -inset-[1px] bg-gradient-to-br from-primary via-secondary to-primary rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative bg-bg backdrop-blur-xl rounded-3xl p-8 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <h4 className="text-xl font-bold mb-6 group-hover:text-primary transition-colors duration-300">
                    {t("footer.contact.title")}
                  </h4>
                  <div className="flex flex-col md:flex-row gap-6 text-text/80">
                    <a
                      href="mailto:thomas.augot@gmail.com"
                      className="text-base hover:text-primary transition-colors duration-200"
                    >
                      thomas.augot@gmail.com
                    </a>
                    <a
                      href="tel:+34684736469"
                      className="text-base hover:text-primary transition-colors duration-200 font-semibold"
                    >
                      +34 684 736 469
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/30 pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-text/60 text-sm">
            <p className="flex items-center gap-2">
              {t("footer.credits")}
              <FaHeart className="w-4 h-4 text-red-500 animate-pulse" />
              {t("footer.by")}
              <span className="gradient-primary bg-clip-text text-transparent font-bold">
                Thomas
              </span>
            </p>

            <p>
              © {currentYear} {t("footer.copyright")}
            </p>

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