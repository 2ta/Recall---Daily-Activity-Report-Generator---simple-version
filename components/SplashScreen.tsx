
import React, { useEffect, useState } from 'react';
import { Logo } from './Logo';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [opacity, setOpacity] = useState(1);
  const [scale, setScale] = useState(0.9);

  useEffect(() => {
    // Initial entrance scale
    const scaleTimer = setTimeout(() => setScale(1), 50);
    
    // Start exit fade
    const fadeTimer = setTimeout(() => setOpacity(0), 2200);
    
    // Complete
    const completeTimer = setTimeout(() => onComplete(), 2600);

    return () => {
      clearTimeout(scaleTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 z-[500] bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-500 ease-in-out"
      style={{ opacity }}
    >
      <div 
        className="flex flex-col items-center gap-8 transition-transform duration-1000 ease-out"
        style={{ transform: `scale(${scale})` }}
      >
        <Logo size="lg" showText={true} className="drop-shadow-[0_0_30px_rgba(99,102,241,0.4)]" />
        
        <div className="flex flex-col items-center gap-4">
          <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-[progress_2s_ease-in-out_infinite]" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">
            Local-First Memory
          </span>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 40%; }
          100% { width: 100%; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
