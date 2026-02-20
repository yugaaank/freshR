import { create } from 'zustand';

export type VibeTag = 'Competitive' | 'Creative' | 'Social' | 'Academic' | 'Tech';

export interface User {
    id: string;
    name: string;
    followedClubs: string[];
    interestScore: Record<string, number>; // e.g., { Tech: 5, Music: 2 }
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
    clubId: string; // The primary host club
    host?: string; // Optional generic host string for non-club entities
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

// ─── Initial Data ────────────────────────────────────────────────────────────

const INITIAL_USER: User = {
    id: 'u1',
    name: 'Alex Student',
    followedClubs: ['c1'],
    interestScore: { Tech: 5, Creative: 2, Academic: 1, Social: 3 },
    registeredEvents: [],
};

const INITIAL_CLUBS: Club[] = [
    { id: 'c1', name: 'CodeCrafters', tagline: 'Build the future, one line at a time.', vibeTag: 'Tech', followersCount: 342, logo: 'https://api.dicebear.com/7.x/shapes/png?seed=Code', banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800' },
    { id: 'c2', name: 'Design Hub', tagline: 'Where pixels meet purpose.', vibeTag: 'Creative', followersCount: 512, logo: 'https://api.dicebear.com/7.x/shapes/png?seed=Design', banner: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800' },
    { id: 'c3', name: 'Hackathon League', tagline: 'Sleep is for the weak. Coffee is fuel.', vibeTag: 'Competitive', followersCount: 890, logo: 'https://api.dicebear.com/7.x/shapes/png?seed=Hack', banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800' },
    { id: 'c4', name: 'Music Society', tagline: 'Campus beats and acoustic treats.', vibeTag: 'Social', followersCount: 1205, logo: 'https://api.dicebear.com/7.x/shapes/png?seed=Music', banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800' },
];

const INITIAL_EVENTS: Event[] = [
    { id: 'e1', clubId: 'c1', title: 'Intro to React Native AI', description: 'Learn how to build intelligent mobile apps using React Native and deep learning models.', date: '2025-02-25', time: '18:00', location: 'Lab 3', totalSeats: 50, registeredCount: 45, category: 'Tech', mediaAssets: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800'], engagementScore: 120 },
    { id: 'e2', clubId: 'c2', title: 'Figma Auto-Layout Workshop', description: 'Master Auto-Layout like a pro and speed up your UI design workflow.', date: '2025-02-28', time: '14:00', location: 'Design Studio', totalSeats: 30, registeredCount: 12, category: 'Creative', mediaAssets: ['https://images.unsplash.com/photo-1542744094-24638ea0b3b5?w=800'], engagementScore: 85 },
    { id: 'e3', clubId: 'c3', title: 'Global 24H Hack', description: 'Annual 24-hour coding marathon. Prizes worth $10k!', date: '2025-03-10', time: '09:00', location: 'Main Auditorium', totalSeats: 200, registeredCount: 198, category: 'Competitive', mediaAssets: ['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'], engagementScore: 450, host: 'HackMIT' },
    { id: 'e4', clubId: 'c4', title: 'Acoustic Night out', description: 'Chill vibes, acoustic guitars, and free snacks.', date: '2025-02-22', time: '20:00', location: 'Campus Lawn', totalSeats: 500, registeredCount: 150, category: 'Social', mediaAssets: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'], engagementScore: 210, host: 'University Committee' },
];

const INITIAL_POSTS: Post[] = [
    { id: 'p1', clubId: 'c3', linkedEventId: 'e3', type: 'reel', mediaUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=800&fit=crop', caption: 'Only 2 seats left for the Global Hackathon! Get your redbull ready 🚀', engagementScore: 500 },
    { id: 'p2', clubId: 'c1', linkedEventId: 'e1', type: 'image', mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=800&fit=crop', caption: 'Sneak peek at our React Native AI syllabus. See you in Lab 3!', engagementScore: 150 },
    { id: 'p3', clubId: 'c4', linkedEventId: null, type: 'image', mediaUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600&h=800&fit=crop', caption: 'Just dropping some vibes from last night\'s jam session 🎸', engagementScore: 320 },
    { id: 'p4', clubId: 'c2', linkedEventId: 'e2', type: 'image', mediaUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=800&fit=crop', caption: 'UI Designers unite! Learn auto-layout with us this Friday. 🎨', engagementScore: 95 },
];

// ─── Store Definition ────────────────────────────────────────────────────────

interface HybridStore {
    user: User;
    clubs: Club[];
    events: Event[];
    posts: Post[];

    // Actions
    followClub: (clubId: string) => void;
    registerEvent: (eventId: string) => void;
    updatePostEngagement: (postId: string, increment: number) => void;

    // Computed Views
    getRankedFeed: () => (Post & { event?: Event; club: Club; score: number })[];
    getClubDetails: (clubId: string) => { club: Club | undefined; events: Event[]; posts: Post[] };
}

export const useHybridStore = create<HybridStore>((set, get) => ({
    user: INITIAL_USER,
    clubs: INITIAL_CLUBS,
    events: INITIAL_EVENTS,
    posts: INITIAL_POSTS,

    followClub: (clubId) => set((state) => {
        const isFollowing = state.user.followedClubs.includes(clubId);

        // Update user followed list
        const newFollowed = isFollowing
            ? state.user.followedClubs.filter(id => id !== clubId)
            : [...state.user.followedClubs, clubId];

        // Update club follower count
        const newClubs = state.clubs.map(c => {
            if (c.id === clubId) {
                return { ...c, followersCount: c.followersCount + (isFollowing ? -1 : 1) };
            }
            return c;
        });

        return {
            user: { ...state.user, followedClubs: newFollowed },
            clubs: newClubs
        };
    }),

    registerEvent: (eventId) => set((state) => {
        const isRegistered = state.user.registeredEvents.includes(eventId);
        if (isRegistered) return state; // Already registered

        const targetEvent = state.events.find(e => e.id === eventId);
        if (!targetEvent || targetEvent.registeredCount >= targetEvent.totalSeats) return state;

        // Update Event registered count
        const newEvents = state.events.map(e =>
            e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e
        );

        // Boost user interest score for this category
        const cat = targetEvent.category;
        const currentScore = state.user.interestScore[cat] || 0;

        return {
            events: newEvents,
            user: {
                ...state.user,
                registeredEvents: [...state.user.registeredEvents, eventId],
                interestScore: { ...state.user.interestScore, [cat]: currentScore + 2 }
            }
        };
    }),

    updatePostEngagement: (postId, increment) => set((state) => ({
        posts: state.posts.map(p => p.id === postId ? { ...p, engagementScore: p.engagementScore + increment } : p)
    })),

    // Ranking Logic
    // score = (clubFollowWeight * isFollowedClub) + (interestWeight * categoryMatch) + 
    //         (urgencyWeight * seatScarcity) + (engagementWeight * engagementScore)
    getRankedFeed: () => {
        const { user, posts, clubs, events } = get();

        const feedItems = posts.map(post => {
            const club = clubs.find(c => c.id === post.clubId)!;
            const event = post.linkedEventId ? events.find(e => e.id === post.linkedEventId) : undefined;

            let score = 0;

            // 1. Followed Club Weight
            if (user.followedClubs.includes(club.id)) score += 500;

            // 2. Engagement Weight
            score += post.engagementScore * 0.5;

            if (event) {
                // 3. Interest Match Weight
                const catScore = user.interestScore[event.category] || 0;
                score += catScore * 50;

                // 4. Urgency Weight (Scarcity)
                const fillRatio = event.registeredCount / event.totalSeats;
                if (fillRatio > 0.8 && fillRatio < 1) {
                    score += 300; // High urgency boost for near-full events
                } else if (fillRatio >= 1) {
                    score -= 500; // Penalize full events so they drop down
                }
            }

            return { ...post, club, event, score };
        });

        // Sort descending by score
        return feedItems.sort((a, b) => b.score - a.score);
    },

    getClubDetails: (clubId) => {
        const { clubs, events, posts } = get();
        const club = clubs.find(c => c.id === clubId);
        const clubEvents = events.filter(e => e.clubId === clubId);
        const clubPosts = posts.filter(p => p.clubId === clubId);
        return { club, events: clubEvents, posts: clubPosts };
    }
}));
