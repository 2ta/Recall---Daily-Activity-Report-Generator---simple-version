
import { supabase, isSupabaseConfigured } from './supabaseClient';

export const analytics = {
  async trackEvent(eventName: string, metadata: any = {}): Promise<void> {
    console.log(`[Analytics] ${eventName}`, metadata);
    if (!isSupabaseConfigured || !supabase) return;
    
    try {
      // Track general events
      await supabase
        .from('analytics_events')
        .insert([
          { 
            event_name: eventName, 
            metadata, 
            timestamp: new Date().toISOString(),
            device_id: localStorage.getItem('recall_device_id') || 'unknown'
          }
        ]);
        
      // If it's a waitlist signup, also store it in a dedicated table for easier export
      if (eventName === 'waitlist_signup') {
        await supabase
          .from('waitlist')
          .insert([
            {
              email: metadata.email,
              feature: metadata.feature,
              device_id: localStorage.getItem('recall_device_id') || 'unknown'
            }
          ]);
      }
    } catch (e) {
      console.error('Failed to track event:', e);
    }
  }
};

// Device ID for anonymous tracking
if (!localStorage.getItem('recall_device_id')) {
  localStorage.setItem('recall_device_id', crypto.randomUUID());
}
