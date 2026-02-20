import { create } from 'zustand';

export type Interest =
    | 'Tech'
    | 'Design'
    | 'Music'
    | 'Sports'
    | 'Literature'
    | 'Gaming'
    | 'Finance'
    | 'Dance'
    | 'Photography'
    | 'Cooking'
    | 'Travel'
    | 'Fitness'
    | 'Art'
    | 'Science'
    | 'Movies';

interface UserProfile {
    name: string;
    phone: string;
    college: string;
    branch: string;
    year: number;
    rollNo: string;
    avatar: string;
}

interface UserStore {
    isLoggedIn: boolean;
    profile: UserProfile;
    interests: Interest[];
    hasCompletedOnboarding: boolean;
    login: (phone: string) => void;
    logout: () => void;
    setInterests: (interests: Interest[]) => void;
    toggleInterest: (interest: Interest) => void;
    completeOnboarding: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
    isLoggedIn: false,
    profile: {
        name: 'Aryan Sharma',
        phone: '+91 98765 43210',
        college: 'MIT Manipal',
        branch: 'CSE',
        year: 3,
        rollNo: '210905001',
        avatar: 'https://i.pravatar.cc/150?img=12',
    },
    interests: ['Tech', 'Music', 'Gaming'],
    hasCompletedOnboarding: false,

    login: (phone) => set({ isLoggedIn: true }),
    logout: () => set({ isLoggedIn: false }),

    setInterests: (interests) => set({ interests }),

    toggleInterest: (interest) => {
        const { interests } = get();
        if (interests.includes(interest)) {
            set({ interests: interests.filter((i) => i !== interest) });
        } else {
            set({ interests: [...interests, interest] });
        }
    },

    completeOnboarding: () => set({ hasCompletedOnboarding: true }),
}));
