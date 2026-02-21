import { useQuery } from '@tanstack/react-query';
import { getAcademicProfile, getUserAssignments, getUserSubjects } from '../lib/db/academics';

export const academicKeys = {
    subjects: (uid: string) => ['academics', 'subjects', uid] as const,
    assignments: (uid: string) => ['academics', 'assignments', uid] as const,
    profile: (uid: string) => ['academics', 'profile', uid] as const,
};

export function useSubjects(userId: string | null) {
    return useQuery({
        queryKey: academicKeys.subjects(userId ?? ''),
        queryFn: () => getUserSubjects(userId!),
        enabled: !!userId,
        staleTime: 5 * 60_000,
    });
}

export function useAssignments(userId: string | null) {
    return useQuery({
        queryKey: academicKeys.assignments(userId ?? ''),
        queryFn: () => getUserAssignments(userId!),
        enabled: !!userId,
        staleTime: 5 * 60_000,
    });
}

export function useAcademicProfile(userId: string | null) {
    return useQuery({
        queryKey: academicKeys.profile(userId ?? ''),
        queryFn: () => getAcademicProfile(userId!),
        enabled: !!userId,
        staleTime: 10 * 60_000,
    });
}
