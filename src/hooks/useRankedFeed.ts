import { useMemo } from 'react';
import { useClubs, useFeed } from './useClubs';
import { useEvents } from './useEvents';
import { useUserStore } from '../store/userStore';
import { Club, ClubPost, DBEvent } from '../lib/types/database.types';

export interface RankedPost extends ClubPost {
    club: Club;
    event?: DBEvent;
    score: number;
}

/**
 * Custom hook to encapsulate the social ranking algorithm for the Waves feed.
 * Removes the dependency on redundant Zustand stores for server data.
 */
export function useRankedFeed() {
    const { data: posts = [] } = useFeed();
    const { data: clubs = [] } = useClubs();
    const { data: events = [] } = useEvents();
    const { followedClubs, interestScore } = useUserStore();

    return useMemo(() => {
        if (!posts.length || !clubs.length) return [];

        return posts.map(post => {
            const club = clubs.find(c => c.id === post.club_id);
            const event = post.linked_event_id ? events.find(e => e.id === post.linked_event_id) : undefined;
            
            let score = 0;
            if (club && followedClubs.includes(club.id)) score += 500;
            score += post.engagement_score * 0.5;
            
            if (event) {
                const interest = interestScore[event.category] ?? 0;
                score += interest * 50;
                
                const fill = event.registered_count / event.total_seats;
                if (fill > 0.8 && fill < 1) score += 300;
                else if (fill >= 1) score -= 500;
            }
            
            return { ...post, club: club!, event, score };
        })
        .filter(p => !!p.club) // Filter out posts with missing club data
        .sort((a, b) => b.score - a.score);
    }, [posts, clubs, events, followedClubs, interestScore]);
}
