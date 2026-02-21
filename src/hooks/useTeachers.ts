import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addTeacherReview, getTeacherById, getTeacherReviews, getTeachers } from '../lib/db/teachers';

export const teacherKeys = {
    all: ['teachers'] as const,
    detail: (id: string) => ['teachers', id] as const,
    reviews: (id: string) => ['teachers', id, 'reviews'] as const,
};

export function useTeachers() {
    return useQuery({ queryKey: teacherKeys.all, queryFn: getTeachers, staleTime: 5 * 60_000 });
}

export function useTeacher(id: string) {
    return useQuery({
        queryKey: teacherKeys.detail(id),
        queryFn: () => getTeacherById(id),
        enabled: !!id,
        staleTime: 5 * 60_000,
    });
}

export function useTeacherReviews(teacherId: string) {
    return useQuery({
        queryKey: teacherKeys.reviews(teacherId),
        queryFn: () => getTeacherReviews(teacherId),
        enabled: !!teacherId,
        staleTime: 60_000,
    });
}

export function useAddTeacherReview() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: addTeacherReview,
        onSuccess: (_, vars) => {
            qc.invalidateQueries({ queryKey: teacherKeys.reviews(vars.teacherId) });
            qc.invalidateQueries({ queryKey: teacherKeys.detail(vars.teacherId) });
            qc.invalidateQueries({ queryKey: teacherKeys.all });
        },
    });
}
