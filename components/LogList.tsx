
import React, { useRef, useEffect, useState } from 'react';
import { LogEntry } from '../types';
import { Trash2, Circle, Sparkles, Pencil, Check, X, Clock, MoreHorizontal } from 'lucide-react';

interface LogListProps {
  logs: LogEntry[];
  onDeleteLog: (id: string) => void;
  onUpdateLog: (id: string, content: string) => void;
}

export const LogList: React.FC<LogListProps> = ({ logs, onDeleteLog, onUpdateLog }) => {
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
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
      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 p-6 text-center animate-in fade-in duration-700">
        <div className="w-16 h-16 bg-slate-900/50 rounded-3xl flex items-center justify-center mb-6 border border-slate-800 shadow-inner">
          <Circle className="w-8 h-8 opacity-20" />
        </div>
        <h3 className="text-lg font-bold text-slate-200 mb-2">No logs today</h3>
        <p className="max-w-[200px] text-xs text-slate-500 leading-relaxed font-medium">
          Capture small moments as they happen.
        </p>
      </div>
    );
  }

  const handleStartEdit = (log: LogEntry) => {
    setEditingId(log.id);
    setEditContent(log.content);
    setActiveMenuId(null);
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
    <div 
      className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-10 space-y-8 custom-scrollbar"
      onClick={() => setActiveMenuId(null)} // Click outside to close menus
    >
      <div className="max-w-2xl mx-auto space-y-10 pb-10">
        {hours.map(hour => (
          <div key={hour} className="relative">
            <div className="sticky top-0 z-10 flex items-center mb-4 py-2 bg-slate-950/40 backdrop-blur-sm -mx-4 px-4">
               <div className="bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-indigo-300 shadow-lg flex items-center gap-2">
                 <Clock className="w-3 h-3" />
                 {new Date(0,0,0, hour).toLocaleTimeString([], { hour: 'numeric', hour12: true })}
               </div>
               <div className="h-px bg-slate-800/40 flex-1 ml-3"></div>
            </div>
            
            <div className="space-y-4 md:space-y-6 pl-4 md:pl-10 border-l border-slate-800/60 ml-3.5 md:ml-6">
              {groupedLogs[hour].map((log) => (
                <div key={log.id} className="group relative flex items-start gap-3 animate-in slide-in-from-left-2 duration-300">
                   {/* Timeline Node */}
                   <div className={`absolute -left-[20.5px] md:-left-[44.5px] top-5 w-3 h-3 rounded-full transition-all z-0 border-2 ${log.isHighlight ? 'bg-amber-400 border-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.6)]' : 'bg-slate-950 border-slate-800 group-hover:border-indigo-500'}`}></div>
                   
                   <div className={`flex-1 rounded-2xl p-4 transition-all border ${
                     log.isHighlight 
                      ? 'bg-amber-500/5 border-amber-500/20 shadow-[inset_0_0_20px_rgba(251,191,36,0.02)]' 
                      : 'bg-slate-900/40 hover:bg-slate-900/60 border-slate-800/50 hover:border-slate-700/80'
                   } ${editingId === log.id ? 'ring-2 ring-indigo-500/40 border-indigo-500 bg-slate-950 shadow-2xl scale-[1.01]' : ''}`}>
                      
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1 min-w-0">
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
                            <p className={`text-[15px] leading-relaxed whitespace-pre-wrap tracking-tight break-words ${log.isHighlight ? 'text-amber-50' : 'text-slate-200'}`}>
                              {log.content}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-0.5 shrink-0 relative" onClick={e => e.stopPropagation()}>
                          {editingId === log.id ? (
                            <>
                              <button onClick={handleSaveEdit} className="w-10 h-10 flex items-center justify-center text-green-400 hover:bg-green-400/10 rounded-full active:scale-90"><Check className="w-5 h-5" /></button>
                              <button onClick={handleCancelEdit} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-800 rounded-full active:scale-90"><X className="w-5 h-5" /></button>
                            </>
                          ) : (
                            <>
                              {/* Desktop: Show icons on hover */}
                              <div className="hidden md:flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleStartEdit(log)} className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-indigo-400 rounded-full active:scale-90 transition-colors"><Pencil className="w-4 h-4" /></button>
                                <button onClick={() => onDeleteLog(log.id)} className="w-9 h-9 flex items-center justify-center text-slate-500 hover:text-red-400 rounded-full active:scale-90 transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </div>

                              {/* Mobile: 3-dots menu */}
                              <div className="md:hidden relative">
                                <button 
                                  onClick={() => setActiveMenuId(activeMenuId === log.id ? null : log.id)}
                                  className="w-8 h-8 flex items-center justify-center text-slate-500 active:text-white"
                                >
                                  <MoreHorizontal className="w-5 h-5" />
                                </button>
                                
                                {activeMenuId === log.id && (
                                  <div className="absolute right-0 top-full mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-1.5 flex flex-col z-50 min-w-[120px] animate-in fade-in zoom-in-95 duration-200">
                                    <button 
                                      onClick={() => handleStartEdit(log)}
                                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800 rounded-lg w-full text-left"
                                    >
                                      <Pencil className="w-4 h-4" /> Edit
                                    </button>
                                    <button 
                                      onClick={() => {
                                        onDeleteLog(log.id);
                                        setActiveMenuId(null);
                                      }}
                                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:bg-red-950/30 rounded-lg w-full text-left"
                                    >
                                      <Trash2 className="w-4 h-4" /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {editingId !== log.id && (
                        <div className="mt-2.5 flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 font-black tracking-widest uppercase">
                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {log.isHighlight && (
                            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-amber-500">
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
