import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../src/components/ui/Card';
import ProgressRing from '../src/components/ui/ProgressRing';
import SectionHeader from '../src/components/ui/SectionHeader';
import TagPill from '../src/components/ui/TagPill';
import { useAcademicProfile, useAssignments, useSubjects } from '../src/hooks/useAcademics';
import { Colors, Radius, Shadows, Spacing, Typography } from '../src/theme';

/** Fallback userId — swap this for the real auth user when auth is wired */
const DEMO_USER_ID = '11111111-1111-1111-1111-111111111111';

export default function AcademicDashboard() {
    const { data: subjects = [], isLoading: subLoading } = useSubjects(DEMO_USER_ID);
    const { data: assignments = [], isLoading: asnLoading } = useAssignments(DEMO_USER_ID);
    const { data: profile, isLoading: profLoading } = useAcademicProfile(DEMO_USER_ID);

    const isLoading = subLoading || asnLoading || profLoading;

    const nextAssignment = useMemo(
        () => assignments.find((a: any) => a.status === 'pending') ?? assignments[0],
        [assignments]
    );
    const focusSubject = useMemo(
        () => subjects.slice().sort((a: any, b: any) => b.grade_point - a.grade_point)[0],
        [subjects]
    );
    const pendingAssignments = useMemo(
        () => assignments.filter((a: any) => a.status === 'pending').length,
        [assignments]
    );

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safe} edges={['top']}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator color={Colors.primary} size="large" />
                </View>
            </SafeAreaView>
        );
    }

    const cgpa = profile?.cgpa ?? 0;
    const sgpa = profile?.sgpa ?? 0;
    const branch = profile?.branch ?? subjects[0]?.name?.split(' ')[0] ?? 'CSE';
    const semester = profile?.semester ?? 5;
    const year = profile?.year ?? 3;
    const earnedCred = profile?.earnedCredits ?? 0;
    const totalCred = profile?.totalCredits ?? 0;
    const division = profile?.division ?? 'A';

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

                {/* ═══ HEADER ═══ */}
                <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>Academics 📚</Text>
                    <Text style={styles.pageSubtitle}>{branch} · Sem {semester} · {year}rd Year</Text>
                </View>

                {/* ═══ DARK METRICS CARD ═══ */}
                <View style={[styles.metricsCard, Shadows.lg]}>
                    <View style={styles.metricsBgCircle} />
                    <View style={styles.metrics}>
                        <View style={styles.cgpaArea}>
                            <Text style={styles.cgpaLabel}>CGPA</Text>
                            <Text style={styles.cgpaValue}>{cgpa}</Text>
                            <Text style={styles.cgpaSubLabel}>/ 10.0</Text>
                            <ProgressRing progress={(cgpa / 10) * 100} size={80} strokeWidth={6} color={Colors.primary} label="" />
                        </View>
                        <View style={styles.metricsDivider} />
                        <View style={styles.metricsList}>
                            {[
                                { label: 'SGPA', value: String(sgpa), color: Colors.primary },
                                { label: 'Credits', value: `${earnedCred}/${totalCred}`, color: Colors.success },
                                { label: 'Division', value: division, color: '#FFD60A' },
                            ].map((m) => (
                                <View key={m.label} style={styles.metricItem}>
                                    <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
                                    <Text style={styles.metricLabel}>{m.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* ═══ FOCUS BANNER ═══ */}
                {focusSubject && (
                    <LinearGradient colors={['#120A3E', '#1E1B3B', '#2B2D4B']} style={styles.heroBanner}>
                        <Text style={styles.heroLabel}>Focus today</Text>
                        <Text style={styles.heroTitle}>{focusSubject.name}</Text>
                        <Text style={styles.heroSubtitle}>Next: {focusSubject.next_class ?? 'TBD'} · {nextAssignment?.title ?? 'No pending'}</Text>
                        <View style={styles.heroStats}>
                            <View style={styles.heroStat}>
                                <Text style={styles.heroStatValue}>{cgpa}</Text>
                                <Text style={styles.heroStatLabel}>Current CGPA</Text>
                            </View>
                            <View style={styles.heroStat}>
                                <Text style={styles.heroStatValue}>{pendingAssignments}</Text>
                                <Text style={styles.heroStatLabel}>Assignments left</Text>
                            </View>
                            <View style={styles.heroStat}>
                                <Text style={styles.heroStatValue}>{earnedCred}</Text>
                                <Text style={styles.heroStatLabel}>Credits</Text>
                            </View>
                        </View>
                    </LinearGradient>
                )}

                {/* ═══ SUBJECTS ═══ */}
                <SectionHeader title="Subjects" subtitle="Current semester" style={{ marginTop: Spacing.xl }} />
                <View style={styles.subjectList}>
                    {subjects.map((subject: any) => {
                        const att = subject.attendance ?? 0;
                        let ringColor = Colors.success;
                        if (att < 75) ringColor = Colors.error;
                        else if (att < 85) ringColor = Colors.warning;

                        return (
                            <Card key={subject.subject_id ?? subject.id} style={styles.subjectCard} padding={Spacing.md} shadow="xs">
                                <View style={[styles.subjectStrip, {
                                    backgroundColor: subject.grade_point >= 9 ? Colors.success : subject.grade_point >= 7 ? Colors.info : Colors.error,
                                }]} />
                                <View style={styles.subjectBody}>
                                    <View style={styles.subjectTop}>
                                        <View style={styles.subjectLeft}>
                                            <Text style={styles.subjectCode}>{subject.code}</Text>
                                            <Text style={styles.subjectName}>{subject.name}</Text>
                                            <Text style={styles.subjectProf}>{subject.professor}</Text>
                                        </View>
                                        <ProgressRing progress={att} size={56} strokeWidth={5} color={ringColor} label={`${att}%`} />
                                    </View>
                                    <View style={styles.subjectBottom}>
                                        <TagPill
                                            label={`${subject.grade} · ${subject.grade_point}/10`}
                                            variant={subject.grade_point >= 9 ? 'green' : subject.grade_point >= 7 ? 'blue' : 'red'}
                                            size="sm"
                                        />
                                        <Text style={styles.nextClass}>Next: {subject.next_class ?? 'TBD'}</Text>
                                        {att < 75 && <TagPill label="⚠ Low attendance" variant="red" size="sm" />}
                                    </View>
                                </View>
                            </Card>
                        );
                    })}
                </View>

                {/* ═══ ASSIGNMENTS ═══ */}
                <SectionHeader title="Assignments" subtitle="Due this month" style={{ marginTop: Spacing.xl }} />
                <View style={styles.assignmentList}>
                    {assignments.map((a: any) => (
                        <Card key={a.id} style={styles.assignmentCard} padding={Spacing.md} shadow="xs">
                            <View style={[styles.assignmentStrip, {
                                backgroundColor: a.status === 'submitted' ? Colors.success : a.status === 'graded' ? Colors.info : Colors.error,
                            }]} />
                            <View style={styles.assignmentBody}>
                                <View style={styles.assignmentRow}>
                                    <View style={styles.assignmentLeft}>
                                        <Text style={styles.assignmentTitle}>{a.title}</Text>
                                        <Text style={styles.assignmentSubject}>{a.subject_name}</Text>
                                        <Text style={styles.assignmentDue}>Due: {a.due_date}</Text>
                                    </View>
                                    <TagPill
                                        label={a.status === 'graded' ? `${a.marks}/${a.total_marks}` : a.status}
                                        variant={a.status === 'submitted' ? 'green' : a.status === 'graded' ? 'blue' : 'red'}
                                        size="sm"
                                    />
                                </View>
                            </View>
                        </Card>
                    ))}
                </View>

                <View style={{ height: 90 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    scroll: { paddingBottom: Spacing.xl },
    pageHeader: { paddingHorizontal: Spacing.section, paddingTop: Spacing.md, paddingBottom: Spacing.lg },
    pageTitle: { ...Typography.h1, color: Colors.text },
    pageSubtitle: { ...Typography.body2, color: Colors.textSecondary, marginTop: 4 },
    heroBanner: { marginHorizontal: Spacing.section, borderRadius: Radius.xxl, padding: Spacing.lg, backgroundColor: '#120A3E', marginBottom: Spacing.md, marginTop: Spacing.md },
    heroLabel: { ...Typography.micro, color: 'rgba(255,255,255,0.7)' },
    heroTitle: { ...Typography.h3, color: '#FFF', marginTop: Spacing.xs, marginBottom: Spacing.xs },
    heroSubtitle: { ...Typography.body2, color: 'rgba(255,255,255,0.8)', marginBottom: Spacing.md },
    heroStats: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.md },
    heroStat: { flex: 1 },
    heroStatValue: { ...Typography.h4, color: '#FFF', fontWeight: '700' as const },
    heroStatLabel: { ...Typography.caption, color: 'rgba(255,255,255,0.65)' },
    metricsCard: { backgroundColor: Colors.darkBg, marginHorizontal: Spacing.section, borderRadius: Radius.xl, padding: Spacing.xl, overflow: 'hidden', borderTopWidth: 1, borderTopColor: Colors.highlight, marginBottom: Spacing.md },
    metricsBgCircle: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: Colors.accentGradientStart, opacity: 0.07, top: -60, right: -40 },
    metrics: { flexDirection: 'row', alignItems: 'center' },
    cgpaArea: { alignItems: 'center', gap: 2 },
    cgpaLabel: { ...Typography.micro, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5 },
    cgpaValue: { ...Typography.display, color: '#FFF', letterSpacing: -2 },
    cgpaSubLabel: { ...Typography.body2, color: 'rgba(255,255,255,0.4)' },
    metricsDivider: { width: 1, height: 80, backgroundColor: 'rgba(255,255,255,0.10)', marginHorizontal: Spacing.xl },
    metricsList: { flex: 1, flexWrap: 'wrap', flexDirection: 'row', gap: Spacing.lg },
    metricItem: { width: '45%' },
    metricValue: { ...Typography.h4, fontWeight: '700' as const },
    metricLabel: { ...Typography.caption, color: 'rgba(255,255,255,0.45)', marginTop: 2 },
    subjectList: { paddingHorizontal: Spacing.section, gap: 10 },
    subjectCard: { flexDirection: 'row', overflow: 'hidden', padding: 0 },
    subjectStrip: { width: 4 },
    subjectBody: { flex: 1, padding: Spacing.md, gap: Spacing.sm },
    subjectTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
    subjectLeft: { flex: 1 },
    subjectCode: { ...Typography.micro, color: Colors.primary, letterSpacing: 1.2 },
    subjectName: { ...Typography.h5, color: Colors.text },
    subjectProf: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
    subjectBottom: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    nextClass: { ...Typography.caption, color: Colors.textSecondary },
    assignmentList: { paddingHorizontal: Spacing.section, gap: 10 },
    assignmentCard: { flexDirection: 'row', overflow: 'hidden', padding: 0 },
    assignmentStrip: { width: 4 },
    assignmentBody: { flex: 1, padding: Spacing.md },
    assignmentRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
    assignmentLeft: { flex: 1 },
    assignmentTitle: { ...Typography.h5, color: Colors.text },
    assignmentSubject: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
    assignmentDue: { ...Typography.caption, color: Colors.primary, marginTop: 4, fontWeight: '600' as const },
});
