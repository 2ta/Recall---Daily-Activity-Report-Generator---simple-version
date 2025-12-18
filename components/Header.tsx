
import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Sparkles, Download, Info, Bell, BellOff } from 'lucide-react';
import { ReportType } from '../types';
import { Logo } from './Logo';

interface HeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onGenerateReport: (type: ReportType) => void;
  onAnalyzeDay: () => void;
  notificationsEnabled: boolean;
  onOpenNotificationSettings: () => void;
  onShowPrivacy: () => void;
  onToggleCalendar: () => void;
  onShowExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentDate, 
  onDateChange, 
  onGenerateReport,
  onAnalyzeDay,
  notificationsEnabled,
  onOpenNotificationSettings,
  onShowPrivacy,
  onToggleCalendar,
  onShowExport
}) => {
  const isToday = new Date().toDateString() === currentDate.toDateString();

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    if (isToday) return;
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    onDateChange(newDate);
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(currentDate);

  return (
    <header className="flex-none pt-safe h-[calc(64px+env(safe-area-inset-top))] md:h-20 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-2xl px-2 md:px-6 flex items-center justify-between z-40">
      <div className="flex items-center ml-1">
        <Logo size="md" className="hidden xs:flex" />
        <Logo size="sm" showText={false} className="xs:hidden" />
      </div>

      <div className="flex items-center gap-0.5 bg-slate-950/40 rounded-full p-1 border border-slate-800/50 shadow-inner">
        <button 
          onClick={handlePrevDay}
          className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all active:scale-75"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button 
          onClick={onToggleCalendar}
          className="flex items-center gap-1.5 min-w-[100px] md:min-w-[140px] justify-center text-[11px] md:text-sm font-black hover:bg-slate-800 rounded-full px-2 py-2 transition-all active:scale-95 uppercase tracking-tighter"
        >
          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-100 whitespace-nowrap">{formattedDate}</span>
        </button>

        <button 
          onClick={handleNextDay}
          disabled={isToday}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-75 ${isToday ? 'text-slate-800 cursor-not-allowed opacity-20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          aria-label="Next day"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-0.5">
        <button 
          onClick={onOpenNotificationSettings}
          className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90 ${notificationsEnabled ? 'text-indigo-400 hover:bg-indigo-500/10' : 'text-slate-600 hover:bg-slate-800'}`}
          title="Notification Settings"
        >
          {notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
        </button>

        <button 
          onClick={onAnalyzeDay}
          className="w-10 h-10 flex items-center justify-center text-amber-400 hover:bg-amber-500/10 rounded-full transition-all active:scale-90"
          title="Analyze"
        >
          <Sparkles className="w-5 h-5" />
        </button>

        <button
          onClick={onShowExport}
          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all active:scale-90"
          title="Export"
        >
          <Download className="w-5 h-5" />
        </button>

        <button
          onClick={onShowPrivacy}
          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all active:scale-90"
          title="Info"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
