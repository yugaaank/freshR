import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export interface Landmark {
    id: string;
    name: string;
    category: string;
    floor: string;
    distance: string;
    icon: string;
    color: string;
    available: boolean;
    opens: string;
    lat: number;
    lng: number;
}

export function useLandmarks() {
    return useQuery({
        queryKey: ['landmarks'],
        queryFn: async () => {
            const { data, error } = await supabase.from('landmarks').select('*');
            if (error) throw error;
            return (data ?? []) as Landmark[];
        },
        staleTime: 5 * 60_000,
    });
}
