
import React, { useState, useRef } from 'react';
import { Send, Mic } from 'lucide-react';

interface LogInputProps {
  onAddLog: (content: string) => void;
  onMicClick: () => void;
}

export const LogInput: React.FC<LogInputProps> = ({ onAddLog, onMicClick }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;
    onAddLog(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  return (
    <div className="flex-none bg-slate-900 border-t border-slate-800/50 z-30 pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
      <div className="p-4 md:p-6">
        <div className="max-w-3xl mx-auto relative">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            <div className="relative flex items-end gap-3 bg-slate-800/90 backdrop-blur-2xl border border-slate-700/80 rounded-2xl md:rounded-[1.5rem] p-2 md:p-3 shadow-inner">
              <button
                type="button"
                onClick={onMicClick}
                className="p-3 md:p-3.5 rounded-xl text-slate-500 hover:text-indigo-400 hover:bg-slate-700/60 transition-all active:scale-90 shrink-0"
                title="Voice input (Coming Soon)"
              >
                <Mic className="w-5.5 h-5.5" />
              </button>
              
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Logged something?"
                className="w-full bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 resize-none py-3 max-h-[150px] min-h-[48px] text-[16px] md:text-[17px] leading-snug tracking-tight"
                rows={1}
              />
              
              <button 
                type="submit"
                disabled={!input.trim()}
                className="p-3.5 md:p-4 rounded-xl md:rounded-2xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-20 disabled:grayscale transition-all shadow-[0_4px_20px_rgba(79,70,229,0.3)] active:scale-90 shrink-0"
              >
                <Send className="w-5.5 h-5.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
