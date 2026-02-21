import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../src/components/ui/Card';
import SectionHeader from '../src/components/ui/SectionHeader';
import StreakGrid from '../src/components/ui/StreakGrid';
import TagPill from '../src/components/ui/TagPill';
import { StreakDay } from '../src/data/challenges';
import {
    usePastChallenges,
    useTodayChallenge,
    useUserStreak,
} from '../src/hooks/useChallenges';
import { Challenge } from '../src/lib/types/database.types';
import { Colors, Radius, Shadows, Spacing, Typography } from '../src/theme';

/** Demo user ID — swap for auth user when ready */
const DEMO_USER_ID = '11111111-1111-1111-1111-111111111111';

/** Build a 52-week streak grid from past challenge dates (stub: random for now) */
function buildStreakData(): StreakDay[] {
    const days: StreakDay[] = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        days.push({
            date: d.toISOString().split('T')[0],
            solved: Math.random() > 0.65 ? Math.floor(Math.random() * 4) + 1 : 0,
            isToday: i === 0,
        });
    }
    return days;
}
const streakData = buildStreakData();

export default function CodingChallengeScreen() {
    const { data: todayChallenge, isLoading: dayLoading } = useTodayChallenge();
    const { data: pastChallenges = [], isLoading: pastLoading } = usePastChallenges();
    const { data: streak } = useUserStreak(DEMO_USER_ID);

    const currentStreak = streak?.current_streak ?? 0;
    const longestStreak = streak?.longest_streak ?? 0;
    const totalSolved = streak?.total_solved ?? 0;

    const isLoading = dayLoading || pastLoading;

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safe} edges={['top']}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator color={Colors.primary} size="large" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {/* ═══ HEADER ═══ */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} activeOpacity={0.88}>
                        <Ionicons name="arrow-back" size={22} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Daily Challenge 💻</Text>
                    <View style={{ width: 22 }} />
                </View>

                {/* ═══ STREAK STATS ═══ */}
                <View style={styles.streakBanner}>
                    <View style={[styles.deco, { width: 120, height: 120, top: -40, right: -20, backgroundColor: Colors.accent, opacity: 0.12 }]} />
                    <View style={[styles.deco, { width: 70, height: 70, bottom: -20, left: 40, backgroundColor: Colors.primary, opacity: 0.12 }]} />
                    {[
                        { emoji: '🔥', value: `${currentStreak}`, label: 'Current Streak', unit: 'days' },
                        { emoji: '⚡', value: `${longestStreak}`, label: 'Longest', unit: 'days' },
                        { emoji: '✅', value: `${totalSolved}`, label: 'Total Solved', unit: 'problems' },
                    ].map((stat) => (
                        <View key={stat.label} style={styles.streakStat}>
                            <Text style={styles.statEmoji}>{stat.emoji}</Text>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* ═══ TODAY'S PROBLEM ═══ */}
                {todayChallenge ? (
                    <>
                        <SectionHeader title="Today's Problem" subtitle={todayChallenge.date} style={{ marginTop: Spacing.xl }} />
                        <ChallengeCard challenge={todayChallenge} />
                    </>
                ) : (
                    <View style={styles.noProblem}>
                        <Text style={styles.noProblemText}>No challenge for today yet 🏖️</Text>
                    </View>
                )}

                {/* ═══ STREAK GRID ═══ */}
                <SectionHeader title="Your Streak" subtitle="Past year" style={{ marginTop: Spacing.xl }} />
                <Card style={styles.streakCard} shadow="xs">
                    <StreakGrid data={streakData} />
                    <View style={styles.legendRow}>
                        <Text style={styles.legendText}>Less</Text>
                        {['#F2F2F7', '#C6EFCE', '#70C97A', '#0C9B52'].map((c) => (
                            <View key={c} style={[styles.legendDot, { backgroundColor: c }]} />
                        ))}
                        <Text style={styles.legendText}>More</Text>
                    </View>
                </Card>

                {/* ═══ PAST CHALLENGES ═══ */}
                <SectionHeader title="Recent Challenges" style={{ marginTop: Spacing.xl }} />
                <View style={styles.pastList}>
                    {pastChallenges.slice(0, 10).map((c: Challenge) => (
                        <Card key={c.id} style={styles.pastCard} padding={Spacing.md} shadow="xs">
                            <View style={styles.pastRow}>
                                <View style={styles.pastLeft}>
                                    <Text style={styles.pastTitle}>{c.title}</Text>
                                    <View style={styles.pastTagsRow}>
                                        {(c.tags ?? []).map((t: string) => <TagPill key={t} label={t} variant="grey" size="sm" />)}
                                    </View>
                                </View>
                                <View style={[
                                    styles.pastDiff,
                                    { backgroundColor: c.difficulty === 'Easy' ? Colors.successLight : c.difficulty === 'Medium' ? Colors.warningLight : Colors.errorLight }
                                ]}>
                                    <Text style={[
                                        styles.pastDiffText,
                                        { color: c.difficulty === 'Easy' ? Colors.success : c.difficulty === 'Medium' ? Colors.warning : Colors.error }
                                    ]}>
                                        {c.difficulty}
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    ))}
                </View>
                <View style={{ height: Spacing.xxl }} />
            </ScrollView>
        </SafeAreaView>
    );
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
    const examples = (challenge.examples as any[]) ?? [];
    return (
        <Card style={styles.problemCard} shadow="md">
            <View style={styles.problemTop}>
                <Text style={styles.problemTitle}>{challenge.title}</Text>
                <View style={[
                    styles.diffBadge,
                    { backgroundColor: challenge.difficulty === 'Easy' ? Colors.successLight : challenge.difficulty === 'Medium' ? Colors.warningLight : Colors.errorLight }
                ]}>
                    <Text style={[
                        styles.diffText,
                        { color: challenge.difficulty === 'Easy' ? Colors.success : challenge.difficulty === 'Medium' ? Colors.warning : Colors.error }
                    ]}>
                        {challenge.difficulty}
                    </Text>
                </View>
            </View>
            <View style={styles.tagsRow}>
                {(challenge.tags ?? []).map((t: string) => <TagPill key={t} label={t} variant="purple" size="sm" />)}
            </View>
            <Text style={styles.description}>{challenge.description}</Text>
            {examples.map((ex, i) => (
                <View key={i} style={styles.codeBox}>
                    <Text style={styles.codeBoxTitle}>Example {i + 1}</Text>
                    <Text style={styles.codeLine}><Text style={styles.codeKey}>Input:  </Text><Text style={styles.code}>{ex.input}</Text></Text>
                    <Text style={styles.codeLine}><Text style={styles.codeKey}>Output: </Text><Text style={styles.code}>{ex.output}</Text></Text>
                    {ex.explanation && <Text style={styles.codeExplain}>{ex.explanation}</Text>}
                </View>
            ))}
            <View style={styles.statsRow}>
                <Text style={styles.stat}>Acceptance: {challenge.acceptance_rate}%</Text>
                <View style={styles.statDot} />
                <Text style={styles.stat}>{challenge.total_submissions.toLocaleString()} submissions</Text>
            </View>
            <TouchableOpacity style={styles.solveBtn} activeOpacity={0.88}>
                <Text style={styles.solveBtnText}>Open in Editor →</Text>
            </TouchableOpacity>
        </Card>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    scroll: { paddingBottom: Spacing.xl },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.section, paddingVertical: Spacing.md },
    headerTitle: { ...Typography.h3, color: Colors.text },
    noProblem: { alignItems: 'center', paddingVertical: Spacing.xl },
    noProblemText: { ...Typography.body1, color: Colors.textSecondary },
    streakBanner: { flexDirection: 'row', backgroundColor: Colors.darkBg, marginHorizontal: Spacing.section, borderRadius: Radius.xl, padding: Spacing.xl, gap: 4, overflow: 'hidden', borderTopWidth: 1, borderTopColor: Colors.highlight, ...Shadows.md },
    deco: { position: 'absolute', borderRadius: 9999 },
    streakStat: { flex: 1, alignItems: 'center', gap: 4 },
    statEmoji: { fontSize: 24 },
    statValue: { ...Typography.h2, color: '#FFF' },
    statLabel: { ...Typography.micro, color: 'rgba(255,255,255,0.5)', textAlign: 'center', letterSpacing: 0.3 },
    problemCard: { marginHorizontal: Spacing.section, gap: Spacing.md },
    problemTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing.sm },
    problemTitle: { ...Typography.h3, color: Colors.text, flex: 1, letterSpacing: -0.3 },
    diffBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.pill },
    diffText: { ...Typography.micro, fontWeight: '700' as const, fontSize: 11 },
    tagsRow: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' },
    description: { ...Typography.body2, color: Colors.textSecondary, lineHeight: 20 },
    codeBox: { backgroundColor: '#F8F8FC', borderRadius: Radius.lg, padding: Spacing.md, gap: 4, borderLeftWidth: 3, borderLeftColor: Colors.accent },
    codeBoxTitle: { ...Typography.micro, color: Colors.accent, letterSpacing: 1, marginBottom: 2 },
    codeLine: { flexDirection: 'row', flexWrap: 'wrap' },
    codeKey: { ...Typography.mono, color: Colors.textSecondary, fontSize: 12 },
    code: { ...Typography.mono, color: Colors.text, fontSize: 12 },
    codeExplain: { ...Typography.caption, color: Colors.textSecondary, marginTop: 3 },
    statsRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    stat: { ...Typography.caption, color: Colors.textSecondary },
    statDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: Colors.textTertiary },
    solveBtn: { backgroundColor: Colors.accent, borderRadius: Radius.pill, paddingVertical: Spacing.md, alignItems: 'center', ...Shadows.colored(Colors.accent) },
    solveBtnText: { ...Typography.h5, color: '#FFF', fontWeight: '700' as const },
    streakCard: { marginHorizontal: Spacing.section },
    legendRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: Spacing.sm },
    legendText: { ...Typography.micro, color: Colors.textTertiary },
    legendDot: { width: 11, height: 11, borderRadius: 2 },
    pastList: { paddingHorizontal: Spacing.section, gap: 8 },
    pastCard: {},
    pastRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    pastLeft: { flex: 1, gap: 6 },
    pastTitle: { ...Typography.h5, color: Colors.text },
    pastTagsRow: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' },
    pastDiff: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.pill, marginLeft: Spacing.sm },
    pastDiffText: { ...Typography.micro, fontWeight: '700' as const, fontSize: 11 },
});
