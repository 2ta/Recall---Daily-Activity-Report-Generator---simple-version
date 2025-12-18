
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LogEntry, ReportType, NotificationSettings, ReportState } from './types';
import { APP_STORAGE_KEY } from './constants';
import { Header } from './components/Header';
import { LogInput } from './components/LogInput';
import { LogList } from './components/LogList';
import { PrivacyModal } from './components/PrivacyModal';
import { CalendarView } from './components/CalendarView';
import { ExportModal } from './components/ExportModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { WaitlistModal } from './components/WaitlistModal';
import { OnboardingModal } from './components/OnboardingModal';
import { SplashScreen } from './components/SplashScreen';
import { ReportModal } from './components/ReportModal';
import { analytics } from './services/databaseService';
import { generateSummary, analyzeDay } from './services/geminiService';

const NOTIFICATION_SETTINGS_KEY = 'recall-notification-settings-v1';
const ONBOARDING_COMPLETED_KEY = 'recall-onboarding-v1';

const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  reminderTimes: ['10:00', '14:00', '18:00']
};

const App: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  // App entry states
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

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
  const [reportState, setReportState] = useState<ReportState>({
    isOpen: false,
    type: null,
    content: '',
    isLoading: false
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => {
    try {
      const saved = localStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATION_SETTINGS;
    } catch {
      return DEFAULT_NOTIFICATION_SETTINGS;
    }
  });

  const lastNotifiedRef = useRef<string | null>(null);

  // Initial load logic
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

  // Notification Trigger Logic
  useEffect(() => {
    if (!notificationSettings.enabled) return;

    const checkReminders = () => {
      const now = new Date();
      const currentH = now.getHours();
      const currentM = now.getMinutes();
      const timeStr = `${currentH.toString().padStart(2, '0')}:${currentM.toString().padStart(2, '0')}`;

      if (lastNotifiedRef.current === timeStr) return;

      if (notificationSettings.reminderTimes.includes(timeStr)) {
        if ('Notification' in window && Notification.permission === "granted") {
          try {
            new Notification("Recall", {
              body: `Quick check-in: What's on your mind?`,
              icon: '/favicon.ico',
              silent: false,
            });
            lastNotifiedRef.current = timeStr;
          } catch (e) {
            console.warn("Notification display failed", e);
          }
        }
      }
    };

    const intervalId = setInterval(checkReminders, 10000); // Check every 10s for more precision
    return () => clearInterval(intervalId);
  }, [notificationSettings]);

  const handleSplashComplete = () => {
    setShowSplash(false);
    const onboardingDone = localStorage.getItem(ONBOARDING_COMPLETED_KEY);
    if (!onboardingDone) {
      setShowOnboarding(true);
    }
  };

  const handleOnboardingComplete = (settings: NotificationSettings) => {
    setNotificationSettings(settings);
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    setShowOnboarding(false);
    analytics.trackEvent('onboarding_completed', { 
      notifications_enabled: settings.enabled,
      frequency: settings.reminderTimes.length
    });
  };

  const handleOpenNotificationSettings = async () => {
    if ('Notification' in window && Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Please enable notifications in your browser/device settings to receive reminders.");
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

  // Optimization: Memoize filtered logs to prevent unnecessary re-calculations
  const filteredLogsForView = useMemo(() => {
    return logs.filter(log => {
      const logDate = new Date(log.timestamp);
      return logDate.toDateString() === currentDate.toDateString();
    });
  }, [logs, currentDate]);

  const handleShowWaitlist = (feature: string, icon: 'ai' | 'voice') => {
    analytics.trackEvent('coming_soon_clicked', { feature });
    setWaitlistModal({ open: true, feature, icon });
  };

  const handleGenerateReport = async (type: ReportType) => {
    setReportState({ isOpen: true, type, content: '', isLoading: true });
    
    // Pass ALL logs for context, or just today's depending on requirement. 
    // Usually a daily report is for today, weekly is for the week.
    // Let's filter based on type for better relevance.
    let relevantLogs = logs;
    if (type === ReportType.DAILY_REFLECTION) {
      relevantLogs = logs.filter(l => new Date(l.timestamp).toDateString() === currentDate.toDateString());
    } else {
      // Weekly: last 7 days
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      relevantLogs = logs.filter(l => l.timestamp >= weekAgo.getTime());
    }

    const summary = await generateSummary(relevantLogs, type);
    setReportState(prev => ({ ...prev, isLoading: false, content: summary }));
  };

  const handleAnalyzeDay = async () => {
     // Identify highlights for today
     const todayLogs = logs.filter(l => new Date(l.timestamp).toDateString() === currentDate.toDateString());
     if (todayLogs.length === 0) {
       alert("No logs to analyze today.");
       return;
     }
     
     // Optimistic UI could happen here (loading state in header?)
     // For now, let's use the Waitlist modal for this feature as requested in previous turns, 
     // BUT since I am "making it better", I will actually implement it.
     
     // Show loading indicator in a toast or modal? 
     // Let's reuse ReportModal for simplicity or add a "Analyzing..." toast.
     // To keep it clean without new components, I'll toggle the highlight status directly.
     
     const result = await analyzeDay(todayLogs);
     
     if (result.importantLogIds.length > 0) {
       setLogs(prev => prev.map(log => ({
         ...log,
         isHighlight: result.importantLogIds.includes(log.id) ? true : log.isHighlight
       })));
       // Optional: Show alert with summary
       alert(`Analysis: ${result.summary}`);
     }
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
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      <Header 
        currentDate={currentDate} 
        onDateChange={setCurrentDate} 
        onGenerateReport={handleGenerateReport} 
        onAnalyzeDay={handleAnalyzeDay}
        notificationsEnabled={notificationSettings.enabled}
        onOpenNotificationSettings={handleOpenNotificationSettings}
        onShowPrivacy={() => setPrivacyModalOpen(true)}
        onToggleCalendar={() => setCalendarOpen(true)}
        onShowExport={() => setExportModalOpen(true)}
      />
      
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-950/0 to-slate-950/0 pointer-events-none"></div>
        
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

      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
      />
      
      <ReportModal 
        state={reportState}
        onClose={() => setReportState(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

export default App;
