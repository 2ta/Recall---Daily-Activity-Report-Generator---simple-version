
import React, { useRef, useEffect, useState } from 'react';
import { LogEntry } from '../types';
import { Trash2, Circle, Sparkles, Pencil, Check, X, Clock } from 'lucide-react';

interface LogListProps {
  logs: LogEntry[];
  onDeleteLog: (id: string) => void;
  onUpdateLog: (id: string, content: string) => void;
}

export const LogList: React.FC<LogListProps> = ({ logs, onDeleteLog, onUpdateLog }) => {
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const editInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollEndRef.current && !editingId) {
      scrollEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs.length, editingId]);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.selectionStart = editInputRef.current.value.length;
      editInputRef.current.selectionEnd = editInputRef.current.value.length;
      editInputRef.current.style.height = 'auto';
      editInputRef.current.style.height = `${editInputRef.current.scrollHeight}px`;
    }
  }, [editingId]);

  if (logs.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-10 text-center animate-in fade-in duration-700">
        <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-slate-800 shadow-inner">
          <Circle className="w-10 h-10 opacity-20" />
        </div>
        <h3 className="text-xl font-bold text-slate-300 mb-2">Your timeline is empty</h3>
        <p className="max-w-[240px] text-sm text-slate-500 leading-relaxed">
          Log your activities as they happen to stay on top of your day.
        </p>
      </div>
    );
  }

  const handleStartEdit = (log: LogEntry) => {
    setEditingId(log.id);
    setEditContent(log.content);
  };

  const handleSaveEdit = () => {
    if (editingId && editContent.trim()) {
      onUpdateLog(editingId, editContent.trim());
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const groupedLogs = logs.reduce((acc, log) => {
    const hour = new Date(log.timestamp).getHours();
    if (!acc[hour]) acc[hour] = [];
    acc[hour].push(log);
    return acc;
  }, {} as Record<number, LogEntry[]>);

  const hours = Object.keys(groupedLogs).map(Number).sort((a, b) => a - b);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 custom-scrollbar">
      <div className="max-w-3xl mx-auto space-y-10 pb-10">
        {hours.map(hour => (
          <div key={hour} className="relative">
            <div className="sticky top-0 z-10 flex items-center mb-6 py-2">
               <div className="bg-slate-900/95 backdrop-blur-md border border-slate-800 px-4 py-1.5 rounded-2xl text-[11px] font-black uppercase tracking-tighter text-indigo-400 shadow-xl flex items-center gap-2">
                 <Clock className="w-3 h-3" />
                 {new Date(0,0,0, hour).toLocaleTimeString([], { hour: 'numeric', hour12: true })}
               </div>
               <div className="h-px bg-slate-800/60 flex-1 ml-4"></div>
            </div>
            
            <div className="space-y-6 pl-5 md:pl-10 border-l-2 border-slate-800/50 ml-4 md:ml-6">
              {groupedLogs[hour].map((log) => (
                <div key={log.id} className="group relative flex items-start gap-4 animate-in slide-in-from-left-2 duration-300">
                   <div className={`absolute -left-[27px] md:-left-[47px] top-6 w-3 h-3 md:w-4 md:h-4 rounded-full transition-all z-0 border-2 ${log.isHighlight ? 'bg-amber-400 border-amber-500 shadow-[0_0_12px_rgba(251,191,36,0.6)]' : 'bg-slate-900 border-slate-700 group-hover:border-indigo-500'}`}></div>
                   
                   <div className={`flex-1 rounded-2xl p-4 md:p-5 transition-all border ${
                     log.isHighlight 
                      ? 'bg-amber-500/5 border-amber-500/20 hover:bg-amber-500/10' 
                      : 'bg-slate-900/40 hover:bg-slate-800/30 border-slate-800/40 hover:border-slate-700/60'
                   } ${editingId === log.id ? 'ring-2 ring-indigo-500/40 border-indigo-500 bg-slate-950 shadow-2xl scale-[1.01]' : ''}`}>
                      
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          {editingId === log.id ? (
                            <textarea
                              ref={editInputRef}
                              value={editContent}
                              onChange={(e) => {
                                setEditContent(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = `${e.target.scrollHeight}px`;
                              }}
                              onKeyDown={handleKeyDown}
                              className="w-full bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 resize-none p-0 text-base leading-relaxed"
                              rows={1}
                            />
                          ) : (
                            <p className={`text-[15px] md:text-base leading-relaxed whitespace-pre-wrap tracking-tight ${log.isHighlight ? 'text-amber-100 font-medium' : 'text-slate-200'}`}>
                              {log.content}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {editingId === log.id ? (
                            <>
                              <button 
                                onClick={handleSaveEdit}
                                className="p-2 text-green-400 hover:bg-green-400/10 rounded-xl transition-all active:scale-90"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={handleCancelEdit}
                                className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 rounded-xl transition-all active:scale-90"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </>
                          ) : (
                            <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => handleStartEdit(log)}
                                className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-xl transition-all active:scale-90"
                              >
                                <Pencil className="w-4.5 h-4.5" />
                              </button>
                              <button 
                                onClick={() => onDeleteLog(log.id)}
                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all active:scale-90"
                              >
                                <Trash2 className="w-4.5 h-4.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {editingId !== log.id && (
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[10px] md:text-xs text-slate-500 font-black tracking-widest uppercase flex items-center gap-1.5">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {log.isHighlight && (
                            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-amber-500 px-2 py-0.5 rounded-full bg-amber-500/10">
                              <Sparkles className="w-2.5 h-2.5" /> Highlight
                            </span>
                          )}
                        </div>
                      )}
                   </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div ref={scrollEndRef} className="h-10" />
      </div>
    </div>
  );
};
