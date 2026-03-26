import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import SocialLogo from "@/components/sections/contact/SocialLogo";

interface Props {
  label: string;
  href: string;
  handle: string;
  assetPath: string;
  hoverAccent: string;
  hoverAccentSoft: string;
}

export default function SocialLinkCard({ label, href, handle, assetPath, hoverAccent, hoverAccentSoft }: Props) {
  const isEmail = label === "Email";

  const hoverStyle = {
    "--social-logo": `url("${assetPath}")`,
    "--social-accent": hoverAccent,
    "--social-accent-soft": hoverAccentSoft,
  } as CSSProperties;

  return (
    <a
      href={href}
      target={isEmail ? undefined : "_blank"}
      rel={isEmail ? undefined : "noreferrer"}
      className="contact-social-link keyboard-focus-ring group flex items-center gap-4 p-3 -mx-3 rounded-xl"
      style={hoverStyle}
    >
      <SocialLogo />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted uppercase tracking-wider font-mono">{label}</p>
        <p className="contact-social-handle text-[14px] text-text/90 font-medium">{handle}</p>
      </div>
      <ArrowUpRight className="contact-social-arrow w-4 h-4 text-muted" />
    </a>
  );
}
