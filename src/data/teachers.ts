export interface Teacher {
    id: string;
    name: string;
    subject: string;
    department: string;
    rating: number;
    reviewCount: number;
    officeHours: string;
    email: string;
    cabin: string;
    image: string;
    experience: number;
    weeklyClasses: number[];
    isAvailableNow: boolean;
}

export const teachers: Teacher[] = [
    {
        id: 't1',
        name: 'Dr. Kavitha Rao',
        subject: 'Machine Learning',
        department: 'Computer Science',
        rating: 4.8,
        reviewCount: 234,
        officeHours: 'Mon, Wed 2–4 PM',
        email: 'kavitha.rao@mit.edu',
        cabin: 'A-301',
        image: 'https://i.pravatar.cc/150?img=47',
        experience: 12,
        weeklyClasses: [3, 4, 4, 3, 3, 5, 4, 3, 4, 4, 3, 5],
        isAvailableNow: true,
    },
    {
        id: 't2',
        name: 'Dr. Rajan Mehta',
        subject: 'Computer Networks',
        department: 'Computer Science',
        rating: 4.6,
        reviewCount: 189,
        officeHours: 'Tue, Thu 3–5 PM',
        email: 'rajan.mehta@mit.edu',
        cabin: 'B-202',
        image: 'https://i.pravatar.cc/150?img=68',
        experience: 9,
        weeklyClasses: [2, 3, 4, 2, 3, 4, 3, 2, 3, 4, 3, 4],
        isAvailableNow: false,
    },
    {
        id: 't3',
        name: 'Prof. Sunita Joshi',
        subject: 'Database Systems',
        department: 'Computer Science',
        rating: 4.4,
        reviewCount: 156,
        officeHours: 'Mon, Fri 10 AM–12 PM',
        email: 'sunita.joshi@mit.edu',
        cabin: 'A-215',
        image: 'https://i.pravatar.cc/150?img=44',
        experience: 7,
        weeklyClasses: [4, 3, 3, 4, 2, 3, 4, 3, 3, 4, 2, 3],
        isAvailableNow: false,
    },
    {
        id: 't4',
        name: 'Dr. Arvind Pillai',
        subject: 'Software Engineering',
        department: 'Computer Science',
        rating: 4.9,
        reviewCount: 312,
        officeHours: 'Wed, Thu 11 AM–1 PM',
        email: 'arvind.pillai@mit.edu',
        cabin: 'C-108',
        image: 'https://i.pravatar.cc/150?img=56',
        experience: 15,
        weeklyClasses: [5, 4, 5, 4, 5, 4, 5, 4, 5, 5, 4, 5],
        isAvailableNow: true,
    },
    {
        id: 't5',
        name: 'Prof. Deepa Sharma',
        subject: 'Cloud Computing',
        department: 'Computer Science',
        rating: 4.2,
        reviewCount: 98,
        officeHours: 'Tue, Fri 2–4 PM',
        email: 'deepa.sharma@mit.edu',
        cabin: 'B-310',
        image: 'https://i.pravatar.cc/150?img=49',
        experience: 5,
        weeklyClasses: [2, 2, 3, 2, 2, 3, 2, 2, 3, 2, 3, 2],
        isAvailableNow: false,
    },
    {
        id: 't6',
        name: 'Dr. Krishna Iyer',
        subject: 'Compiler Design',
        department: 'Computer Science',
        rating: 4.7,
        reviewCount: 203,
        officeHours: 'Mon–Fri 4–5 PM',
        email: 'krishna.iyer@mit.edu',
        cabin: 'A-401',
        image: 'https://i.pravatar.cc/150?img=71',
        experience: 20,
        weeklyClasses: [4, 5, 4, 5, 4, 5, 4, 5, 4, 5, 4, 5],
        isAvailableNow: true,
    },
];
