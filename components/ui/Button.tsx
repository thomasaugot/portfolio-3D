"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "outlined" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
}

export const Button = ({
  variant = "filled",
  size = "md",
  children,
  className,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "relative inline-flex flex-1 text-nowrap items-center justify-center font-medium transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100";

  const sizeStyles = {
    sm: "px-4 py-2 text-sm rounded-xl",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-6 py-3 text-lg rounded-xl",
  };

  const variantStyles = {
    filled: `
      gradient-primary text-black font-semibold
      bg-[length:200%_200%] bg-left
      shadow-lg hover:shadow-xl
      transition-all duration-500 ease-in-out
      overflow-hidden
      before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.4),transparent)] 
      before:translate-x-[-100%] hover:before:translate-x-[100%]
      before:transition-transform before:duration-700 before:ease-in-out
    `,
    outlined: `
  relative overflow-hidden
  bg-[var(--color-bg)] text-[var(--color-text)] font-semibold
  border-2 border-transparent
  [background-image:linear-gradient(var(--color-bg),var(--color-bg)),linear-gradient(222deg,var(--primary-color)_67.22%,var(--secondary-color)_93.57%)]
  [background-origin:border-box,border-box]
  [background-clip:padding-box,border-box]
  before:content-[''] before:absolute before:inset-0 before:-z-10
  before:bg-[radial-gradient(circle_at_center,var(--primary-color)_0%,var(--secondary-color)_100%)]
  before:scale-[0.3] before:opacity-0 before:blur-xl
  hover:before:scale-[1.5] hover:before:opacity-100 hover:before:blur-0
  before:transition-all before:duration-1000 before:ease-[cubic-bezier(0.19,1,0.22,1)]
  hover:text-black
  transition-colors duration-500
`,

    ghost: `
      bg-transparent text-muted hover:text-text hover:bg-surface
      transition-all duration-300
    `,
  };

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        isLoading && "pointer-events-none",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};
