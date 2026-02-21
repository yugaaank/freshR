import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import type { EventFilters, EventWithSeats } from '../lib/db/events';
import {
    getEventById,
    getEvents,
    getRegisteredEventIds,
    registerForEvent,
    subscribeToEventRegistrations,
    unregisterFromEvent,
} from '../lib/db/events';

// ─── Query keys ──────────────────────────────────────────────────────────────
export const eventKeys = {
    all: ['events'] as const,
    filtered: (f: EventFilters) => ['events', f] as const,
    detail: (id: string) => ['events', id] as const,
    registered: (uid: string) => ['events', 'registered', uid] as const,
};

/** All events with optional filters */
export function useEvents(filters: EventFilters = {}) {
    return useQuery({
        queryKey: eventKeys.filtered(filters),
        queryFn: () => getEvents(filters),
        staleTime: 60_000,
    });
}

/** Single event detail */
export function useEvent(id: string) {
    return useQuery({
        queryKey: eventKeys.detail(id),
        queryFn: () => getEventById(id),
        enabled: !!id,
        staleTime: 30_000,
    });
}

/** Event IDs the current user has registered for */
export function useRegisteredEvents(userId: string | null) {
    return useQuery({
        queryKey: eventKeys.registered(userId ?? ''),
        queryFn: () => getRegisteredEventIds(userId!),
        enabled: !!userId,
        staleTime: 60_000,
    });
}

/** Register/unregister mutation */
export function useRegisterEvent(userId: string | null) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ eventId, register }: { eventId: string; register: boolean }) =>
            register
                ? registerForEvent(userId!, eventId)
                : unregisterFromEvent(userId!, eventId),
        onSuccess: (_, { eventId }) => {
            qc.invalidateQueries({ queryKey: eventKeys.all });
            qc.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
            if (userId) qc.invalidateQueries({ queryKey: eventKeys.registered(userId) });
        },
    });
}

/** Live seat count for an event (real-time subscription) */
export function useEventSeats(eventId: string, initialCount = 0) {
    const [count, setCount] = useState(initialCount);
    const qc = useQueryClient();

    useEffect(() => {
        const channel = subscribeToEventRegistrations(eventId, (registered) => {
            setCount(registered);
            // also update the query cache
            qc.setQueryData<EventWithSeats | null>(eventKeys.detail(eventId), (old) =>
                old ? { ...old, registered_count: registered } : old,
            );
        });
        return () => { channel.unsubscribe(); };
    }, [eventId, qc]);

    return count;
}
