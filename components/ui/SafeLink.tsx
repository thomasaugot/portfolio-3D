"use client";

import Link from "next/link";
import { AnchorHTMLAttributes } from "react";

interface SafeLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * SafeLink - A wrapper around Next.js Link that forces full page reloads
 * for pages with complex 3D scenes and GSAP animations.
 *
 * This ensures proper cleanup and initialization of Three.js scenes and animations.
 */
export default function SafeLink({ href, children, className, onClick, ...props }: SafeLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Call any custom onClick handler first
    if (onClick) {
      onClick(e);
    }

    // Force full page reload for proper 3D scene initialization
    window.location.href = href;
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
