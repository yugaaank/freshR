import { supabase } from '../supabase';
import type { InsertTables, Profile } from '../types/database.types';

export type { Profile };

export async function getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
        .from('profiles').select('*').eq('id', userId).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data as Profile | null;
}

export async function upsertProfile(profile: InsertTables<'profiles'>): Promise<Profile> {
    const { data, error } = await supabase
        .from('profiles').upsert({ ...profile, updated_at: new Date().toISOString() } as any)
        .select().single();
    if (error) throw error;
    return data as Profile;
}

export async function updateInterests(userId: string, interests: string[]): Promise<void> {
    const { error } = await supabase
        .from('profiles').update({ interests, updated_at: new Date().toISOString() } as any).eq('id', userId);
    if (error) throw error;
}

export async function registerPushToken(
    userId: string, token: string, platform: 'ios' | 'android' | 'web',
): Promise<void> {
    const { error } = await supabase
        .from('push_notification_tokens').upsert({ user_id: userId, token, platform } as any);
    if (error) throw error;
}
