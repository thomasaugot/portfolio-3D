import { SiGithub, SiLinkedin, SiMedium, SiGmail } from "react-icons/si";
import type { IconType } from "react-icons";

export interface SocialLink {
  icon: IconType;
  label: string;
  href: string;
  handle: string;
  color: string;
  borderColor: string;
  assetPath: string;
  hoverAccent: string;
  hoverAccentSoft: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: SiGmail,
    label: "Email",
    href: "mailto:thomas.augot@gmail.com",
    handle: "thomas.augot@gmail.com",
    color: "group-hover:text-primary",
    borderColor: "group-hover:border-primary/50",
    assetPath: "/assets/images/socials/gmail.svg",
    hoverAccent: "var(--theme-primary)",
    hoverAccentSoft: "color-mix(in srgb, var(--theme-primary) 26%, transparent)",
  },
  {
    icon: SiGithub,
    label: "GitHub",
    href: "https://github.com/thomasaugot",
    handle: "@thomasaugot",
    color: "group-hover:text-white",
    borderColor: "group-hover:border-white/30",
    assetPath: "/assets/images/socials/github.svg",
    hoverAccent: "color-mix(in srgb, var(--theme-text) 88%, var(--theme-primary) 12%)",
    hoverAccentSoft: "color-mix(in srgb, var(--theme-text) 16%, transparent)",
  },
  {
    icon: SiLinkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/thomas-augot/",
    handle: "Thomas Augot",
    color: "group-hover:text-[#0A66C2]",
    borderColor: "group-hover:border-[#0A66C2]/50",
    assetPath: "/assets/images/socials/linkedin.svg",
    hoverAccent: "var(--theme-secondary)",
    hoverAccentSoft: "color-mix(in srgb, var(--theme-secondary) 24%, transparent)",
  },
  {
    icon: SiMedium,
    label: "Medium",
    href: "https://medium.com/@thomasaugot",
    handle: "@thomasaugot",
    color: "group-hover:text-white",
    borderColor: "group-hover:border-white/30",
    assetPath: "/assets/images/socials/medium.svg",
    hoverAccent: "color-mix(in srgb, var(--theme-accent) 70%, var(--theme-primary) 30%)",
    hoverAccentSoft: "color-mix(in srgb, var(--theme-accent) 20%, transparent)",
  },
];
