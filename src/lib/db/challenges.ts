import { supabase } from '../supabase';
import type { Challenge, Tables, UserStreak } from '../types/database.types';

export type { Challenge, UserStreak };
export type Submission = Tables<'user_challenge_submissions'>;

export async function getTodayChallenge(): Promise<Challenge | null> {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
        .from('coding_challenges').select('*').lte('date', today)
        .order('date', { ascending: false }).limit(1).single();
    if (error) throw error;
    return data as Challenge | null;
}

export async function getPastChallenges(): Promise<Challenge[]> {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
        .from('coding_challenges').select('*').lt('date', today).order('date', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Challenge[];
}

export async function getUserStreak(userId: string): Promise<UserStreak | null> {
    const { data, error } = await supabase
        .from('user_streaks').select('*').eq('user_id', userId).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data as UserStreak | null;
}

export async function getSolvedChallengeIds(userId: string): Promise<string[]> {
    const { data, error } = await supabase
        .from('user_challenge_submissions').select('challenge_id').eq('user_id', userId);
    if (error) throw error;
    return ((data ?? []) as any[]).map((r) => r.challenge_id as string);
}

export async function submitSolution(
    userId: string, challengeId: string, language: string, code: string,
): Promise<void> {
    const { error: subError } = await supabase.from('user_challenge_submissions').upsert({
        user_id: userId, challenge_id: challengeId, language, code,
    } as any);
    if (subError) throw subError;

    const existing = await getUserStreak(userId);
    const today = new Date().toISOString().split('T')[0];
    const lastDate = existing?.last_solved_at;
    const isConsecutive = lastDate &&
        new Date(today).getTime() - new Date(lastDate).getTime() === 86_400_000;
    const newStreak = isConsecutive ? (existing!.current_streak + 1) : 1;
    const newLongest = Math.max(existing?.longest_streak ?? 0, newStreak);
    const newTotal = (existing?.total_solved ?? 0) + (lastDate === today ? 0 : 1);

    await supabase.from('user_streaks').upsert({
        user_id: userId, current_streak: newStreak, longest_streak: newLongest,
        total_solved: newTotal, last_solved_at: today,
    } as any);
}
