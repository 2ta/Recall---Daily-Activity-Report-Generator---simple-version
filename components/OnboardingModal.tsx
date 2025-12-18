
import React, { useState } from 'react';
import { Bell, Check, ArrowRight, Zap, Clock, ShieldCheck, Timer } from 'lucide-react';
import { Logo } from './Logo';
import { NotificationSettings } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (settings: NotificationSettings) => void;
}

type FrequencyOption = '1h' | '2h' | '4h' | '3x';

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [frequency, setFrequency] = useState<FrequencyOption>('2h');
  const [isRequesting, setIsRequesting] = useState(false);

  if (!isOpen) return null;

  const getTimesForFrequency = (f: FrequencyOption): string[] => {
    const times: string[] = [];
    const startHour = 9;
    const endHour = 21;

    if (f === '3x') {
      return ['10:00', '15:00', '20:00'];
    }

    const interval = f === '1h' ? 1 : f === '2h' ? 2 : 4;
    
    for (let h = startHour; h <= endHour; h += interval) {
      times.push(`${h.toString().padStart(2, '0')}:00`);
    }
    return times;
  };

  const handleStart = async () => {
    setIsRequesting(true);
    
    let granted = false;
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        granted = permission === 'granted';
      }
    } catch (e) {
      console.error("Notification request failed", e);
    }

    onComplete({
      enabled: granted,
      reminderTimes: getTimesForFrequency(frequency)
    });
  };

  const options: { id: FrequencyOption; label: string; desc: string; icon: React.ReactNode }[] = [
    { id: '1h', label: 'Every Hour', desc: 'Maximum awareness', icon: <Zap className="w-5 h-5" /> },
    { id: '2h', label: 'Every 2 Hours', desc: 'Balanced tracking', icon: <Timer className="w-5 h-5" /> },
    { id: '4h', label: 'Every 4 Hours', desc: 'Steady check-ins', icon: <Bell className="w-5 h-5" /> },
    { id: '3x', label: '3 Times Daily', desc: 'Minimal reminders', icon: <Clock className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-0 md:p-6">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" />
      
      <div className="relative w-full h-full md:h-auto md:max-w-lg bg-slate-900/50 md:border md:border-slate-800/50 md:rounded-[3rem] flex flex-col p-8 md:p-12 overflow-y-auto animate-in fade-in zoom-in-95 duration-500">
        
        <div className="flex flex-col items-center text-center space-y-6 pt-10 md:pt-0">
          <Logo size="lg" showText={false} className="mb-2" />
          
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              Never forget <br/><span className="text-indigo-400">your brilliance.</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base max-w-[280px] mx-auto leading-relaxed">
              Recall works best when you log moments as they happen. How often should we remind you?
            </p>
          </div>

          <div className="w-full space-y-3 pt-4">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFrequency(opt.id)}
                className={`w-full flex items-center gap-4 p-5 rounded-3xl border transition-all duration-300 active:scale-[0.98] ${
                  frequency === opt.id 
                    ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10' 
                    : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                  frequency === opt.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'
                }`}>
                  {opt.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-bold ${frequency === opt.id ? 'text-white' : 'text-slate-300'}`}>
                    {opt.label}
                  </div>
                  <div className="text-xs text-slate-500">{opt.desc}</div>
                </div>
                {frequency === opt.id && (
                  <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white animate-in zoom-in duration-300">
                    <Check className="w-4 h-4" strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="w-full pt-8 space-y-4">
            <button
              onClick={handleStart}
              disabled={isRequesting}
              className="w-full py-5 bg-white text-slate-950 font-black rounded-[2rem] flex items-center justify-center gap-3 text-lg hover:bg-indigo-50 transition-all shadow-2xl active:scale-95"
            >
              {isRequesting ? 'Setting up...' : 'Enable Reminders'}
              {!isRequesting && <ArrowRight className="w-5 h-5" />}
            </button>
            
            <button 
              onClick={() => onComplete({ enabled: false, reminderTimes: [] })}
              className="text-slate-500 text-xs font-bold uppercase tracking-widest hover:text-slate-300 transition-colors py-2"
            >
              Maybe later
            </button>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest pt-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Private & Local-First</span>
          </div>
        </div>
      </div>
    </div>
  );
};
