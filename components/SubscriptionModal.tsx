import React, { useState } from 'react';
import { Check, X, Zap, Crown, ArrowRight, Loader2, Lock, ShieldCheck } from 'lucide-react';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleUpgradeClick = () => {
    setIsProcessing(true);
    // Simulate Stripe Checkout redirection and processing
    setTimeout(() => {
      onUpgrade();
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm transition-opacity" 
        onClick={!isProcessing ? onClose : undefined} 
      />
      
      {/* Scrollable Container */}
      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-4 sm:my-8 text-left">
            {!isProcessing && (
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors z-20 backdrop-blur-sm"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="grid md:grid-cols-2">
              {/* Free Plan */}
              <div className="p-6 md:p-12 flex flex-col h-full border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/50 order-2 md:order-1">
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-slate-400 mb-2">Basic</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl md:text-4xl font-bold text-white">Free</span>
                    <span className="text-slate-500">/ forever</span>
                  </div>
                  <p className="text-slate-400 mt-4 text-sm leading-relaxed">
                    Perfect for simple daily logging and keeping track of your activities manually.
                  </p>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-slate-300 text-sm md:text-base">
                    <div className="p-1 rounded-full bg-slate-800 shrink-0"><Check className="w-3 h-3" /></div>
                    Unlimited text logs
                  </li>
                  <li className="flex items-center gap-3 text-slate-300 text-sm md:text-base">
                    <div className="p-1 rounded-full bg-slate-800 shrink-0"><Check className="w-3 h-3" /></div>
                    Local data storage
                  </li>
                  <li className="flex items-center gap-3 text-slate-500 text-sm md:text-base opacity-50">
                    <div className="p-1 rounded-full bg-slate-800/50 shrink-0"><X className="w-3 h-3" /></div>
                    AI Daily Analysis
                  </li>
                  <li className="flex items-center gap-3 text-slate-500 text-sm md:text-base opacity-50">
                    <div className="p-1 rounded-full bg-slate-800/50 shrink-0"><X className="w-3 h-3" /></div>
                    Manager Reports
                  </li>
                  <li className="flex items-center gap-3 text-slate-500 text-sm md:text-base opacity-50">
                    <div className="p-1 rounded-full bg-slate-800/50 shrink-0"><X className="w-3 h-3" /></div>
                    Voice-to-Text Input
                  </li>
                </ul>

                <button 
                  onClick={onClose}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl border border-slate-700 text-slate-400 font-medium hover:bg-slate-800 transition-colors md:hidden disabled:opacity-50"
                >
                  Stay on Free
                </button>
                <button 
                  disabled
                  className="w-full py-3 rounded-xl bg-slate-800 text-slate-500 font-medium cursor-default hidden md:block"
                >
                  Current Plan
                </button>
              </div>

              {/* Pro Plan */}
              <div className="p-6 md:p-12 flex flex-col h-full relative overflow-hidden order-1 md:order-2">
                <div className="absolute top-0 right-0 p-3 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-bl-3xl">
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold uppercase tracking-wider px-2">
                    <Crown className="w-3 h-3" /> Recommended
                  </div>
                </div>

                <div className="mb-6 mt-2 md:mt-0">
                  <h3 className="text-xl font-medium text-amber-400 mb-2 flex items-center gap-2">
                    Pro <Zap className="w-4 h-4 fill-current" />
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl md:text-4xl font-bold text-white">$8.00</span>
                    <span className="text-slate-500">/ month</span>
                  </div>
                  <p className="text-slate-400 mt-4 text-sm leading-relaxed">
                    Unlock the full power of AI to analyze your day and generate professional reports instantly.
                  </p>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-white text-sm md:text-base">
                    <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400 shrink-0"><Check className="w-3 h-3" /></div>
                    <span>All Free features</span>
                  </li>
                  <li className="flex items-center gap-3 text-white text-sm md:text-base">
                    <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400 shrink-0"><Check className="w-3 h-3" /></div>
                    <span><strong>AI Analysis</strong> & Highlights</span>
                  </li>
                  <li className="flex items-center gap-3 text-white text-sm md:text-base">
                    <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400 shrink-0"><Check className="w-3 h-3" /></div>
                    <span><strong>Weekly Manager Reports</strong></span>
                  </li>
                  <li className="flex items-center gap-3 text-white text-sm md:text-base">
                    <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400 shrink-0"><Check className="w-3 h-3" /></div>
                    <span><strong>Voice-to-Text</strong> Dictation</span>
                  </li>
                </ul>

                <div className="space-y-3">
                  <button 
                    onClick={handleUpgradeClick}
                    disabled={isProcessing}
                    className="group relative w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/25 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 disabled:scale-100 disabled:bg-indigo-700"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Redirecting to Stripe...</span>
                      </>
                    ) : (
                      <>
                        Upgrade to Pro <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                  
                  <div className="flex items-center justify-center gap-4 text-[10px] md:text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Secure SSL</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Stripe Checkout</span>
                    </div>
                    <div className="h-3 w-px bg-slate-800" />
                    <span>Cancel anytime</span>
                  </div>
                </div>

                {/* Stripe Branding */}
                <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-center">
                  <div className="flex items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Powered by</span>
                    <svg viewBox="0 0 60 25" className="h-4 fill-slate-300">
                      <path d="M59.64 14.28c0-4.59-2.31-7.16-6.1-7.16-3.72 0-6.03 2.57-6.03 7.16 0 5.22 2.49 7.39 6.2 7.39 1.62 0 3.09-.3 4.14-.84v-2.82c-.93.45-2.04.72-3.15.72-1.92 0-3.15-.9-3.15-3.18h9.09c0-.27.03-.54.03-.84zm-9.06-1.47c0-1.83.99-2.85 2.52-2.85s2.52 1.02 2.52 2.85h-5.04zm-14.07-5.65c-2.34 0-3.66 1.17-4.14 1.83v-1.62h-3.9v18.78l3.96-.84V16.38c.48.57 1.8 1.62 4.08 1.62 3.6 0 6.06-2.52 6.06-7.11s-2.46-7.14-6.06-7.14zm-1.14 10.32c-1.92 0-2.94-1.35-2.94-3.18 0-1.89 1.02-3.21 2.94-3.21 1.95 0 2.97 1.32 2.97 3.21 0 1.83-1.02 3.18-2.97 3.18zm-11.43-1.83l-3.24-9.33h-4.08l5.22 13.92-4.17 9.42 4.14-.87 9.33-13.14h-4.08l-3.12 4.17zm-11.16-8.49h-3.96v7.14c0 1.29.93 2.16 2.22 2.16.48 0 .81-.06 1.05-.15v-2.82l-.48.09c-.54 0-.75-.24-.75-.72V7.17zm0-5.16h-3.96v3.96h3.96V2.01zm-7.62 5.16h-3.96v7.35c0 1.26-1.14 2.13-2.61 2.13-1.44 0-2.46-.87-2.46-2.13V7.17H.12v7.74c0 3.39 2.58 5.46 5.88 5.46 2.22 0 3.66-.99 4.38-1.86v1.47l3.96-.84V7.17z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};