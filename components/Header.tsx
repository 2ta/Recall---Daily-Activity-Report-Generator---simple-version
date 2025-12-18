
import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Sparkles, Download, Info } from 'lucide-react';
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
    <header className="flex-none h-16 md:h-20 border-b border-slate-800/50 bg-slate-900/50 backdrop-blur-xl px-2 md:px-6 flex items-center justify-between z-40">
      <div className="flex items-center gap-2">
        <Logo size="md" className="hidden xs:flex" />
        <Logo size="sm" showText={false} className="xs:hidden" />
      </div>

      <div className="flex items-center gap-0.5 md:gap-3 bg-slate-800/40 rounded-full px-1 py-1 border border-slate-700/30 shadow-inner">
        <button 
          onClick={handlePrevDay}
          className="p-2.5 md:p-3 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-all active:scale-75 active:bg-slate-600"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button 
          onClick={onToggleCalendar}
          className="flex items-center gap-2 min-w-[110px] md:min-w-[160px] justify-center text-xs md:text-sm font-black hover:bg-slate-700/50 rounded-full px-3 py-2.5 transition-all active:scale-95 active:bg-slate-700 uppercase tracking-tight"
        >
          <Calendar className="w-4 h-4 text-indigo-400 hidden xs:block" />
          <span className="text-slate-100">{formattedDate}</span>
        </button>

        <button 
          onClick={handleNextDay}
          disabled={isToday}
          className={`p-2.5 md:p-3 rounded-full transition-all active:scale-75 ${isToday ? 'text-slate-800 cursor-not-allowed opacity-30' : 'text-slate-400 hover:bg-slate-700 hover:text-white active:bg-slate-600'}`}
          aria-label="Next day"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-1 md:gap-3">
        <div className="flex items-center gap-0.5 md:gap-2">
          <button 
            onClick={onAnalyzeDay}
            className="p-2.5 md:px-4 md:py-3 text-sm font-black rounded-2xl text-amber-400 hover:bg-amber-500/10 transition-all flex items-center gap-2 active:scale-90 active:bg-amber-500/20"
            title="AI Highlight"
          >
            <Sparkles className="w-6 h-6" />
            <span className="hidden xl:inline uppercase tracking-widest">Analyze</span>
          </button>

          <button
            onClick={onShowExport}
            className="p-2.5 md:p-3.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-all active:scale-90"
            title="Export"
          >
            <Download className="w-6 h-6" />
          </button>

          <button
            onClick={onShowPrivacy}
            className="p-2.5 md:p-3.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-2xl transition-all active:scale-90"
            title="Info"
          >
            <Info className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};
