import { create } from 'zustand';
import { DBEvent } from '../lib/types/database.types';

// ─── Fallback data ────────────────────────────────────────────────────────────
const FALLBACK_EVENTS: DBEvent[] = [
    { id: 'e1', club_id: 'c1', title: 'Intro to React Native AI', description: 'Learn intelligent mobile apps.', date: '2025-02-25', time: '18:00', venue: 'Lab 3', total_seats: 50, registered_count: 45, category: 'Tech', media_assets: ['https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800'], engagement_score: 120, created_at: '', host: '', organizer: '', college: '', city: '', color_bg: null, emoji: null, image: null, is_featured: false, tags: [], tickets: null },
    { id: 'e2', club_id: 'c2', title: 'Figma Auto-Layout Workshop', description: 'Master Auto-Layout.', date: '2025-02-28', time: '14:00', venue: 'Design Studio', total_seats: 30, registered_count: 12, category: 'Workshop', media_assets: ['https://images.unsplash.com/photo-1542744094-24638ea0b3b5?w=800'], engagement_score: 85, created_at: '', host: '', organizer: '', college: '', city: '', color_bg: null, emoji: null, image: null, is_featured: false, tags: [], tickets: null },
    { id: 'e3', club_id: 'c3', title: 'Global 24H Hack', description: 'Annual hackathon marathon.', date: '2025-03-10', time: '09:00', venue: 'Main Auditorium', total_seats: 200, registered_count: 198, category: 'Tech', media_assets: ['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800'], engagement_score: 450, host: 'HackMIT', created_at: '', organizer: '', college: '', city: '', color_bg: null, emoji: null, image: null, is_featured: true, tags: [], tickets: null },
    { id: 'e4', club_id: 'c4', title: 'Acoustic Night out', description: 'Chill vibes, free snacks.', date: '2025-02-22', time: '20:00', venue: 'Campus Lawn', total_seats: 500, registered_count: 150, category: 'Cultural', media_assets: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'], engagement_score: 210, host: 'University Committee', created_at: '', organizer: '', college: '', city: '', color_bg: null, emoji: null, image: null, is_featured: false, tags: [], tickets: null },
];

interface EventStore {
    events: DBEvent[];
    setEvents: (events: DBEvent[]) => void;
    getEvent: (eventId: string) => DBEvent | undefined;
    getClubEvents: (clubId: string) => DBEvent[];
}

export const useEventStore = create<EventStore>((set, get) => ({
    events: FALLBACK_EVENTS,
    setEvents: (events) => set({ events }),
    getEvent: (eventId) => get().events.find(e => e.id === eventId),
    getClubEvents: (clubId) => get().events.filter(e => e.club_id === clubId),
}));
