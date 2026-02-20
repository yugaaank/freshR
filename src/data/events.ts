export type EventCategory = 'Tech' | 'Cultural' | 'Sports' | 'Academic' | 'Music' | 'Drama' | 'Workshop';

export interface EventTicket {
    type: string;
    price: number;
    available: number;
}

export interface Event {
    id: string;
    title: string;
    category: EventCategory;
    date: string;
    time: string;
    venue: string;
    organizer: string;
    college: string;
    city: string;
    description: string;
    image: string;
    seatsLeft: number;
    totalSeats: number;
    isRegistered: boolean;
    isFeatured: boolean;
    tickets: EventTicket[];
    tags: string[];
    attendees: number;
}

export const events: Event[] = [
    {
        id: 'e1',
        title: 'HackMIT 2025 — 36hr Hackathon',
        category: 'Tech',
        date: '2025-03-15',
        time: '09:00 AM',
        venue: 'Innovation Hub, MIT Manipal',
        organizer: 'Tech Club MIT',
        college: 'MIT Manipal',
        city: 'Manipal',
        description:
            'The biggest hackathon on campus. Build anything from AI to blockchain. ₹5L prize pool. Mentors from Google, Microsoft, and top startups. Team size 2–4. Food and accommodation provided.',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
        seatsLeft: 12,
        totalSeats: 200,
        isRegistered: false,
        isFeatured: true,
        tickets: [
            { type: 'Participant', price: 0, available: 12 },
            { type: 'Spectator', price: 50, available: 80 },
        ],
        tags: ['Hackathon', 'AI', 'Prizes', 'Free'],
        attendees: 188,
    },
    {
        id: 'e2',
        title: 'Revibe Music Fest 2025',
        category: 'Music',
        date: '2025-03-20',
        time: '06:00 PM',
        venue: 'Open Amphitheatre',
        organizer: 'Music Society',
        college: 'MIT Manipal',
        city: 'Manipal',
        description:
            'Annual inter-college music festival featuring bands, solo artists, and DJ nights. Past performers include Prateek Kuhad, Ritviz.',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
        seatsLeft: 3,
        totalSeats: 500,
        isRegistered: false,
        isFeatured: true,
        tickets: [
            { type: 'General', price: 199, available: 3 },
            { type: 'VIP', price: 499, available: 15 },
        ],
        tags: ['Music', 'Live', 'DJ Night'],
        attendees: 482,
    },
    {
        id: 'e3',
        title: 'React Native Workshop',
        category: 'Workshop',
        date: '2025-02-25',
        time: '10:00 AM',
        venue: 'CS Lab 301',
        organizer: 'GDSC MIT',
        college: 'MIT Manipal',
        city: 'Manipal',
        description:
            'Hands-on workshop building a mobile app from scratch. Basic JavaScript knowledge required. Laptops mandatory.',
        image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800',
        seatsLeft: 24,
        totalSeats: 60,
        isRegistered: false,
        isFeatured: false,
        tickets: [{ type: 'Participant', price: 0, available: 24 }],
        tags: ['Mobile', 'Free', 'Laptop Required'],
        attendees: 36,
    },
    {
        id: 'e4',
        title: 'IPL Watch Party @ Campus',
        category: 'Sports',
        date: '2025-03-22',
        time: '07:30 PM',
        venue: 'Student Activity Center',
        organizer: 'Sports Council',
        college: 'MIT Manipal',
        city: 'Manipal',
        description: 'Massive screens, food stalls, and live commentary commentary. Come support your favorite team.',
        image: 'https://images.unsplash.com/photo-1540747913346-19212a4b423a?w=800',
        seatsLeft: 150,
        totalSeats: 300,
        isRegistered: true,
        isFeatured: false,
        tickets: [{ type: 'General', price: 0, available: 150 }],
        tags: ['Cricket', 'IPL', 'Free'],
        attendees: 150,
    },
    {
        id: 'e5',
        title: 'Startup Pitch Night — Cohort 7',
        category: 'Academic',
        date: '2025-03-05',
        time: '05:00 PM',
        venue: 'Auditorium A',
        organizer: 'E-Cell MIT',
        college: 'MIT Manipal',
        city: 'Manipal',
        description:
            '15 student startups pitch to a panel of VCs and angel investors. ₹1L seed funding up for grabs. Open for all to attend.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
        seatsLeft: 8,
        totalSeats: 100,
        isRegistered: false,
        isFeatured: true,
        tickets: [{ type: 'Audience', price: 0, available: 8 }],
        tags: ['Startup', 'VC', 'Funding'],
        attendees: 92,
    },
    {
        id: 'e6',
        title: 'Bengaluru Design Week 2025',
        category: 'Cultural',
        date: '2025-04-01',
        time: '11:00 AM',
        venue: 'MLR Convention Center',
        organizer: 'Designathon India',
        college: 'City Event',
        city: 'Bengaluru',
        description:
            'City-wide design conference with workshops, portfolio reviews, and talks by top designers from Meta, Adobe, and Zomato.',
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        seatsLeft: 200,
        totalSeats: 800,
        isRegistered: false,
        isFeatured: true,
        tickets: [
            { type: 'Student', price: 299, available: 200 },
            { type: 'Professional', price: 999, available: 100 },
        ],
        tags: ['Design', 'UX', 'Portfolio Review'],
        attendees: 600,
    },
    {
        id: 'e7',
        title: 'TEDx Bengaluru — Re:Think',
        category: 'Academic',
        date: '2025-04-10',
        time: '09:00 AM',
        venue: 'Shankar Nag Theatre',
        organizer: 'TEDx Bengaluru',
        college: 'City Event',
        city: 'Bengaluru',
        description: '12 speakers. 1 day. Ideas worth spreading on climate tech, mental health, and education equity.',
        image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800',
        seatsLeft: 47,
        totalSeats: 600,
        isRegistered: false,
        isFeatured: false,
        tickets: [{ type: 'General', price: 499, available: 47 }],
        tags: ['TED', 'Talks', 'Inspiration'],
        attendees: 553,
    },
];
