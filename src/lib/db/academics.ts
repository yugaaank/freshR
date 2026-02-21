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
    
    // DEMO FALLBACK: If this is the demo user and fetch fails/is empty, return high performance data
    if ((error || !data || data.length === 0) && userId === '11111111-1111-1111-1111-111111111111') {
        return [
            { id: 's1', name: 'Data Structures', code: 'CS301', credits: 4, professor: 'Dr. Anand', attendance: 92, grade: 'A+', grade_point: 10, next_class: 'Mon 8:00 AM', user_id: userId, subject_id: 's1', created_at: '' },
            { id: 's2', name: 'Machine Learning', code: 'CS401', credits: 3, professor: 'Prof. Meera', attendance: 95, grade: 'A+', grade_point: 10, next_class: 'Tue 10:00 AM', user_id: userId, subject_id: 's2', created_at: '' },
            { id: 's3', name: 'Computer Networks', code: 'CS302', credits: 3, professor: 'Dr. Ravi', attendance: 88, grade: 'A', grade_point: 9, next_class: 'Wed 2:00 PM', user_id: userId, subject_id: 's3', created_at: '' },
        ] as any[];
    }

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
    
    if ((error || !data || data.length === 0) && userId === '11111111-1111-1111-1111-111111111111') {
        return [
            { id: 'a1', title: 'AVL Tree Implementation', subject_name: 'Data Structures', status: 'graded', marks: 18, due_date: '2025-03-10', created_at: '' },
            { id: 'a2', title: 'SVM Lab Report', subject_name: 'Machine Learning', status: 'submitted', marks: null, due_date: '2025-03-15', created_at: '' },
            { id: 'a3', title: 'Socket Programming', subject_name: 'Computer Networks', status: 'pending', marks: null, due_date: '2025-03-08', created_at: '' },
        ] as any[];
    }

    if (error) throw error;
    return ((data ?? []) as any[]).map((row) => ({
        ...(row.assignments as Assignment),
        subject_name: row.assignments?.subjects?.name ?? '',
        status: row.status as UserAssignment['status'],
        marks: row.marks as number | null,
    }));
}

export async function getAcademicProfile(userId: string): Promise<AcademicProfile | null> {
    let profileData: any;
    try {
        const { data, error } = await supabase
            .from('profiles').select('branch, roll_no, year').eq('id', userId).single();
        if (error || !data) throw error;
        profileData = data;
    } catch (e) {
        if (userId === '11111111-1111-1111-1111-111111111111') {
            profileData = { branch: 'CSE', roll_no: '200910027', year: 3 };
        } else {
            throw e;
        }
    }

    const subjects = await getUserSubjects(userId);
    const totalCredits = subjects.reduce((s, sub) => s + sub.credits, 0);
    const earnedCredits = subjects.filter((s) => s.grade_point > 0).reduce((sum, s) => sum + s.credits, 0);
    const cgpa = subjects.length
        ? +(subjects.reduce((sum, s) => sum + s.grade_point * s.credits, 0) / Math.max(earnedCredits, 1)).toFixed(2)
        : 0;
    return {
        cgpa, sgpa: cgpa,
        semester: profileData.year * 2, year: profileData.year,
        branch: profileData.branch, roll_no: profileData.roll_no,
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
