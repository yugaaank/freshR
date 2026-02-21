import type { Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';
import type { Profile } from '../lib/db/profile';
import { getProfile } from '../lib/db/profile';
import { supabase } from '../lib/supabase';

export type Interest =
    | 'Tech' | 'Design' | 'Music' | 'Sports' | 'Literature'
    | 'Gaming' | 'Finance' | 'Dance' | 'Photography' | 'Cooking'
    | 'Travel' | 'Fitness' | 'Art' | 'Science' | 'Movies';

interface UserStore {
    // Supabase auth
    session: Session | null;
    authUser: User | null;
    isLoading: boolean;

    // App profile (from profiles table)
    profile: Profile | null;
    interests: Interest[];
    hasCompletedOnboarding: boolean;

    // Actions
    initialize: () => Promise<void>;
    signInWithPhone: (phone: string) => Promise<{ error: string | null }>;
    verifyOtp: (phone: string, token: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    setInterests: (interests: Interest[]) => void;
    toggleInterest: (interest: Interest) => void;
    completeOnboarding: () => void;

    // Legacy compat
    isLoggedIn: boolean;
    login: (phone: string) => void;
    logout: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
    session: null,
    authUser: null,
    isLoading: true,
    profile: null,
    interests: ['Tech', 'Music', 'Gaming'],
    hasCompletedOnboarding: false,
    isLoggedIn: false,

    initialize: async () => {
        set({ isLoading: true });

        // hydrate from existing session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
            const profile = await getProfile(session.user.id).catch(() => null);
            set({
                session,
                authUser: session.user,
                profile,
                interests: (profile?.interests ?? []) as Interest[],
                isLoggedIn: true,
            });
        }

        // listen for auth state changes
        supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const profile = await getProfile(session.user.id).catch(() => null);
                set({
                    session,
                    authUser: session.user,
                    profile,
                    interests: (profile?.interests ?? []) as Interest[],
                    isLoggedIn: true,
                });
            } else {
                set({ session: null, authUser: null, profile: null, isLoggedIn: false });
            }
        });

        set({ isLoading: false });
    },

    signInWithPhone: async (phone) => {
        const { error } = await supabase.auth.signInWithOtp({ phone });
        return { error: error?.message ?? null };
    },

    verifyOtp: async (phone, token) => {
        const { error } = await supabase.auth.verifyOtp({ phone, token, type: 'sms' });
        return { error: error?.message ?? null };
    },

    signOut: async () => {
        await supabase.auth.signOut();
        set({ session: null, authUser: null, profile: null, isLoggedIn: false });
    },

    refreshProfile: async () => {
        const uid = get().authUser?.id;
        if (!uid) return;
        const profile = await getProfile(uid).catch(() => null);
        set({ profile, interests: (profile?.interests ?? []) as Interest[] });
    },

    setInterests: (interests) => set({ interests }),

    toggleInterest: (interest) => {
        const { interests } = get();
        set({
            interests: interests.includes(interest)
                ? interests.filter((i) => i !== interest)
                : [...interests, interest],
        });
    },

    completeOnboarding: () => set({ hasCompletedOnboarding: true }),

    // Legacy shims (keep existing screens working without changes)
    login: (_phone) => set({ isLoggedIn: true }),
    logout: () => get().signOut(),
}));
