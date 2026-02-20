export interface Subject {
    id: string;
    name: string;
    code: string;
    credits: number;
    attendance: number;
    grade: string;
    gradePoint: number;
    professor: string;
    nextClass: string;
}

export interface Assignment {
    id: string;
    title: string;
    subject: string;
    dueDate: string;
    status: 'pending' | 'submitted' | 'graded';
    marks?: number;
    totalMarks: number;
}

export interface AcademicProfile {
    cgpa: number;
    sgpa: number;
    semester: number;
    year: number;
    division: string;
    branch: string;
    rollNo: string;
    totalCredits: number;
    earnedCredits: number;
}

export const academicProfile: AcademicProfile = {
    cgpa: 8.74,
    sgpa: 9.1,
    semester: 6,
    year: 3,
    division: 'A',
    branch: 'Computer Science & Engineering',
    rollNo: '210905001',
    totalCredits: 180,
    earnedCredits: 148,
};

export const subjects: Subject[] = [
    {
        id: 's1',
        name: 'Machine Learning',
        code: 'CS601',
        credits: 4,
        attendance: 82,
        grade: 'A',
        gradePoint: 9,
        professor: 'Dr. Kavitha Rao',
        nextClass: 'Mon, 9:00 AM',
    },
    {
        id: 's2',
        name: 'Computer Networks',
        code: 'CS602',
        credits: 3,
        attendance: 91,
        grade: 'A+',
        gradePoint: 10,
        professor: 'Dr. Rajan Mehta',
        nextClass: 'Mon, 11:00 AM',
    },
    {
        id: 's3',
        name: 'Database Systems',
        code: 'CS603',
        credits: 4,
        attendance: 76,
        grade: 'B+',
        gradePoint: 8,
        professor: 'Prof. Sunita Joshi',
        nextClass: 'Tue, 10:00 AM',
    },
    {
        id: 's4',
        name: 'Software Engineering',
        code: 'CS604',
        credits: 3,
        attendance: 88,
        grade: 'A',
        gradePoint: 9,
        professor: 'Dr. Arvind Pillai',
        nextClass: 'Wed, 2:00 PM',
    },
    {
        id: 's5',
        name: 'Cloud Computing',
        code: 'CS605',
        credits: 3,
        attendance: 72,
        grade: 'B',
        gradePoint: 7,
        professor: 'Prof. Deepa Sharma',
        nextClass: 'Thu, 11:00 AM',
    },
    {
        id: 's6',
        name: 'Compiler Design',
        code: 'CS606',
        credits: 3,
        attendance: 95,
        grade: 'A+',
        gradePoint: 10,
        professor: 'Dr. Krishna Iyer',
        nextClass: 'Fri, 9:00 AM',
    },
];

export const assignments: Assignment[] = [
    {
        id: 'a1',
        title: 'Neural Network Implementation',
        subject: 'Machine Learning',
        dueDate: '2025-02-28',
        status: 'pending',
        totalMarks: 20,
    },
    {
        id: 'a2',
        title: 'TCP/IP Protocol Analysis',
        subject: 'Computer Networks',
        dueDate: '2025-02-22',
        status: 'submitted',
        totalMarks: 15,
    },
    {
        id: 'a3',
        title: 'ER Diagram — Hospital Management',
        subject: 'Database Systems',
        dueDate: '2025-02-20',
        status: 'graded',
        marks: 18,
        totalMarks: 20,
    },
    {
        id: 'a4',
        title: 'UML Design Document',
        subject: 'Software Engineering',
        dueDate: '2025-03-05',
        status: 'pending',
        totalMarks: 25,
    },
];
