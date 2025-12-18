
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const sizes = {
    sm: { icon: 'w-6 h-6', text: 'text-lg' },
    md: { icon: 'w-8 h-8', text: 'text-2xl' },
    lg: { icon: 'w-12 h-12', text: 'text-4xl' }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      <div className={`relative ${currentSize.icon}`}>
        {/* Logo Glow Effect */}
        <div className="absolute inset-0 bg-indigo-500/30 blur-lg rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 w-full h-full drop-shadow-sm"
        >
          {/* Main Path - Stylized 'R' / Circuit Loop */}
          <path 
            d="M30 85V25C30 16.7157 36.7157 10 45 10H65C73.2843 10 80 16.7157 80 25V35C80 43.2843 73.2843 50 65 50H30L75 85" 
            stroke="url(#recall-gradient)" 
            strokeWidth="12" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="transition-all duration-500 group-hover:stroke-indigo-400"
          />
          
          {/* Terminal Node (The "Memory Point") */}
          <circle 
            cx="75" 
            cy="85" 
            r="8" 
            fill="#818cf8" 
            className="animate-pulse"
          />
          
          <defs>
            <linearGradient id="recall-gradient" x1="30" y1="10" x2="80" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6366f1" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <span className={`${currentSize.text} font-black tracking-[0.2em] text-white transition-colors duration-300 group-hover:text-indigo-100`}>
          RECALL
        </span>
      )}
    </div>
  );
};
