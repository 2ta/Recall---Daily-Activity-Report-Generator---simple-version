
export type SyncStatus = 'synced' | 'syncing' | 'error' | 'offline' | 'local-only';

export interface NotificationSettings {
  enabled: boolean;
  reminderTimes: string[]; // Array of "HH:mm" strings
}

export interface LogEntry {
  id: string;
  timestamp: number; // Unix timestamp in milliseconds
  content: string;
  tags?: string[];
  isHighlight?: boolean; // AI determined importance
  updatedAt: number; 
  isDeleted?: boolean; 
}

export enum ReportType {
  DAILY_REFLECTION = 'DAILY_REFLECTION',
  WEEKLY_MANAGER = 'WEEKLY_MANAGER'
}

export interface ReportState {
  isOpen: boolean;
  type: ReportType | null;
  content: string;
  isLoading: boolean;
}

// Fix: Export AnalysisResult interface for use in geminiService.ts
export interface AnalysisResult {
  summary: string;
  importantLogIds: string[];
}

// Fix: Export User interface for use in AuthModal.tsx
export interface User {
  id: string;
  name: string;
  email: string;
  tier: 'FREE' | 'PRO';
}
