import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    followClub,
    getClubById, getClubPosts,
    getClubs,
    getFeed,
    getFollowedClubIds, incrementPostEngagement,
    unfollowClub,
} from '../lib/db/clubs';

export const clubKeys = {
    all: ['clubs'] as const,
    detail: (id: string) => ['clubs', id] as const,
    posts: (id: string) => ['clubs', id, 'posts'] as const,
    feed: ['clubs', 'feed'] as const,
    followed: (uid: string) => ['clubs', 'followed', uid] as const,
};

export function useClubs() {
    return useQuery({ queryKey: clubKeys.all, queryFn: getClubs, staleTime: 60_000 });
}

export function useClub(id: string) {
    return useQuery({
        queryKey: clubKeys.detail(id),
        queryFn: () => getClubById(id),
        enabled: !!id,
        staleTime: 30_000,
    });
}

export function useClubPosts(clubId: string) {
    return useQuery({
        queryKey: clubKeys.posts(clubId),
        queryFn: () => getClubPosts(clubId),
        enabled: !!clubId,
        staleTime: 30_000,
    });
}

/** Ranked feed for Waves tab */
export function useFeed() {
    return useQuery({ queryKey: clubKeys.feed, queryFn: getFeed, staleTime: 30_000 });
}

export function useFollowedClubs(userId: string | null) {
    return useQuery({
        queryKey: clubKeys.followed(userId ?? ''),
        queryFn: () => getFollowedClubIds(userId!),
        enabled: !!userId,
        staleTime: 60_000,
    });
}

/** Follow / unfollow mutation */
export function useFollowClub(userId: string | null) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ clubId, follow }: { clubId: string; follow: boolean }) =>
            follow ? followClub(userId!, clubId) : unfollowClub(userId!, clubId),
        onSuccess: (_, { clubId }) => {
            qc.invalidateQueries({ queryKey: clubKeys.all });
            qc.invalidateQueries({ queryKey: clubKeys.detail(clubId) });
            if (userId) qc.invalidateQueries({ queryKey: clubKeys.followed(userId) });
        },
    });
}

/** Post engagement (like) mutation */
export function useLikePost() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ postId, increment }: { postId: string; increment?: number }) =>
            incrementPostEngagement(postId, increment ?? 1),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: clubKeys.feed });
        },
    });
}
