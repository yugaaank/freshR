import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { CampusAlert } from '../lib/types/database.types';

export const alertKeys = { all: ['campus_alerts'] as const };

async function fetchAlerts(): Promise<CampusAlert[]> {
    const { data, error } = await supabase
        .from('campus_alerts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as CampusAlert[];
}

/** Fetch + live-refresh campus alerts via Supabase Realtime */
export function useCampusAlerts() {
    const query = useQuery({
        queryKey: alertKeys.all,
        queryFn: fetchAlerts,
        staleTime: 30_000,
    });

    // Subscribe to INSERT/UPDATE/DELETE on campus_alerts in realtime
    useEffect(() => {
        const channel = supabase
            .channel('campus_alerts_live')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'campus_alerts' },
                () => { query.refetch(); },
            )
            .subscribe();
        return () => { channel.unsubscribe(); };
    }, [query]);

    return query;
}
