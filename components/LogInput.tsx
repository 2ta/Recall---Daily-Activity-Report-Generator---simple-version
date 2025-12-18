
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';

interface LogInputProps {
  onAddLog: (content: string) => void;
  onMicClick: () => void;
}

export const LogInput: React.FC<LogInputProps> = ({ onAddLog, onMicClick }) => {
  const [input, setInput] = useState('');
  const [placeholder, setPlaceholder] = useState('What happened just now?');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 5) setPlaceholder("Working late? Log it here.");
    else if (hour < 11) setPlaceholder("What's the first win of the day?");
    else if (hour < 14) setPlaceholder("Mid-day update: What's done?");
    else if (hour < 18) setPlaceholder("What are you working on?");
    else if (hour < 22) setPlaceholder("Reflect on the evening...");
    else setPlaceholder("Wrapping up? Log your final thoughts.");
  }, []);

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
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="flex-none bg-slate-900/90 backdrop-blur-3xl border-t border-slate-800/40 z-30 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.6)]">
      <div className="p-3 md:p-6 max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
          <button
            type="button"
            onClick={onMicClick}
            className="w-12 h-12 flex items-center justify-center rounded-2xl text-slate-400 bg-slate-800/40 hover:bg-slate-800 hover:text-indigo-400 transition-all active:scale-90 shrink-0 border border-slate-700/30"
            title="Voice input"
          >
            <Mic className="w-6 h-6" />
          </button>
          
          <div className="flex-1 relative bg-slate-800/60 rounded-2xl border border-slate-700/50 flex items-end overflow-hidden focus-within:border-indigo-500/50 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full bg-transparent border-none focus:ring-0 text-slate-100 placeholder-slate-500 resize-none py-3.5 px-4 max-h-[120px] min-h-[48px] text-[16px] leading-snug tracking-tight"
              rows={1}
              style={{ caretColor: '#818cf8' }}
            />
          </div>
          
          <button 
            type="submit"
            disabled={!input.trim()}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-20 disabled:grayscale transition-all shadow-[0_4px_15px_rgba(79,70,229,0.3)] active:scale-90 shrink-0"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};
