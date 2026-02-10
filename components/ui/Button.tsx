import React, { useState } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  isLoading?: boolean;
  tooltip?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  tooltip, 
  className = '', 
  icon,
  onClick,
  disabled,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const baseStyles = "relative flex items-center justify-center gap-2 px-6 py-3 font-mono text-sm font-medium tracking-wide transition-all duration-200 rounded-sm focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-nerve-primary text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] border border-transparent hover:border-nerve-primary/50",
    secondary: "bg-transparent border border-nerve-border text-nerve-text hover:border-nerve-primary hover:text-nerve-primary hover:shadow-[0_0_10px_rgba(59,130,246,0.2)]",
    danger: "bg-nerve-danger/10 border border-nerve-danger/30 text-nerve-danger hover:bg-nerve-danger/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]",
    success: "bg-nerve-success/10 border border-nerve-success/30 text-nerve-success hover:bg-nerve-success/20 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]",
    ghost: "bg-transparent text-nerve-muted hover:text-white hover:bg-white/5",
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200); // Reset shake
    if (onClick) onClick(e);
  };

  return (
    <div className="relative group inline-block">
      <button
        className={`
          ${baseStyles} 
          ${variants[variant]} 
          ${isClicked ? 'animate-shake' : ''} 
          ${className}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : icon}
        
        {children}

        {/* Hover glow effect overlay */}
        {variant === 'primary' && !disabled && (
          <div className={`absolute inset-0 bg-nerve-primary/20 blur-xl transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        )}
      </button>

      {/* Tooltip */}
      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-nerve-card border border-nerve-border text-xs text-nerve-muted whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
          {tooltip}
        </div>
      )}
    </div>
  );
};