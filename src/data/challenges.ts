export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface CodingChallenge {
    id: string;
    title: string;
    difficulty: Difficulty;
    tags: string[];
    description: string;
    examples: { input: string; output: string; explanation?: string }[];
    constraints: string[];
    acceptanceRate: number;
    totalSubmissions: number;
    isToday: boolean;
}

export interface StreakDay {
    date: string;
    solved: number;
    isToday: boolean;
}

export const todayChallenge: CodingChallenge = {
    id: 'ch1',
    title: 'Minimum Path Sum in Grid',
    difficulty: 'Medium',
    tags: ['Dynamic Programming', 'Array', 'Matrix'],
    description:
        'Given a m x n grid filled with non-negative numbers, find a path from the top-left to the bottom-right corner which minimizes the sum of all numbers along its path.\n\nNote: You can only move either down or right at any point in time.',
    examples: [
        {
            input: 'grid = [[1,3,1],[1,5,1],[4,2,1]]',
            output: '7',
            explanation: 'Path 1→3→1→1→1 minimizes the sum.',
        },
        {
            input: 'grid = [[1,2,3],[4,5,6]]',
            output: '12',
        },
    ],
    constraints: [
        'm == grid.length',
        'n == grid[i].length',
        '1 ≤ m, n ≤ 200',
        '0 ≤ grid[i][j] ≤ 200',
    ],
    acceptanceRate: 61.4,
    totalSubmissions: 924832,
    isToday: true,
};

export const pastChallenges: CodingChallenge[] = [
    {
        id: 'ch2',
        title: 'Two Sum',
        difficulty: 'Easy',
        tags: ['Array', 'Hash Table'],
        description: 'Find two numbers that add up to target.',
        examples: [],
        constraints: [],
        acceptanceRate: 51.4,
        totalSubmissions: 10234567,
        isToday: false,
    },
    {
        id: 'ch3',
        title: 'Merge Intervals',
        difficulty: 'Medium',
        tags: ['Array', 'Sorting'],
        description: 'Merge all overlapping intervals.',
        examples: [],
        constraints: [],
        acceptanceRate: 46.3,
        totalSubmissions: 2341233,
        isToday: false,
    },
    {
        id: 'ch4',
        title: 'Trapping Rain Water',
        difficulty: 'Hard',
        tags: ['Array', 'Two Pointers', 'Stack'],
        description: 'Calculate the trapped rain water.',
        examples: [],
        constraints: [],
        acceptanceRate: 59.1,
        totalSubmissions: 1823741,
        isToday: false,
    },
];

// Generate 52 weeks of streak data
const generateStreakData = (): StreakDay[] => {
    const days: StreakDay[] = [];
    const today = new Date('2025-02-20');
    for (let i = 364; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const rand = Math.random();
        days.push({
            date: d.toISOString().split('T')[0],
            solved: rand < 0.35 ? 0 : rand < 0.6 ? 1 : rand < 0.85 ? 2 : 3,
            isToday: i === 0,
        });
    }
    return days;
};

export const streakData = generateStreakData();
export const currentStreak = 14;
export const longestStreak = 31;
export const totalSolved = 187;
