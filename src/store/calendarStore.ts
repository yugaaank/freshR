import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    time: string | null;
    location: string | null;
    category: string; // Exam, Event, Deadline, Personal
    priority: string; // Low, Medium, High
    notes: string | null;
    is_all_day: boolean;
    recurring: string | null;
    attachments: any[];
    tags: string[];
    estimated_effort: number;
    progress: number;
    subtasks: any[];
    due_date: string | null;
    difficulty: number;
}

interface ProductivityStats {
    weekly_score: number;
    procrastination_index: number;
    completion_rate: number;
    total_study_hours: number;
    peak_hours: number[];
    workload_heatmap: Record<string, number>;
}

interface CalendarState {
    customEvents: CalendarEvent[];
    hiddenAcademicIds: string[];
    stats: ProductivityStats | null;
    
    // Actions
    fetchEvents: (userId: string) => Promise<void>;
    fetchStats: (userId: string) => Promise<void>;
    addEvent: (event: Omit<CalendarEvent, 'id'>, userId: string) => Promise<void>;
    updateEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<void>;
    removeEvent: (id: string) => Promise<void>;
    hideAcademicEvent: (id: string) => void;
}

export const useCalendarStore = create<CalendarState>((set, get) => ({
    customEvents: [],
    hiddenAcademicIds: [],
    stats: null,

    fetchEvents: async (userId: string) => {
        const { data } = await supabase.from('user_calendar_events').select('*').eq('user_id', userId).order('date', { ascending: true });
        if (data) {
            set({ customEvents: data as CalendarEvent[] });
        }
    },

    fetchStats: async (userId: string) => {
        const { data } = await supabase.from('user_productivity').select('*').eq('user_id', userId).single();
        if (data) {
            set({ stats: data as ProductivityStats });
        }
    },

    addEvent: async (event, userId) => {
        const { data, error } = await supabase.from('user_calendar_events').insert({ ...event, user_id: userId }).select().single();
        
        if (error) {
            console.warn('DB Insert failed, using local fallback for demo:', error.message);
            const fallbackEvent: CalendarEvent = {
                ...event,
                id: Math.random().toString(36).substring(7),
                priority: event.priority || 'Medium',
                is_all_day: event.is_all_day || false,
                attachments: event.attachments || [],
                tags: event.tags || [],
                estimated_effort: event.estimated_effort || 1,
                progress: event.progress || 0,
                subtasks: event.subtasks || [],
                difficulty: event.difficulty || 3,
                notes: event.notes || null,
                recurring: event.recurring || null,
                due_date: event.due_date || null,
            };
            set((state) => ({ customEvents: [...state.customEvents, fallbackEvent] }));
        } else if (data) {
            set((state) => ({ customEvents: [...state.customEvents, data as CalendarEvent] }));
        }
    },

    updateEvent: async (id, updates) => {
        const { error } = await supabase.from('user_calendar_events').update(updates as any).eq('id', id);
        if (!error) {
            set((state) => ({
                customEvents: state.customEvents.map((e) => (e.id === id ? { ...e, ...updates } : e)),
            }));
        }
    },

    removeEvent: async (id) => {
        await supabase.from('user_calendar_events').delete().eq('id', id);
        set((state) => ({ customEvents: state.customEvents.filter(e => e.id !== id) }));
    },

    hideAcademicEvent: (id) => set((state) => ({ hiddenAcademicIds: [...state.hiddenAcademicIds, id] })),
}));
