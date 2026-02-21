import { create } from 'zustand';

export interface StreakDay {
    date: string;
    solved: number;
    isToday?: boolean;
}

interface ChallengeStore {
    streakData: StreakDay[];
}

/** 
 * Build a deterministic but "random-looking" heatmap for the hackathon demo.
 * This ensures the graph is always populated without needing real activity DB entries.
 */
function buildMockStreakData(): StreakDay[] {
    const data: StreakDay[] = [];
    // Increase to 210 points (30 weeks) to fill the screen better
    for (let i = 0; i < 210; i++) {
        // Create a more realistic activity pattern using multiple frequencies
        const base = Math.sin(i * 0.3) * Math.cos(i * 0.15);
        const noise = (Math.sin(i * 0.8) + Math.cos(i * 1.2)) * 0.2;
        const random = Math.random() * 0.3;
        const score = base + noise + random;
        
        let solved = 0;
        if (score > 0.8) solved = 3;
        else if (score > 0.4) solved = 2;
        else if (score > 0.1) solved = 1;
        
        data.push({
            date: `2025-01-${i}`, 
            solved,
            isToday: i === 209
        });
    }
    return data;
}

export const useChallengeStore = create<ChallengeStore>((set) => ({
    streakData: buildMockStreakData(),
}));
