import { create } from 'zustand';
import { Club } from '../lib/types/database.types';

// ─── Fallback data ────────────────────────────────────────────────────────────
const FALLBACK_CLUBS: Club[] = [
    { id: 'c0000001-0000-0000-0000-000000000001', name: 'ASCII', tagline: 'Innovate. Collaborate. Grow.', vibe_tag: 'Tech', followers_count: 3200, logo: 'https://api.dicebear.com/9.x/initials/svg?seed=ASCII&backgroundColor=000000', banner: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800', created_at: '' },
    { id: 'c0000001-0000-0000-0000-000000000002', name: 'CAADS', tagline: 'Center for Advanced Arts and Design Studies', vibe_tag: 'Creative', followers_count: 1850, logo: 'https://api.dicebear.com/9.x/initials/svg?seed=CAADS&backgroundColor=ff0055', banner: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800', created_at: '' },
    { id: 'c0000001-0000-0000-0000-000000000003', name: 'IBMZ', tagline: 'Mainframe and Enterprise Computing Club', vibe_tag: 'Tech', followers_count: 1200, logo: 'https://api.dicebear.com/9.x/initials/svg?seed=IBMZ&backgroundColor=0033ff', banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', created_at: '' },
    { id: 'c0000001-0000-0000-0000-000000000004', name: 'Student Council', tagline: 'Your Voice, Your Campus, Your Leadership', vibe_tag: 'Social', followers_count: 5400, logo: 'https://api.dicebear.com/9.x/initials/svg?seed=SC&backgroundColor=ffaa00', banner: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800', created_at: '' },
];

interface ClubStore {
    clubs: Club[];
    setClubs: (clubs: Club[]) => void;
    getClub: (clubId: string) => Club | undefined;
}

export const useClubStore = create<ClubStore>((set, get) => ({
    clubs: FALLBACK_CLUBS,
    setClubs: (clubs) => set({ clubs }),
    getClub: (clubId) => get().clubs.find(c => c.id === clubId),
}));
