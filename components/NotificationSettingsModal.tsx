
import React, { useState } from 'react';
import { X, Bell, Plus, Trash2, Clock, Save, Timer, RefreshCcw, CalendarClock } from 'lucide-react';
import { NotificationSettings } from '../types';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: NotificationSettings;
  onSave: (settings: NotificationSettings) => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave
}) => {
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(settings);
  const [newTime, setNewTime] = useState('12:00');
  const [activeTab, setActiveTab] = useState<'manage' | 'generate'>('manage');
  
  // Generator states
  const [genStart, setGenStart] = useState('09:00');
  const [genEnd, setGenEnd] = useState('21:00');
  const [genInterval, setGenInterval] = useState(2);

  if (!isOpen) return null;

  const handleToggle = () => {
    setLocalSettings(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  const addTime = () => {
    if (!localSettings.reminderTimes.includes(newTime)) {
      const updatedTimes = [...localSettings.reminderTimes, newTime].sort();
      setLocalSettings(prev => ({ ...prev, reminderTimes: updatedTimes }));
    }
  };

  const removeTime = (time: string) => {
    setLocalSettings(prev => ({
      ...prev,
      reminderTimes: prev.reminderTimes.filter(t => t !== time)
    }));
  };

  const generateTimes = () => {
    const times: string[] = [];
    const start = parseInt(genStart.split(':')[0]);
    const end = parseInt(genEnd.split(':')[0]);
    
    for (let h = start; h <= end; h += genInterval) {
      times.push(`${h.toString().padStart(2, '0')}:00`);
    }
    
    setLocalSettings(prev => ({ ...prev, reminderTimes: times }));
    setActiveTab('manage');
  };

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-slate-900 border-t md:border border-slate-800 rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 md:zoom-in-95">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3 text-indigo-400">
            <Bell className="w-6 h-6" />
            <h2 className="text-xl font-black text-white tracking-tight">Reminders</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors active:scale-90">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Status Toggle */}
        <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-950/20">
          <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-3xl border border-slate-700/50">
            <div>
              <div className="font-bold text-slate-100">Status</div>
              <div className="text-[10px] uppercase font-black tracking-widest text-slate-500">
                {localSettings.enabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>
            <button 
              onClick={handleToggle}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all focus:outline-none ${localSettings.enabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-xl transition-transform ${localSettings.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-4 gap-2">
          <button 
            onClick={() => setActiveTab('manage')}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${activeTab === 'manage' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-transparent border-transparent text-slate-500'}`}
          >
            <Clock className="w-4 h-4" /> List
          </button>
          <button 
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-3 px-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all border ${activeTab === 'generate' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-transparent border-transparent text-slate-500'}`}
          >
            <Timer className="w-4 h-4" /> Generator
          </button>
        </div>

        <div className={`p-6 space-y-6 ${localSettings.enabled ? 'opacity-100' : 'opacity-20 pointer-events-none grayscale'}`}>
          
          {activeTab === 'manage' ? (
            <div className="space-y-4">
              <div className="space-y-2 max-h-[30vh] overflow-y-auto custom-scrollbar pr-2">
                {localSettings.reminderTimes.length === 0 && (
                  <div className="text-center py-10 bg-slate-950/30 rounded-3xl border border-dashed border-slate-800 text-slate-600 text-sm">
                    No reminders set
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {localSettings.reminderTimes.map(time => (
                    <div key={time} className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700/30 rounded-2xl group transition-all hover:border-slate-600">
                      <span className="font-mono text-lg font-bold text-slate-100">{time}</span>
                      <button 
                        onClick={() => removeTime(time)}
                        className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/50">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 ml-1">Add Individual Time</label>
                <div className="flex gap-2">
                  <input 
                    type="time" 
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-lg font-bold"
                  />
                  <button 
                    onClick={addTime}
                    className="w-16 h-16 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-2xl border border-slate-700 transition-all flex items-center justify-center active:scale-90"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Start Hour</label>
                  <input 
                    type="time" 
                    value={genStart} 
                    onChange={e => setGenStart(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-bold text-white focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 ml-1">End Hour</label>
                  <input 
                    type="time" 
                    value={genEnd} 
                    onChange={e => setGenEnd(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 font-bold text-white focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Interval (Every X Hours)</label>
                <div className="flex items-center gap-4 bg-slate-950 border border-slate-800 rounded-2xl p-2">
                   <button 
                     onClick={() => setGenInterval(Math.max(1, genInterval - 1))}
                     className="w-12 h-12 flex items-center justify-center bg-slate-900 rounded-xl text-white active:scale-75 transition-all"
                   >
                     -
                   </button>
                   <div className="flex-1 text-center font-black text-2xl text-indigo-400">
                     {genInterval} <span className="text-xs uppercase text-slate-500 tracking-widest">Hrs</span>
                   </div>
                   <button 
                     onClick={() => setGenInterval(Math.min(12, genInterval + 1))}
                     className="w-12 h-12 flex items-center justify-center bg-slate-900 rounded-xl text-white active:scale-75 transition-all"
                   >
                     +
                   </button>
                </div>
              </div>

              <button 
                onClick={generateTimes}
                className="w-full py-5 bg-indigo-600/10 hover:bg-indigo-600 border border-indigo-500/50 text-indigo-400 hover:text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl"
              >
                <RefreshCcw className="w-5 h-5" /> Generate Schedule
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-950/40 border-t border-slate-800 flex gap-4 pb-safe">
          <button 
            onClick={onClose}
            className="flex-1 py-5 text-sm font-black uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-5 bg-white text-slate-950 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-[0_10px_40px_rgba(255,255,255,0.1)] active:scale-95"
          >
            <Save className="w-5 h-5" /> Save
          </button>
        </div>
      </div>
    </div>
  );
};
