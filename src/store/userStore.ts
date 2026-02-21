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

    // Derived/Demo State (to be moved to DB later, but keeping for now to replace hybridStore)
    followedClubs: string[];
    registeredEvents: string[];
    interestScore: Record<string, number>;

    // Actions
    initialize: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
    signUpWithEmail: (email: string, password: string, metadata: any) => Promise<{ error: string | null }>;
    signInWithPhone: (phone: string) => Promise<{ error: string | null }>;
    verifyOtp: (phone: string, token: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
    demoLogin: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    setInterests: (interests: Interest[]) => void;
    toggleInterest: (interest: Interest) => void;
    completeOnboarding: () => void;

    // Actions moved from hybridStore
    followClub: (clubId: string) => void;
    registerEvent: (eventId: string, category?: string) => void;
    unregisterEvent: (eventId: string) => void;

    // Legacy compat
    isLoggedIn: boolean;
    isDemo: boolean;
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
    isDemo: false,

    followedClubs: ['c0000001-0000-0000-0000-000000000001'],
    registeredEvents: [],
    interestScore: { Tech: 5, Creative: 2, Academic: 1, Social: 3 },

    initialize: async () => {
        console.log('[Store Debug] initialize starting...');
        set({ isLoading: true });

        // hydrate from existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
            console.log('[Store Debug] Session found during hydration');
            let profile = await getProfile(session.user.id).catch(() => null);
            if (!profile) {
                // Fallback for demo if profile somehow wasn't created
                profile = {
                    id: session.user.id,
                    name: session.user.email?.split('@')[0] || 'User',
                    college: 'Campus',
                    branch: 'General',
                    year: 1,
                } as any;
            }
            set({
                session,
                authUser: session.user,
                profile,
                interests: (profile?.interests ?? []) as Interest[],
                isLoggedIn: true,
            });
        }

        // listen for auth state changes
        supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('[Store Debug] onAuthStateChange event:', event);
            if (get().isDemo) {
                console.log('[Store Debug] isDemo is true, ignoring auth change');
                return;
            }
            if (session?.user) {
                const profile = await getProfile(session.user.id).catch(() => null);
                set({
                    session,
                    authUser: session.user,
                    profile,
                    interests: (profile?.interests ?? []) as Interest[],
                    isLoggedIn: true,
                });
            } else if (event === 'SIGNED_OUT') {
                set({ session: null, authUser: null, profile: null, isLoggedIn: false });
            }
        });

        console.log('[Store Debug] initialize finishing, setting isLoading to false');
        set({ isLoading: false });
    },

    signInWithEmail: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error?.message ?? null };
    },

    signUpWithEmail: async (email, password, metadata) => {
        const { data, error } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                data: metadata
            }
        });
        if (error) return { error: error.message };
        
        if (data.user) {
            // Manually create profile for the demo since triggers might not be set up
            const { error: profileError } = await supabase.from('profiles').upsert({
                id: data.user.id,
                name: metadata.name,
                college: metadata.college,
                branch: metadata.branch || 'General',
                year: metadata.year || 1,
                updated_at: new Date().toISOString(),
            });
            if (profileError) console.error('Profile creation error:', profileError);
        }
        
        return { error: null };
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
        set({ session: null, authUser: null, profile: null, isLoggedIn: false, isDemo: false });
    },

    demoLogin: async () => {
        console.log('[Store Debug] demoLogin triggered');
        set({ isLoading: true });
        const demoId = '11111111-1111-1111-1111-111111111111';
        
        let profile = await getProfile(demoId).catch(() => null);
        
        if (!profile) {
            console.log('[Store Debug] DB fetch failed, using high-performance mock profile');
            profile = {
                id: demoId,
                name: 'Yugank Rathore',
                college: 'MIT Manipal',
                branch: 'CSE',
                year: 3,
                avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop',
                interests: ['tech', 'music', 'food']
            } as any;
        } else {
            console.log('[Store Debug] Demo profile fetched from DB successfully');
        }

        set({
            authUser: { id: demoId, email: 'yugaank@gmail.com' } as any,
            profile,
            interests: (profile?.interests ?? []) as Interest[],
            isLoggedIn: true,
            isDemo: true,
            isLoading: false
        });
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

    followClub: (clubId) => set((state) => ({
        followedClubs: state.followedClubs.includes(clubId)
            ? state.followedClubs.filter(id => id !== clubId)
            : [...state.followedClubs, clubId]
    })),

    registerEvent: (eventId, category) => set((state) => {
        if (state.registeredEvents.includes(eventId)) return state;
        const newInterests = { ...state.interestScore };
        if (category) {
            newInterests[category] = (newInterests[category] ?? 0) + 2;
        }
        return {
            registeredEvents: [...state.registeredEvents, eventId],
            interestScore: newInterests
        };
    }),

    unregisterEvent: (eventId) => set((state) => ({
        registeredEvents: state.registeredEvents.filter(id => id !== eventId)
    })),

    // Legacy shims (keep existing screens working without changes)
    login: (_phone) => set({ isLoggedIn: true }),
    logout: () => get().signOut(),
}));
