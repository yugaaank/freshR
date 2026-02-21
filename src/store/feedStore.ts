import { create } from 'zustand';
import { Club, ClubPost, DBEvent } from '../lib/types/database.types';
import { useClubStore } from './clubStore';
import { useEventStore } from './eventStore';
import { useUserStore } from './userStore';

// ─── Fallback data ────────────────────────────────────────────────────────────
const FALLBACK_POSTS: ClubPost[] = [
    { id: 'p1', club_id: 'c3', linked_event_id: 'e3', type: 'reel', media_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=800&fit=crop', caption: 'Only 2 seats left! Get your redbull ready 🚀', engagement_score: 500, created_at: '' },
    { id: 'p2', club_id: 'c1', linked_event_id: 'e1', type: 'image', media_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=800&fit=crop', caption: 'Sneak peek at our React Native AI syllabus 📱', engagement_score: 150, created_at: '' },
    { id: 'p3', club_id: 'c4', linked_event_id: null, type: 'image', media_url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600&h=800&fit=crop', caption: "Vibes from last night's jam session 🎸", engagement_score: 320, created_at: '' },
    { id: 'p4', club_id: 'c2', linked_event_id: 'e2', type: 'image', media_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=800&fit=crop', caption: 'UI Designers unite! Auto-layout Friday 🎨', engagement_score: 95, created_at: '' },
];

export interface RankedPost extends ClubPost {
    club: Club;
    event?: DBEvent;
    score: number;
}

interface FeedStore {
    posts: ClubPost[];
    setPosts: (posts: ClubPost[]) => void;
    updatePostEngagement: (postId: string, increment: number) => void;
    getRankedFeed: () => RankedPost[];
}

export const useFeedStore = create<FeedStore>((set, get) => ({
    posts: FALLBACK_POSTS,
    setPosts: (posts) => set({ posts }),
    updatePostEngagement: (postId, increment) => set(state => ({
        posts: state.posts.map(p => p.id === postId ? { ...p, engagement_score: p.engagement_score + increment } : p)
    })),
    getRankedFeed: () => {
        const posts = get().posts;
        const clubs = useClubStore.getState().clubs;
        const events = useEventStore.getState().events;
        const { followedClubs, interestScore } = useUserStore.getState();

        return posts.map(post => {
            const club = clubs.find(c => c.id === post.club_id)!;
            const event = post.linked_event_id ? events.find(e => e.id === post.linked_event_id) : undefined;
            
            let score = 0;
            if (followedClubs.includes(club?.id)) score += 500;
            score += post.engagement_score * 0.5;
            
            if (event) {
                score += (interestScore[event.category] ?? 0) * 50;
                const fill = event.registered_count / event.total_seats;
                if (fill > 0.8 && fill < 1) score += 300;
                else if (fill >= 1) score -= 500;
            }
            
            return { ...post, club, event, score };
        }).sort((a, b) => b.score - a.score);
    }
}));
