
import React from 'react';
import { X, Download, FileSpreadsheet, Calendar, Clock, Database, ChevronRight } from 'lucide-react';
import { LogEntry } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: LogEntry[];
  currentDate: Date;
  onExport: (period: 'day' | 'week' | 'all') => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, logs, currentDate, onExport }) => {
  if (!isOpen) return null;

  const stats = {
    day: logs.filter(l => new Date(l.timestamp).toDateString() === currentDate.toDateString()).length,
    week: logs.filter(l => {
      const now = new Date();
      const weekAgo = new Date().setDate(now.getDate() - 7);
      return l.timestamp >= weekAgo;
    }).length,
    all: logs.length
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full h-full md:h-auto md:max-w-md bg-slate-900 md:border md:border-slate-800 md:rounded-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom md:zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/50 backdrop-blur-xl z-10">
          <div className="flex items-center gap-3 text-indigo-400">
            <Download className="w-6 h-6" />
            <h2 className="text-xl font-black tracking-tight text-white">Export CSV</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-all active:scale-90">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <p className="text-sm md:text-base text-slate-400 font-medium leading-relaxed">
            Generate a local CSV file of your logged activities. Privacy first: this data never leaves your device.
          </p>

          <div className="space-y-3">
            <button 
              onClick={() => onExport('day')}
              className="w-full group flex items-center gap-4 p-4 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 hover:border-indigo-500/50 rounded-2xl transition-all active:scale-[0.98] text-left"
            >
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-100">Today</div>
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest">{stats.day} entries</div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-indigo-400" />
            </button>

            <button 
              onClick={() => onExport('week')}
              className="w-full group flex items-center gap-4 p-4 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 hover:border-indigo-500/50 rounded-2xl transition-all active:scale-[0.98] text-left"
            >
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-100">Last 7 Days</div>
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest">{stats.week} entries</div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-indigo-400" />
            </button>

            <button 
              onClick={() => onExport('all')}
              className="w-full group flex items-center gap-4 p-4 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 hover:border-indigo-500/50 rounded-2xl transition-all active:scale-[0.98] text-left"
            >
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-slate-100">Full History</div>
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest">{stats.all} entries</div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-700 group-hover:text-indigo-400" />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-4 bg-slate-900/80 border-t border-slate-800/50 text-[10px] text-center text-slate-500 uppercase tracking-widest font-black pb-safe">
          <div className="flex items-center justify-center gap-2 mb-2">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Standard CSV (RFC 4180)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
