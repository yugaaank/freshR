import { supabase } from '../supabase';
import type { DBEvent, EventCategory } from '../types/database.types';

export type EventFilters = {
    category?: EventCategory;
    search?: string;
    isFeatured?: boolean;
    clubId?: string;
};

export type EventWithSeats = DBEvent & { seats_left: number };

function toEventWithSeats(e: DBEvent): EventWithSeats {
    return { ...e, seats_left: e.total_seats - e.registered_count };
}

export async function getEvents(filters: EventFilters = {}): Promise<EventWithSeats[]> {
    let query = supabase.from('events').select('*').order('date', { ascending: true });
    if (filters.category) query = query.eq('category', filters.category as any);
    if (filters.isFeatured) query = query.eq('is_featured', true);
    if (filters.clubId) query = query.eq('club_id', filters.clubId);
    if (filters.search) query = query.ilike('title', `%${filters.search}%`);
    const { data, error } = await query;
    if (error) throw error;
    return ((data ?? []) as DBEvent[]).map(toEventWithSeats);
}

export async function getEventById(id: string): Promise<EventWithSeats | null> {
    const { data, error } = await supabase
        .from('events').select('*').eq('id', id).single();
    if (error) throw error;
    return data ? toEventWithSeats(data as DBEvent) : null;
}

export async function registerForEvent(userId: string, eventId: string): Promise<void> {
    const { error: regError } = await supabase
        .from('event_registrations').insert({ user_id: userId, event_id: eventId } as any);
    if (regError && regError.code !== '23505') throw regError;
    const { error: incError } = await supabase.rpc('increment_event_registration' as any, { p_event_id: eventId } as any);
    if (incError) throw incError;
}

export async function unregisterFromEvent(userId: string, eventId: string): Promise<void> {
    const { error: delError } = await supabase
        .from('event_registrations').delete().eq('user_id', userId).eq('event_id', eventId);
    if (delError) throw delError;
    const { error: decError } = await supabase.rpc('decrement_event_registration' as any, { p_event_id: eventId } as any);
    if (decError) throw decError;
}

export async function getRegisteredEventIds(userId: string): Promise<string[]> {
    const { data, error } = await supabase
        .from('event_registrations').select('event_id').eq('user_id', userId);
    if (error) throw error;
    return ((data ?? []) as any[]).map((r) => r.event_id as string);
}

export function subscribeToEventRegistrations(
    eventId: string,
    onUpdate: (registeredCount: number) => void,
) {
    return supabase
        .channel(`event_seats:${eventId}`)
        .on('postgres_changes', {
            event: '*', schema: 'public', table: 'event_registrations', filter: `event_id=eq.${eventId}`,
        }, async () => {
            const { data } = await supabase.from('events').select('registered_count').eq('id', eventId).single();
            if (data) onUpdate((data as any).registered_count as number);
        })
        .subscribe();
}
