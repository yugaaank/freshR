import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
    getUserCalendarEvents, 
    createCalendarEvent, 
    updateCalendarEvent, 
    deleteCalendarEvent,
    UserCalendarEvent 
} from '../lib/db/calendar';

export const calendarKeys = {
    all: (uid: string) => ['calendar_events', uid] as const,
};

export function usePersonalEvents(userId: string | null) {
    return useQuery({
        queryKey: calendarKeys.all(userId ?? ''),
        queryFn: () => getUserCalendarEvents(userId!),
        enabled: !!userId,
        staleTime: 30_000,
    });
}

export function useCreateCalendarEvent(userId: string | null) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (event: Omit<UserCalendarEvent, 'id' | 'user_id' | 'created_at' | 'updated_at'>) =>
            createCalendarEvent(userId!, event),
        onSuccess: () => {
            if (userId) qc.invalidateQueries({ queryKey: calendarKeys.all(userId) });
        },
    });
}

export function useUpdateCalendarEvent(userId: string | null) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (vars: { id: string; updates: Partial<UserCalendarEvent> }) =>
            updateCalendarEvent(vars.id, vars.updates),
        onSuccess: () => {
            if (userId) qc.invalidateQueries({ queryKey: calendarKeys.all(userId) });
        },
    });
}

export function useDeleteCalendarEvent(userId: string | null) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteCalendarEvent(id),
        onSuccess: () => {
            if (userId) qc.invalidateQueries({ queryKey: calendarKeys.all(userId) });
        },
    });
}
