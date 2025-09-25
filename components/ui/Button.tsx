'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'lightBg';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
}

export const Button = ({
  variant = 'filled',
  size = 'md',
  children,
  className,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles =
    'relative inline-block font-medium transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden';

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-8 py-4 text-lg rounded-lg',
    lg: 'px-8 py-3 text-xl rounded-lg',
  };

  const variantStyles = {
    filled: `
      filled
      gradient-primary text-[var(--color-black)] font-semibold
      bg-[length:200%_200%] bg-left
      shadow-lg hover:shadow-xl
      transition-all duration-500 ease-in-out
      before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.4),transparent)] 
      before:translate-x-[-100%] hover:before:translate-x-[100%]
      before:transition-transform before:duration-700 before:ease-in-out
    `,

    outlined: `
      outlined
      border-2 border-[var(--primary-color)] text-[var(--primary-color)]
      bg-transparent
      transition-all duration-300 ease-in-out
      hover:text-[var(--color-black)] hover:bg-[var(--primary-color)]
      hover:shadow-[0_0_20px_var(--primary-color)]
      before:content-[''] before:absolute before:inset-0 before:bg-[var(--primary-color)] before:opacity-0
      hover:before:opacity-10 before:transition-opacity before:duration-500
    `,

    lightBg: `
      lightBg
      bg-[var(--primary-color)]/10 text-[var(--primary-color)]
      hover:bg-[var(--primary-color)]/20
      border border-[var(--primary-color)]/30
    `,
  };

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        isLoading && 'pointer-events-none',
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
