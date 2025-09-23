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
  const baseStyles = 'inline-block font-medium transition-all duration-300 ease-out transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';
  
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm rounded-3xl',
    md: 'px-8 py-4 text-lg rounded-[40px]',
    lg: 'px-10 py-5 text-xl rounded-[40px]'
  };
  
  const variantStyles = {
    filled: 'gradient-primary text-black font-semibold hover:gradient-primary-hover hover:bg-right shadow-lg hover:shadow-xl',
    outlined: 'border-2 border-[var(--primary-color)] text-[var(--primary-color)] bg-transparent hover:gradient-primary hover:text-black hover:border-transparent',
    lightBg: 'bg-[var(--primary-color)]/10 text-[var(--primary-color)] hover:bg-[var(--primary-color)]/20 border border-[var(--primary-color)]/30'
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