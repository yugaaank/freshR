import { create } from 'zustand';

export type VibeTag = 'Competitive' | 'Creative' | 'Social' | 'Academic' | 'Tech';

// These interfaces remain identical to before so existing screen code needs no changes
export interface User {
    id: string;
    name: string;
    followedClubs: string[];
    interestScore: Record<string, number>;
    registeredEvents: string[];
}

export interface Club {
    id: string;
    name: string;
    logo: string;
    banner: string;
    tagline: string;
    vibeTag: VibeTag;
    followersCount: number;
}

export interface Event {
    id: string;
    clubId: string;
    host?: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    totalSeats: number;
    registeredCount: number;
    category: string;
    mediaAssets: string[];
    engagementScore: number;
}

export interface Post {
    id: string;
    clubId: string;
    linkedEventId: string | null;
    type: 'image' | 'reel';
    mediaUrl: string;
    caption: string;
    engagementScore: number;
}

// ─── Fallback data (used while Supabase loads or when offline) ────────────────
const FALLBACK_USER: User = {
    id: 'u1', name: 'Alex Student', followedClubs: ['c1'],
    interestScore: { Tech: 5, Creative: 2, Academic: 1, Social: 3 },
    registeredEvents: [],
};

const FALLBACK_CLUBS: Club[] = [
    { id: 'c1', name: 'CodeCrafters', tagline: 'Build the future.', vibeTag: 'Tech', followersCount: 342, logo: 'https://api.dicebear.com/7.x/shapes/png?seed=Code', banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800' },
    { id: 'c2', name: 'Design Hub', tagline: 'Pixels meet purpose.', vibeTag: 'Creative', followersCount: 512, logo: 'https://api.dicebear.com/7.x/shapes/png?seed=Design', banner: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800' },
    { id: 'c3', name: 'Hackathon League', tagline: 'Coffee is fuel.', vibeTag: 'Competitive', followersCount: 890, logo: 'https://api.dicebear.com/7.x/shapes/png?seed=Hack', banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800' },
    { id: 'c4', name: 'Music Society', tagline: 'Campus beats.', vibeTag: 'Social', followersCount: 1205, logo: 'https://api.dicebear.com/7.x/shapes/png?seed=Music', banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800' },
];

const FALLBACK_EVENTS: Event[] = [
    { id: 'e1', clubId: 'c1', title: 'Intro to React Native AI', description: 'Learn intelligent mobile apps.', date: '2025-02-25', time: '18:00', location: 'Lab 3', totalSeats: 50, registeredCount: 45, category: 'Tech', mediaAssets: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800'], engagementScore: 120 },
    { id: 'e2', clubId: 'c2', title: 'Figma Auto-Layout Workshop', description: 'Master Auto-Layout.', date: '2025-02-28', time: '14:00', location: 'Design Studio', totalSeats: 30, registeredCount: 12, category: 'Creative', mediaAssets: ['https://images.unsplash.com/photo-1542744094-24638ea0b3b5?w=800'], engagementScore: 85 },
    { id: 'e3', clubId: 'c3', title: 'Global 24H Hack', description: 'Annual hackathon marathon.', date: '2025-03-10', time: '09:00', location: 'Main Auditorium', totalSeats: 200, registeredCount: 198, category: 'Competitive', mediaAssets: ['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'], engagementScore: 450, host: 'HackMIT' },
    { id: 'e4', clubId: 'c4', title: 'Acoustic Night out', description: 'Chill vibes, free snacks.', date: '2025-02-22', time: '20:00', location: 'Campus Lawn', totalSeats: 500, registeredCount: 150, category: 'Social', mediaAssets: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'], engagementScore: 210, host: 'University Committee' },
];

const FALLBACK_POSTS: Post[] = [
    { id: 'p1', clubId: 'c3', linkedEventId: 'e3', type: 'reel', mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=800&fit=crop', caption: 'Only 2 seats left! Get your redbull ready 🚀', engagementScore: 500 },
    { id: 'p2', clubId: 'c1', linkedEventId: 'e1', type: 'image', mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=800&fit=crop', caption: 'Sneak peek at our React Native AI syllabus 📱', engagementScore: 150 },
    { id: 'p3', clubId: 'c4', linkedEventId: null, type: 'image', mediaUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600&h=800&fit=crop', caption: 'Vibes from last night\'s jam session 🎸', engagementScore: 320 },
    { id: 'p4', clubId: 'c2', linkedEventId: 'e2', type: 'image', mediaUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=800&fit=crop', caption: 'UI Designers unite! Auto-layout Friday 🎨', engagementScore: 95 },
];

// ─── Store ────────────────────────────────────────────────────────────────────
interface HybridStore {
    user: User;
    clubs: Club[];
    events: Event[];
    posts: Post[];

    // Setters — called by React Query hooks to seed live data
    setClubs: (clubs: Club[]) => void;
    setEvents: (events: Event[]) => void;
    setPosts: (posts: Post[]) => void;

    // Actions
    followClub: (clubId: string) => void;
    registerEvent: (eventId: string) => void;
    updatePostEngagement: (postId: string, increment: number) => void;

    // Computed
    getRankedFeed: () => (Post & { event?: Event; club: Club; score: number })[];
    getClubDetails: (clubId: string) => { club: Club | undefined; events: Event[]; posts: Post[] };
}

export const useHybridStore = create<HybridStore>((set, get) => ({
    user: FALLBACK_USER,
    clubs: FALLBACK_CLUBS,
    events: FALLBACK_EVENTS,
    posts: FALLBACK_POSTS,

    // ── Setters from live data ──
    setClubs: (clubs) => set({ clubs }),
    setEvents: (events) => set({ events }),
    setPosts: (posts) => set({ posts }),

    // ── Actions ──
    followClub: (clubId) => set((state) => {
        const isFollowing = state.user.followedClubs.includes(clubId);
        const newFollowed = isFollowing
            ? state.user.followedClubs.filter((id) => id !== clubId)
            : [...state.user.followedClubs, clubId];
        const newClubs = state.clubs.map((c) =>
            c.id === clubId ? { ...c, followersCount: c.followersCount + (isFollowing ? -1 : 1) } : c,
        );
        return { user: { ...state.user, followedClubs: newFollowed }, clubs: newClubs };
    }),

    registerEvent: (eventId) => set((state) => {
        if (state.user.registeredEvents.includes(eventId)) return state;
        const target = state.events.find((e) => e.id === eventId);
        if (!target || target.registeredCount >= target.totalSeats) return state;
        const newEvents = state.events.map((e) =>
            e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e,
        );
        const catScore = state.user.interestScore[target.category] ?? 0;
        return {
            events: newEvents,
            user: {
                ...state.user,
                registeredEvents: [...state.user.registeredEvents, eventId],
                interestScore: { ...state.user.interestScore, [target.category]: catScore + 2 },
            },
        };
    }),

    updatePostEngagement: (postId, increment) =>
        set((state) => ({
            posts: state.posts.map((p) =>
                p.id === postId ? { ...p, engagementScore: p.engagementScore + increment } : p,
            ),
        })),

    // ── Ranking algorithm (unchanged) ──
    getRankedFeed: () => {
        const { user, posts, clubs, events } = get();
        return posts
            .map((post) => {
                const club = clubs.find((c) => c.id === post.clubId)!;
                const event = post.linkedEventId ? events.find((e) => e.id === post.linkedEventId) : undefined;
                let score = 0;
                if (user.followedClubs.includes(club?.id ?? '')) score += 500;
                score += post.engagementScore * 0.5;
                if (event) {
                    score += (user.interestScore[event.category] ?? 0) * 50;
                    const fill = event.registeredCount / event.totalSeats;
                    if (fill > 0.8 && fill < 1) score += 300;
                    else if (fill >= 1) score -= 500;
                }
                return { ...post, club, event, score };
            })
            .sort((a, b) => b.score - a.score);
    },

    getClubDetails: (clubId) => {
        const { clubs, events, posts } = get();
        return {
            club: clubs.find((c) => c.id === clubId),
            events: events.filter((e) => e.clubId === clubId),
            posts: posts.filter((p) => p.clubId === clubId),
        };
    },
}));
