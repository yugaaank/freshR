import { supabase } from '../supabase';
import type { CalendarEvent, Tables } from '../types/database.types';

export type UserCalendarEvent = Tables<'user_calendar_events'>;

export async function getUserCalendarEvents(userId: string): Promise<UserCalendarEvent[]> {
    const { data, error } = await supabase
        .from('user_calendar_events')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });
    if (error) throw error;
    return (data ?? []) as UserCalendarEvent[];
}

export async function createCalendarEvent(
    userId: string, 
    event: Omit<UserCalendarEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<UserCalendarEvent> {
    const { data, error } = await supabase
        .from('user_calendar_events')
        .insert({ ...event, user_id: userId } as any)
        .select()
        .single();
    if (error) throw error;
    return data as UserCalendarEvent;
}

export async function updateCalendarEvent(
    id: string, 
    updates: Partial<Omit<UserCalendarEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<UserCalendarEvent> {
    const { data, error } = await supabase
        .from('user_calendar_events')
        .update({ ...updates, updated_at: new Date().toISOString() } as any)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data as UserCalendarEvent;
}

export async function deleteCalendarEvent(id: string): Promise<void> {
    const { error } = await supabase.from('user_calendar_events').delete().eq('id', id);
    if (error) throw error;
}
