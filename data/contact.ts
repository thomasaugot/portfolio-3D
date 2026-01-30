import { Mail } from "lucide-react";
import { SiGithub, SiLinkedin, SiMedium } from "react-icons/si";
import type { IconType } from "react-icons";
import type { LucideIcon } from "lucide-react";

export interface SocialLink {
  icon: IconType | LucideIcon;
  label: string;
  href: string;
  handle: string;
  color: string;
  borderColor: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: Mail,
    label: "Email",
    href: "mailto:thomas.augot@gmail.com",
    handle: "thomas.augot@gmail.com",
    color: "group-hover:text-primary",
    borderColor: "group-hover:border-primary/50",
  },
  {
    icon: SiGithub,
    label: "GitHub",
    href: "https://github.com/thomasaugot",
    handle: "@thomasaugot",
    color: "group-hover:text-white",
    borderColor: "group-hover:border-white/30",
  },
  {
    icon: SiLinkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/thomas-augot/",
    handle: "Thomas Augot",
    color: "group-hover:text-[#0A66C2]",
    borderColor: "group-hover:border-[#0A66C2]/50",
  },
  {
    icon: SiMedium,
    label: "Medium",
    href: "https://medium.com/@thomasaugot",
    handle: "@thomasaugot",
    color: "group-hover:text-white",
    borderColor: "group-hover:border-white/30",
  },
];
