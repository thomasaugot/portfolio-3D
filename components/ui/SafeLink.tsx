"use client";

import Link from "next/link";
import { AnchorHTMLAttributes } from "react";
import { useTransition } from "@/lib/providers/LoadingProvider";

interface SafeLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * SafeLink - A wrapper around Next.js Link with smooth morphing page transitions
 * for pages with complex 3D scenes and GSAP animations.
 *
 * This ensures proper cleanup and initialization of Three.js scenes and animations
 * while providing a smooth visual bridge between pages.
 */
export default function SafeLink({ href, children, className, onClick, ...props }: SafeLinkProps) {
  const { startTransition } = useTransition();

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Get click position for morphing animation
    const clickPosition = {
      x: e.clientX,
      y: e.clientY,
    };

    // Call any custom onClick handler first
    if (onClick) {
      onClick(e);
    }

    // Start morphing transition (loader animates in, then navigates)
    await startTransition(href, clickPosition);
  };

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
