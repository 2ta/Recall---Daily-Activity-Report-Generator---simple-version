
import React, { useId } from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const gradientId = useId();
  
  const sizes = {
    sm: { icon: 'w-7 h-7', text: 'text-lg' },
    md: { icon: 'w-9 h-9', text: 'text-2xl' },
    lg: { icon: 'w-14 h-14', text: 'text-4xl' }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      <div className={`relative ${currentSize.icon}`}>
        {/* Subtle persistent glow to ensure visibility on pitch black backgrounds */}
        <div className="absolute inset-0 bg-indigo-500/20 blur-md rounded-full scale-125 opacity-100 group-hover:bg-indigo-400/40 transition-all duration-500" />
        
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 w-full h-full drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
        >
          {/* Main Path - Stylized 'R' / Circuit Loop */}
          <path 
            d="M30 85V25C30 16.7157 36.7157 10 45 10H65C73.2843 10 80 16.7157 80 25V35C80 43.2843 73.2843 50 65 50H30L75 85" 
            stroke={`url(#${gradientId})`} 
            strokeWidth="14" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="transition-all duration-500 group-hover:stroke-indigo-300"
          />
          
          {/* Terminal Node (The "Memory Point") */}
          <circle 
            cx="75" 
            cy="85" 
            r="10" 
            fill="#a5b4fc" 
            className="animate-pulse shadow-lg"
          />
          
          <defs>
            <linearGradient id={gradientId} x1="30" y1="10" x2="80" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#818cf8" /> {/* Brighter Indigo-400 */}
              <stop offset="1" stopColor="#c084fc" /> {/* Brighter Purple-400 */}
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <span className={`${currentSize.text} font-black tracking-[0.2em] text-white transition-colors duration-300 group-hover:text-indigo-200 drop-shadow-md`}>
          RECALL
        </span>
      )}
    </div>
  );
};
