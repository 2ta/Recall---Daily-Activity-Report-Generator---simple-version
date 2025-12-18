import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { LogEntry } from '../types';

interface CalendarViewProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
  currentDate: Date;
  onSelectDate: (date: Date) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ isOpen, onClose, logs, currentDate, onSelectDate }) => {
  const [viewDate, setViewDate] = useState(new Date(currentDate));

  if (!isOpen) return null;

  const startOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const endOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);
  const daysInMonth = endOfMonth.getDate();
  const startDayOfWeek = startOfMonth.getDay();

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const getLogsCountForDay = (day: number) => {
    const targetDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day).toDateString();
    return logs.filter(log => new Date(log.timestamp).toDateString() === targetDate).length;
  };

  const getIntensityColor = (count: number) => {
    if (count === 0) return 'bg-transparent border-slate-800/50';
    if (count <= 3) return 'bg-indigo-500/10 border-indigo-500/20 text-indigo-200';
    if (count <= 7) return 'bg-indigo-500/30 border-indigo-500/40 text-indigo-100';
    if (count <= 12) return 'bg-indigo-500/60 border-indigo-500/60 text-white';
    return 'bg-indigo-500 border-indigo-400 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]';
  };

  const days = [];
  // Add empty slots for the start of the month
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="h-14 md:h-20" />);
  }

  // Add month days
  for (let day = 1; day <= daysInMonth; day++) {
    const count = getLogsCountForDay(day);
    const isToday = new Date().toDateString() === new Date(viewDate.getFullYear(), viewDate.getMonth(), day).toDateString();
    const isSelected = currentDate.toDateString() === new Date(viewDate.getFullYear(), viewDate.getMonth(), day).toDateString();

    days.push(
      <button
        key={day}
        onClick={() => {
          onSelectDate(new Date(viewDate.getFullYear(), viewDate.getMonth(), day));
          onClose();
        }}
        className={`relative h-14 md:h-20 border rounded-xl flex flex-col items-center justify-center transition-all hover:scale-105 active:scale-95 group ${getIntensityColor(count)} ${isSelected ? 'ring-2 ring-white/50 border-white/50' : ''}`}
      >
        <span className={`text-sm md:text-lg font-medium ${isToday ? 'text-indigo-400' : ''}`}>{day}</span>
        {count > 0 && (
          <span className="text-[10px] md:text-xs opacity-60 font-mono mt-1 group-hover:opacity-100">
            {count} {count === 1 ? 'log' : 'logs'}
          </span>
        )}
        {isToday && (
          <div className="absolute top-1 right-1 md:top-2 md:right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full" />
        )}
      </button>
    );
  }

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(viewDate);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-white">{monthName}</h2>
            <div className="flex gap-1">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 md:p-6 bg-slate-900/30">
          <div className="grid grid-cols-7 gap-2 md:gap-3 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 pb-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 md:gap-3">
            {days}
          </div>
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between items-center text-[10px] md:text-xs text-slate-500">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-1.5">
               <div className="w-3 h-3 rounded-sm border border-slate-800" />
               <span>None</span>
             </div>
             <div className="flex items-center gap-1.5">
               <div className="w-3 h-3 rounded-sm bg-indigo-500/30" />
               <span>Low</span>
             </div>
             <div className="flex items-center gap-1.5">
               <div className="w-3 h-3 rounded-sm bg-indigo-500" />
               <span>High</span>
             </div>
          </div>
          <p>Click a day to jump to its logs</p>
        </div>
      </div>
    </div>
  );
};