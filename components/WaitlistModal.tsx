
import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles, Mic, Mail, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { analytics } from '../services/databaseService';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  featureIcon: 'ai' | 'voice';
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose, featureName, featureIcon }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  useEffect(() => {
    if (!isOpen) {
      setStatus('idle');
      setEmail('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === 'submitting') return;
    
    setStatus('submitting');
    
    // Track event
    await analytics.trackEvent('waitlist_signup', { feature: featureName, email });
    
    setStatus('success');
    
    // Auto-close after delay
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-slate-900 border-t md:border border-slate-800 rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 md:zoom-in-95">
        <div className="p-8 pb-12 md:pb-8">
          <div className="w-12 h-1.5 bg-slate-800 rounded-full mx-auto mb-6 md:hidden" />
          
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors bg-slate-800/50 rounded-full md:bg-transparent"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 shadow-2xl transition-transform hover:scale-110 duration-500 ${featureIcon === 'ai' ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
              {featureIcon === 'ai' ? <Sparkles className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
            </div>

            <h2 className="text-2xl font-black text-white mb-3 tracking-tight">{featureName}</h2>
            
            {status === 'success' ? (
              <div className="flex flex-col items-center gap-4 py-8 animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <p className="text-xl font-bold text-white">You're on the list!</p>
                  <p className="text-slate-400 text-sm mt-1">We'll email you as soon as we launch.</p>
                </div>
              </div>
            ) : (
              <>
                <p className="text-slate-400 text-sm mb-10 leading-relaxed px-4">
                  We're putting the finishing touches on our {featureName.toLowerCase()} features. Join our inner circle for early access.
                </p>

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        type="email"
                        required
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-14 pr-4 py-4.5 text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder-slate-600"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-black py-4.5 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 active:scale-95 text-lg"
                  >
                    {status === 'submitting' ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>Join Waitlist <ArrowRight className="w-5 h-5" /></>
                    )}
                  </button>
                </form>
                
                <p className="mt-6 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                  Secure & Privacy Protected
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
