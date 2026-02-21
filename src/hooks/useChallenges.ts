import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getPastChallenges,
    getSolvedChallengeIds,
    getTodayChallenge,
    getUserStreak,
    submitSolution,
} from '../lib/db/challenges';

export const challengeKeys = {
    today: ['challenges', 'today'] as const,
    past: ['challenges', 'past'] as const,
    streak: (uid: string) => ['challenges', 'streak', uid] as const,
    solved: (uid: string) => ['challenges', 'solved', uid] as const,
};

export function useTodayChallenge() {
    return useQuery({
        queryKey: challengeKeys.today,
        queryFn: getTodayChallenge,
        staleTime: 60 * 60_000, // 1 hour — problems change once a day
    });
}

export function usePastChallenges() {
    return useQuery({
        queryKey: challengeKeys.past,
        queryFn: getPastChallenges,
        staleTime: 60 * 60_000,
    });
}

export function useUserStreak(userId: string | null) {
    return useQuery({
        queryKey: challengeKeys.streak(userId ?? ''),
        queryFn: () => getUserStreak(userId!),
        enabled: !!userId,
        staleTime: 60_000,
    });
}

export function useSolvedChallenges(userId: string | null) {
    return useQuery({
        queryKey: challengeKeys.solved(userId ?? ''),
        queryFn: () => getSolvedChallengeIds(userId!),
        enabled: !!userId,
        staleTime: 60_000,
    });
}

export function useSubmitSolution(userId: string | null) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (vars: { challengeId: string; language: string; code: string }) =>
            submitSolution(userId!, vars.challengeId, vars.language, vars.code),
        onSuccess: () => {
            if (userId) {
                qc.invalidateQueries({ queryKey: challengeKeys.streak(userId) });
                qc.invalidateQueries({ queryKey: challengeKeys.solved(userId) });
            }
        },
    });
}
