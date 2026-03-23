import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const GlassCard = ({ children, className, hoverEffect = true, ...props }: GlassCardProps) => {
  return (
    <div 
      className={cn(
        "glass-panel p-6 transition-all duration-500",
        hoverEffect && "hover:translate-y-[-4px] hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(255,215,0,0.05)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children?: React.ReactNode;
  className?: string;
}

export const GlassButton = ({ variant = 'primary', children, className, ...props }: any) => {
  const variants = {
    primary: "bg-[var(--gold-primary)] text-black font-bold shadow-[0_0_20px_var(--gold-glow)] hover:brightness-110",
    secondary: "bg-[var(--glass-bg)] text-white hover:bg-white/10 border border-[var(--glass-border)]",
    outline: "border border-[var(--gold-primary)]/30 text-[var(--gold-primary)] hover:bg-[var(--gold-primary)]/5",
  };

  return (
    <button 
      className={cn(
        "px-6 py-2.5 rounded-xl transition-all duration-300 active:scale-95 disabled:opacity-50 backdrop-blur-md",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export const GlassInput = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input 
      className={cn(
        "w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[var(--gold-primary)]/50 transition-all",
        className
      )}
      {...props}
    />
  );
};
