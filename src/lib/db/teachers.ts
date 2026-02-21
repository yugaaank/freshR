import { supabase } from '../supabase';
import type { Tables, Teacher } from '../types/database.types';

export type { Teacher };
export type TeacherReview = Tables<'teacher_reviews'>;

export async function getTeachers(): Promise<Teacher[]> {
    const { data, error } = await supabase
        .from('teachers').select('*').order('rating', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Teacher[];
}

export async function getTeacherById(id: string): Promise<Teacher | null> {
    const { data, error } = await supabase.from('teachers').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Teacher | null;
}

export async function getTeacherReviews(teacherId: string): Promise<TeacherReview[]> {
    const { data, error } = await supabase
        .from('teacher_reviews').select('*').eq('teacher_id', teacherId).order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []) as TeacherReview[];
}

export async function addTeacherReview(review: {
    teacherId: string; userId: string; rating: number; comment: string;
}): Promise<void> {
    const { error } = await supabase.from('teacher_reviews').upsert({
        teacher_id: review.teacherId, user_id: review.userId,
        rating: review.rating, comment: review.comment,
    } as any);
    if (error) throw error;
    const { data: reviews } = await supabase
        .from('teacher_reviews').select('rating').eq('teacher_id', review.teacherId);
    if (reviews && reviews.length > 0) {
        const avg = (reviews as any[]).reduce((sum, r) => sum + (r.rating as number), 0) / reviews.length;
        await supabase.from('teachers')
            .update({ rating: +avg.toFixed(1), review_count: reviews.length } as any)
            .eq('id', review.teacherId);
    }
}
