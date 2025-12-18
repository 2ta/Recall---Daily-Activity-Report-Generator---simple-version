
import React from 'react';
import { X, Shield, Lock, Globe, Database } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full h-full md:h-auto md:max-w-2xl bg-slate-900 md:border md:border-slate-800 md:rounded-3xl shadow-2xl flex flex-col max-h-[100dvh] md:max-h-[85vh] animate-in slide-in-from-bottom md:zoom-in-95 duration-300">
        
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">Privacy & Security</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar space-y-8 text-sm md:text-base leading-relaxed text-slate-300">
          <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50 flex gap-4">
            <Lock className="w-6 h-6 text-indigo-400 shrink-0" />
            <div>
              <h4 className="font-semibold text-slate-100 mb-1">Your data stays with you.</h4>
              <p className="text-xs text-slate-400 leading-normal">Recall is built with a local-first philosophy. We don't want your secrets, and we don't have a way to see them.</p>
            </div>
          </div>

          <section>
            <div className="flex items-center gap-2 mb-3 text-slate-100 font-bold uppercase tracking-wider text-xs">
              <Database className="w-4 h-4 text-indigo-500" />
              <span>1. Local Storage</span>
            </div>
            <p>Every activity you log is stored exclusively on your device's internal storage (LocalStorage). We do not send your logs to any central database or cloud server.</p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3 text-slate-100 font-bold uppercase tracking-wider text-xs">
              <Globe className="w-4 h-4 text-indigo-500" />
              <span>2. Analytics & Improvements</span>
            </div>
            <p>To help us prioritize features, we collect <strong>anonymous</strong> usage data. This includes events like clicking "Export" or interacting with "Coming Soon" buttons. This data contains no personally identifiable information (PII) and no content from your logs.</p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-3 text-slate-100 font-bold uppercase tracking-wider text-xs">
              <Shield className="w-4 h-4 text-indigo-500" />
              <span>3. AI Features (Experimental)</span>
            </div>
            <p>When you use upcoming AI features, your logs may be processed temporarily to generate summaries. In this version, these features are for demonstration and waitlist registration only.</p>
          </section>

          <div className="pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-500 italic">
              By using Recall, you agree that your data is stored locally and you are responsible for its backup (via the Export tool).
            </p>
          </div>
        </div>

        <div className="p-5 md:p-6 border-t border-slate-800 bg-slate-900/80 backdrop-blur pb-safe">
           <button 
             onClick={onClose}
             className="w-full py-4 text-base font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
           >
             Got it, thanks!
           </button>
        </div>
      </div>
    </div>
  );
};
