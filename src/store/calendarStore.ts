import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    category: 'Assignment' | 'Deadline' | 'Personal' | 'Study';
}

interface CalendarState {
    customEvents: CalendarEvent[];
    hiddenAcademicIds: string[];
    
    // Actions
    fetchEvents: (userId: string) => Promise<void>;
    addEvent: (event: Omit<CalendarEvent, 'id'>, userId: string) => Promise<void>;
    removeEvent: (id: string) => Promise<void>;
    hideAcademicEvent: (id: string) => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
    customEvents: [],
    hiddenAcademicIds: [],

    fetchEvents: async (userId: string) => {
        // Fetch from 'user_calendar_events' table (assumed to exist for this refactor)
        const { data } = await supabase.from('user_calendar_events').select('*').eq('user_id', userId);
        if (data) {
            set({ customEvents: data as CalendarEvent[] });
        }
    },

    addEvent: async (event, userId) => {
        // For demo mode or if insert fails, we still want to show it in UI
        const { data, error } = await supabase.from('user_calendar_events').insert({ ...event, user_id: userId }).select().single();
        
        if (error) {
            console.warn('DB Insert failed, using local fallback for demo:', error.message);
            // Fallback: Create a local-only event with a mock ID
            const fallbackEvent: CalendarEvent = {
                ...event,
                id: Math.random().toString(36).substring(7),
            };
            set((state) => ({ customEvents: [...state.customEvents, fallbackEvent] }));
        } else if (data) {
            set((state) => ({ customEvents: [...state.customEvents, data as CalendarEvent] }));
        }
    },

    removeEvent: async (id) => {
        await supabase.from('user_calendar_events').delete().eq('id', id);
        set((state) => ({ customEvents: state.customEvents.filter(e => e.id !== id) }));
    },

    hideAcademicEvent: (id) => set((state) => ({ hiddenAcademicIds: [...state.hiddenAcademicIds, id] })),
}));
