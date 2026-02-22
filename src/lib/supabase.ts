// ─── Supabase client for Expo / React Native ──────────────────────────────────
// Uses expo-secure-store for token persistence (safer than AsyncStorage for auth tokens)
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import type { Database } from './types/database.types';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON) {
    // Only alert if we are not in development to avoid annoying developers, 
    // but in a built APK this is critical.
    if (!__DEV__) {
        Alert.alert(
            'Configuration Error',
            'Supabase credentials are missing. Please ensure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are set in your build environment (EAS Secrets).'
        );
    }
    console.error('[Supabase Client Error] Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY environment variables.');
}

// expo-secure-store adapter for @supabase/supabase-js
const ExpoSecureStoreAdapter = {
    getItem: (key: string) => SecureStore.getItemAsync(key),
    setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
    removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient<Database>(
    SUPABASE_URL || 'https://placeholder.supabase.co',
    SUPABASE_ANON || 'placeholder-anon-key',
    {
        auth: {
            storage: ExpoSecureStoreAdapter,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false, // not needed in React Native
        },
    }
);

export type { Database };
