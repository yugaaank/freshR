import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
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
import {
    currentStreak,
    longestStreak,
    pastChallenges,
    streakData,
    todayChallenge,
    totalSolved,
} from '../src/data/challenges';
import { Colors, Radius, Shadows, Spacing, Typography } from '../src/theme';

export default function CodingChallengeScreen() {
    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={22} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Daily Challenge 💻</Text>
                    <View style={{ width: 22 }} />
                </View>

                {/* Streak Stats */}
                <View style={[styles.streakRow, Shadows.sm]}>
                    {[
                        { label: 'Current Streak', value: `🔥 ${currentStreak} days` },
                        { label: 'Longest', value: `⚡ ${longestStreak} days` },
                        { label: 'Total Solved', value: `✅ ${totalSolved}` },
                    ].map((stat) => (
                        <View key={stat.label} style={styles.streakStat}>
                            <Text style={styles.streakStatValue}>{stat.value}</Text>
                            <Text style={styles.streakStatLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Today's Problem */}
                <SectionHeader title="Today's Problem" subtitle="Feb 20, 2025" style={{ marginTop: Spacing.lg }} />
                <Card style={styles.problemCard} shadow="md">
                    <View style={styles.problemTop}>
                        <View style={styles.problemTitleRow}>
                            <Text style={styles.problemTitle}>{todayChallenge.title}</Text>
                            <View style={[
                                styles.diffBadge,
                                { backgroundColor: todayChallenge.difficulty === 'Easy' ? Colors.successLight : todayChallenge.difficulty === 'Medium' ? Colors.warningLight : Colors.errorLight }
                            ]}>
                                <Text style={[
                                    styles.diffText,
                                    { color: todayChallenge.difficulty === 'Easy' ? Colors.success : todayChallenge.difficulty === 'Medium' ? Colors.primary : Colors.error }
                                ]}>
                                    {todayChallenge.difficulty}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.tagsRow}>
                            {todayChallenge.tags.map((t) => (
                                <TagPill key={t} label={t} variant="blue" size="sm" />
                            ))}
                        </View>
                    </View>

                    <Text style={styles.description}>{todayChallenge.description}</Text>

                    {/* Examples */}
                    {todayChallenge.examples.map((ex, i) => (
                        <View key={i} style={styles.exampleBox}>
                            <Text style={styles.exampleTitle}>Example {i + 1}</Text>
                            <Text style={styles.exampleLabel}>Input: <Text style={styles.exampleCode}>{ex.input}</Text></Text>
                            <Text style={styles.exampleLabel}>Output: <Text style={styles.exampleCode}>{ex.output}</Text></Text>
                            {ex.explanation && <Text style={styles.exampleLabel}>Explanation: {ex.explanation}</Text>}
                        </View>
                    ))}

                    {/* Stats */}
                    <View style={styles.statsRow}>
                        <Text style={styles.stat}>✅ Acceptance Rate: {todayChallenge.acceptanceRate}%</Text>
                        <Text style={styles.stat}>📊 {todayChallenge.totalSubmissions.toLocaleString()} submissions</Text>
                    </View>

                    <TouchableOpacity style={styles.solveBtn}>
                        <Text style={styles.solveBtnText}>Open in Editor →</Text>
                    </TouchableOpacity>
                </Card>

                {/* Streak Grid */}
                <SectionHeader title="Your Streak" subtitle="Past year" style={{ marginTop: Spacing.lg }} />
                <Card style={styles.streakCard} shadow="sm">
                    <StreakGrid data={streakData} />
                    <View style={styles.legendRow}>
                        <Text style={styles.legendText}>Less</Text>
                        {['#F0F0F5', '#C6EFCE', '#70C97A', '#0C9B52'].map((c) => (
                            <View key={c} style={[styles.legendDot, { backgroundColor: c }]} />
                        ))}
                        <Text style={styles.legendText}>More</Text>
                    </View>
                </Card>

                {/* Past Challenges */}
                <SectionHeader title="Recent Challenges" style={{ marginTop: Spacing.lg }} />
                <View style={styles.pastList}>
                    {pastChallenges.map((c) => (
                        <Card key={c.id} style={styles.pastCard} padding={Spacing.md} shadow="sm">
                            <View style={styles.pastRow}>
                                <View style={styles.pastLeft}>
                                    <Text style={styles.pastTitle}>{c.title}</Text>
                                    <View style={styles.pastTagsRow}>
                                        {c.tags.map((t) => <TagPill key={t} label={t} variant="grey" size="sm" />)}
                                    </View>
                                </View>
                                <View style={[
                                    styles.pastDiff,
                                    { backgroundColor: c.difficulty === 'Easy' ? Colors.successLight : c.difficulty === 'Medium' ? Colors.warningLight : Colors.errorLight }
                                ]}>
                                    <Text style={[
                                        styles.pastDiffText,
                                        { color: c.difficulty === 'Easy' ? Colors.success : c.difficulty === 'Medium' ? Colors.primary : Colors.error }
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

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.sectionBg },
    scroll: { paddingBottom: Spacing.xl },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.background,
    },
    headerTitle: { ...Typography.h3, color: Colors.text },
    streakRow: {
        flexDirection: 'row',
        backgroundColor: Colors.text,
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.md,
        borderRadius: Radius.xl,
        padding: Spacing.lg,
        gap: Spacing.md,
    },
    streakStat: { flex: 1, alignItems: 'center' },
    streakStatValue: { ...Typography.h5, color: '#FFF', fontWeight: '700' },
    streakStatLabel: { ...Typography.caption, color: 'rgba(255,255,255,0.6)', marginTop: 3 },
    problemCard: { marginHorizontal: Spacing.lg, gap: Spacing.md },
    problemTop: { gap: Spacing.sm },
    problemTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing.sm },
    problemTitle: { ...Typography.h4, color: Colors.text, flex: 1 },
    diffBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.full },
    diffText: { ...Typography.label, fontWeight: '700', fontSize: 11 },
    tagsRow: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' },
    description: { ...Typography.body2, color: Colors.textSecondary, lineHeight: 20 },
    exampleBox: {
        backgroundColor: Colors.sectionBg,
        borderRadius: Radius.md,
        padding: Spacing.md,
        gap: 4,
    },
    exampleTitle: { ...Typography.label, color: Colors.primary, marginBottom: 3 },
    exampleLabel: { ...Typography.caption, color: Colors.textSecondary },
    exampleCode: { fontFamily: 'monospace', color: Colors.text },
    statsRow: { gap: 4 },
    stat: { ...Typography.caption, color: Colors.textSecondary },
    solveBtn: {
        backgroundColor: Colors.primary,
        borderRadius: Radius.md,
        paddingVertical: Spacing.md,
        alignItems: 'center',
    },
    solveBtnText: { ...Typography.h5, color: '#FFF', fontWeight: '700' },
    streakCard: { marginHorizontal: Spacing.lg },
    legendRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: Spacing.sm },
    legendText: { ...Typography.caption, color: Colors.textTertiary },
    legendDot: { width: 11, height: 11, borderRadius: 2 },
    pastList: { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
    pastCard: {},
    pastRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    pastLeft: { flex: 1, gap: 6 },
    pastTitle: { ...Typography.h5, color: Colors.text },
    pastTagsRow: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' },
    pastDiff: { paddingHorizontal: Spacing.sm, paddingVertical: 3, borderRadius: Radius.full, marginLeft: Spacing.sm },
    pastDiffText: { ...Typography.label, fontWeight: '700', fontSize: 11 },
});
