"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "orange" | "green" | "outlined";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
  href?: string;
  asLink?: boolean;
}

export const Button = ({
  variant = "orange",
  size = "md",
  children,
  className,
  isLoading = false,
  disabled,
  href,
  asLink = false,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "keyboard-focus-ring relative inline-flex items-center justify-center gap-2 font-bold transition-all duration-300 ease-out hover:scale-[1.02] text-nowrap active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";

  const sizeStyles = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-5 py-2.5 text-base rounded-lg",
    lg: "px-6 py-3 text-lg rounded-lg",
  };

  const variantStyles = {
    orange: `
      bg-secondary text-black
      hover:shadow-lg hover:shadow-secondary/25
    `,
    green: `
      bg-primary text-black
      hover:shadow-lg hover:shadow-primary/25
    `,
    outlined: `
      bg-transparent text-text/90 border border-border
      hover:border-text/55 hover:text-text
    `,
  };

  const combinedClassName = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    isLoading && "pointer-events-none",
    className
  );

  const content = isLoading ? (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      Loading...
    </div>
  ) : (
    children
  );

  if (asLink && href) {
    const isExternal = href.startsWith("http") || href.startsWith("mailto:");

    if (isExternal) {
      return (
        <a
          href={href}
          className={combinedClassName}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={combinedClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </button>
  );
};
