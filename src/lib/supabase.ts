// ─── Supabase client for Expo / React Native ──────────────────────────────────
// Uses expo-secure-store for token persistence (safer than AsyncStorage for auth tokens)
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import type { Database } from './types/database.types';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// expo-secure-store adapter for @supabase/supabase-js
const ExpoSecureStoreAdapter = {
    getItem: (key: string) => SecureStore.getItemAsync(key),
    setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
    removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON, {
    auth: {
        storage: ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false, // not needed in React Native
    },
});

export type { Database };
