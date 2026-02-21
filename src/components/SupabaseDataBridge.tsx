import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';

/**
 * SupabaseDataBridge
 * 
 * Minimal headless component responsible for initializing the auth session.
 * Redundant store seeding has been removed in favor of direct TanStack Query usage.
 */
export default function SupabaseDataBridge() {
    const initialize = useUserStore((s) => s.initialize);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return null;
}
