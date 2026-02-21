import { supabase } from '../supabase';
import type { Assignment, Subject, UserAssignment, UserSubject } from '../types/database.types';

export type { Assignment, Subject, UserAssignment, UserSubject };

export type SubjectWithProgress = Subject & UserSubject;
export type AssignmentWithStatus = Assignment & {
    subject_name: string; status: UserAssignment['status']; marks: number | null;
};
export interface AcademicProfile {
    cgpa: number; sgpa: number; semester: number; year: number;
    branch: string; roll_no: string | null;
    totalCredits: number; earnedCredits: number; division: string;
}

export async function getUserSubjects(userId: string): Promise<SubjectWithProgress[]> {
    const { data, error } = await supabase
        .from('user_subjects').select('*, subjects(*)').eq('user_id', userId);
    if (error) throw error;
    return ((data ?? []) as any[]).map((row) => ({
        ...(row.subjects as Subject),
        attendance: row.attendance as number,
        grade: row.grade as string,
        grade_point: row.grade_point as number,
        next_class: row.next_class as string | null,
        user_id: row.user_id as string,
        subject_id: row.subject_id as string,
    }));
}

export async function getUserAssignments(userId: string): Promise<AssignmentWithStatus[]> {
    const { data, error } = await supabase
        .from('user_assignments').select('*, assignments(*, subjects(name))').eq('user_id', userId);
    if (error) throw error;
    return ((data ?? []) as any[]).map((row) => ({
        ...(row.assignments as Assignment),
        subject_name: row.assignments?.subjects?.name ?? '',
        status: row.status as UserAssignment['status'],
        marks: row.marks as number | null,
    }));
}

export async function getAcademicProfile(userId: string): Promise<AcademicProfile | null> {
    const { data: profileData, error } = await supabase
        .from('profiles').select('branch, roll_no, year').eq('id', userId).single();
    if (error) throw error;
    if (!profileData) return null;
    const profile = profileData as any;
    const subjects = await getUserSubjects(userId);
    const totalCredits = subjects.reduce((s, sub) => s + sub.credits, 0);
    const earnedCredits = subjects.filter((s) => s.grade_point > 0).reduce((sum, s) => sum + s.credits, 0);
    const cgpa = subjects.length
        ? +(subjects.reduce((sum, s) => sum + s.grade_point * s.credits, 0) / Math.max(earnedCredits, 1)).toFixed(2)
        : 0;
    return {
        cgpa, sgpa: cgpa,
        semester: profile.year * 2, year: profile.year,
        branch: profile.branch, roll_no: profile.roll_no,
        totalCredits, earnedCredits,
        division: cgpa >= 9 ? 'A+' : cgpa >= 8 ? 'A' : cgpa >= 7 ? 'B' : 'C',
    };
}

export async function upsertUserSubject(
    userId: string, subjectId: string,
    updates: Partial<Omit<UserSubject, 'user_id' | 'subject_id'>>,
): Promise<void> {
    const { error } = await supabase.from('user_subjects')
        .upsert({ user_id: userId, subject_id: subjectId, ...updates } as any);
    if (error) throw error;
}
