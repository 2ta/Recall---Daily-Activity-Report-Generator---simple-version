
import React, { useState, useEffect, useRef } from 'react';
import { LogEntry, ReportType, NotificationSettings } from './types';
import { APP_STORAGE_KEY } from './constants';
import { Header } from './components/Header';
import { LogInput } from './components/LogInput';
import { LogList } from './components/LogList';
import { PrivacyModal } from './components/PrivacyModal';
import { CalendarView } from './components/CalendarView';
import { ExportModal } from './components/ExportModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { WaitlistModal } from './components/WaitlistModal';
import { analytics } from './services/databaseService';

const NOTIFICATION_SETTINGS_KEY = 'recall-notification-settings-v1';

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  reminderTimes: ['10:00', '14:00', '18:00']
};

const App: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  // Modal states
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [notificationSettingsOpen, setNotificationSettingsOpen] = useState(false);
  const [waitlistModal, setWaitlistModal] = useState<{ open: boolean; feature: string; icon: 'ai' | 'voice' }>({ 
    open: false, 
    feature: '', 
    icon: 'ai' 
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATION_SETTINGS;
  });

  const lastNotifiedRef = useRef<string | null>(null);

  // Load logs (Local Only)
  useEffect(() => {
    const savedLogs = localStorage.getItem(APP_STORAGE_KEY);
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error("Failed to parse logs", e);
        setLogs([]);
      }
    }
  }, []);

  // Save logs to LocalStorage
  useEffect(() => {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(logs));
  }, [logs]);

  // Persist notification settings
  useEffect(() => {
    localStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  // Notification Logic
  useEffect(() => {
    if (!notificationSettings.enabled) return;

    const checkReminders = () => {
      const now = new Date();
      const currentH = now.getHours();
      const currentM = now.getMinutes();
      const timeStr = `${currentH.toString().padStart(2, '0')}:${currentM.toString().padStart(2, '0')}`;

      if (lastNotifiedRef.current === timeStr) return;

      if (notificationSettings.reminderTimes.includes(timeStr)) {
        if (Notification.permission === "granted") {
          new Notification("Recall Reminder", {
            body: `Take a moment to log your recent activities!`,
            icon: '/favicon.ico'
          });
          lastNotifiedRef.current = timeStr;
        }
      }
    };

    const intervalId = setInterval(checkReminders, 30000);
    return () => clearInterval(intervalId);
  }, [notificationSettings]);

  const handleOpenNotificationSettings = async () => {
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Please enable notifications in your browser to use reminders.");
        return;
      }
    }
    setNotificationSettingsOpen(true);
  };

  const handleAddLog = (content: string) => {
    const newLog: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      content,
      updatedAt: Date.now()
    };
    setLogs(prev => [...prev, newLog]);
  };

  const handleDeleteLog = (id: string) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      setLogs(prev => prev.filter(log => log.id !== id));
    }
  };

  const handleUpdateLog = (id: string, content: string) => {
    setLogs(prev => prev.map(log => log.id === id ? { ...log, content, updatedAt: Date.now() } : log));
  };

  const filteredLogsForView = logs.filter(log => {
    const logDate = new Date(log.timestamp);
    return logDate.toDateString() === currentDate.toDateString();
  });

  const handleShowWaitlist = (feature: string, icon: 'ai' | 'voice') => {
    analytics.trackEvent('coming_soon_clicked', { feature });
    setWaitlistModal({ open: true, feature, icon });
  };

  const exportToCSV = (period: 'day' | 'week' | 'all') => {
    analytics.trackEvent('export_clicked', { period });
    let targetLogs: LogEntry[] = [];
    let filename = `recall-export-${period}`;

    if (period === 'day') {
      targetLogs = logs.filter(l => new Date(l.timestamp).toDateString() === currentDate.toDateString());
      filename += `-${currentDate.toISOString().split('T')[0]}`;
    } else if (period === 'week') {
      const now = new Date();
      const weekAgo = new Date().setDate(now.getDate() - 7);
      targetLogs = logs.filter(l => l.timestamp >= weekAgo);
    } else {
      targetLogs = logs;
    }

    if (targetLogs.length === 0) {
      alert("No logs found for the selected period.");
      return;
    }

    const sortedLogs = [...targetLogs].sort((a, b) => a.timestamp - b.timestamp);

    const headers = ['Date', 'Time', 'Content'];
    const rows = sortedLogs.map(log => {
      const d = new Date(log.timestamp);
      return [
        d.toLocaleDateString(),
        d.toLocaleTimeString([], { hour12: false }),
        `"${log.content.replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvString = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportModalOpen(false);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans">
      <Header 
        currentDate={currentDate} 
        onDateChange={setCurrentDate} 
        onGenerateReport={() => handleShowWaitlist('AI Reports', 'ai')} 
        onAnalyzeDay={() => handleShowWaitlist('AI Highlights', 'ai')}
        notificationsEnabled={notificationSettings.enabled}
        onOpenNotificationSettings={handleOpenNotificationSettings}
        onShowPrivacy={() => setPrivacyModalOpen(true)}
        onToggleCalendar={() => setCalendarOpen(true)}
        onShowExport={() => setExportModalOpen(true)}
      />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950/0 to-slate-950/0 pointer-events-none"></div>
        
        <LogList 
          logs={filteredLogsForView} 
          onDeleteLog={handleDeleteLog} 
          onUpdateLog={handleUpdateLog}
        />
        
        <LogInput 
          onAddLog={handleAddLog} 
          onMicClick={() => handleShowWaitlist('Voice Input', 'voice')}
        />
      </main>

      <PrivacyModal 
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      <CalendarView
        isOpen={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        logs={logs}
        currentDate={currentDate}
        onSelectDate={setCurrentDate}
      />

      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        logs={logs}
        currentDate={currentDate}
        onExport={exportToCSV}
      />

      <NotificationSettingsModal
        isOpen={notificationSettingsOpen}
        onClose={() => setNotificationSettingsOpen(false)}
        settings={notificationSettings}
        onSave={setNotificationSettings}
      />

      <WaitlistModal
        isOpen={waitlistModal.open}
        onClose={() => setWaitlistModal({ ...waitlistModal, open: false })}
        featureName={waitlistModal.feature}
        featureIcon={waitlistModal.icon}
      />
    </div>
  );
};

export default App;
