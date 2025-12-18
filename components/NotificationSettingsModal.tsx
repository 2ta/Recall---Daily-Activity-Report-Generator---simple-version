import React, { useState } from 'react';
import { X, Bell, Plus, Trash2, Clock, Save } from 'lucide-react';
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

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3 text-indigo-400">
            <Bell className="w-6 h-6" />
            <h2 className="text-xl font-bold text-white">Reminders</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
            <div>
              <div className="font-semibold text-white">Daily Reminders</div>
              <div className="text-xs text-slate-500">Get prompted to log your work</div>
            </div>
            <button 
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${localSettings.enabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${localSettings.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className={localSettings.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Scheduled Times</label>
            
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
              {localSettings.reminderTimes.length === 0 && (
                <div className="text-center py-4 text-slate-600 text-sm italic">
                  No reminders scheduled yet
                </div>
              )}
              {localSettings.reminderTimes.map(time => (
                <div key={time} className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg group">
                  <div className="flex items-center gap-3 text-slate-200">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span className="font-mono">{time}</span>
                  </div>
                  <button 
                    onClick={() => removeTime(time)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex gap-2">
              <input 
                type="time" 
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
              />
              <button 
                onClick={addTime}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg border border-slate-700 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="flex-1 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};