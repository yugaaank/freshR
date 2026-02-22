import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../src/components/ui/Card';
import ProgressRing from '../src/components/ui/ProgressRing';
import SectionHeader from '../src/components/ui/SectionHeader';
import TagPill from '../src/components/ui/TagPill';
import { useAcademicProfile, useAssignments, useSubjects } from '../src/hooks/useAcademics';
import { useUserStore } from '../src/store/userStore';
import { Colors, Radius, Spacing, Typography, Gradients } from '../src/theme';
import dayjs from 'dayjs';

export default function AcademicDashboard() {
    const { profile } = useUserStore();
    const userId = profile?.id ?? '11111111-1111-1111-1111-111111111111';
    
    const { data: subjects = [], isLoading: subLoading } = useSubjects(userId);
    const { data: assignments = [], isLoading: asnLoading } = useAssignments(userId);
    const { data: academicProfile, isLoading: profLoading } = useAcademicProfile(userId);

    const isLoading = subLoading || asnLoading || profLoading;

    const nextAssignment = useMemo(
        () => assignments.find((a: any) => a.status === 'pending') ?? assignments[0],
        [assignments]
    );
    const focusSubject = useMemo(
        () => [...subjects].sort((a: any, b: any) => b.grade_point - a.grade_point)[0],
        [subjects]
    );
    const pendingAssignmentsCount = useMemo(
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

    const cgpa = academicProfile?.cgpa ?? 0;
    const sgpa = academicProfile?.sgpa ?? 0;
    const branch = academicProfile?.branch ?? 'CSE';
    const semester = academicProfile?.semester ?? 5;
    const year = academicProfile?.year ?? 3;
    const earnedCred = academicProfile?.earnedCredits ?? 0;
    const totalCred = academicProfile?.totalCredits ?? 0;
    const division = academicProfile?.division ?? 'A';

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Academic Hub</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <View style={styles.userBanner}>
                    <View>
                        <Text style={styles.branchText}>{branch}</Text>
                        <Text style={styles.yearText}>{year}rd Year · Sem {semester}</Text>
                    </View>
                    <View style={styles.divisionBadge}>
                        <Text style={styles.divisionText}>DIV {division}</Text>
                    </View>
                </View>

                <View style={styles.metricsCard}>
                    <View style={styles.metricsBgCircle} />
                    <View style={styles.metrics}>
                        <View style={styles.cgpaArea}>
                            <Text style={styles.cgpaLabel}>CGPA</Text>
                            <Text style={styles.cgpaValue}>{cgpa.toFixed(2)}</Text>
                            <Text style={styles.cgpaSubLabel}>/ 10.0</Text>
                            <ProgressRing progress={(cgpa / 10) * 100} size={80} strokeWidth={6} color="#26a641" label="" />
                        </View>
                        <View style={styles.metricsDivider} />
                        <View style={styles.metricsList}>
                            {[
                                { label: 'SGPA', value: sgpa.toFixed(2), color: '#FFFFFF' },
                                { label: 'Credits', value: `${earnedCred}/${totalCred}`, color: '#FFFFFF' },
                                { label: 'Rank', value: '#14', color: Colors.warning },
                            ].map((m) => (
                                <View key={m.label} style={styles.metricItem}>
                                    <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
                                    <Text style={styles.metricLabel}>{m.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {focusSubject && (
                    <LinearGradient colors={Gradients.academics} style={styles.heroBanner}>
                        <Text style={styles.heroLabel}>PREPARING FOR</Text>
                        <Text style={styles.heroTitle}>{focusSubject.name}</Text>
                        <Text style={styles.heroSubtitle}>
                            Next: {focusSubject.next_class || 'Tomorrow'} · {nextAssignment?.title || 'No pending tasks'}
                        </Text>
                        <View style={styles.heroStats}>
                            <View style={styles.heroStat}>
                                <Text style={styles.heroStatValue}>{focusSubject.attendance}%</Text>
                                <Text style={styles.heroStatLabel}>Attendance</Text>
                            </View>
                            <View style={styles.heroStat}>
                                <Text style={styles.heroStatValue}>{pendingAssignmentsCount}</Text>
                                <Text style={styles.heroStatLabel}>Assignments</Text>
                            </View>
                            <View style={styles.heroStat}>
                                <Text style={styles.heroStatValue}>{focusSubject.grade}</Text>
                                <Text style={styles.heroStatLabel}>Current Grade</Text>
                            </View>
                        </View>
                    </LinearGradient>
                )}

                <SectionHeader title="Course Progress" subtitle="View all subjects" style={{ marginTop: Spacing.xl }} />
                <View style={styles.subjectList}>
                    {subjects.map((item: any) => {
                        const att = item.attendance ?? 0;
                        let ringColor = '#26a641';
                        if (att < 75) ringColor = '#0e4429';
                        else if (att < 85) ringColor = '#006d21';

                        return (
                            <Card key={item.subject_id} style={styles.subjectCard} padding={Spacing.md}>
                                <View style={[styles.subjectStrip, {
                                    backgroundColor: item.grade_point >= 9 ? Colors.success : item.grade_point >= 7 ? Colors.info : Colors.error,
                                }]} />
                                <View style={styles.subjectBody}>
                                    <View style={styles.subjectTop}>
                                        <View style={styles.subjectLeft}>
                                            <Text style={styles.subjectCode}>{item.code}</Text>
                                            <Text style={styles.subjectName}>{item.name}</Text>
                                            <Text style={styles.subjectProf}>{item.professor}</Text>
                                        </View>
                                        <ProgressRing progress={att} size={56} strokeWidth={5} color={ringColor} label={`${att}%`} />
                                    </View>
                                    
                                    <View style={styles.syllabusTracker}>
                                        <View style={styles.syllabusLabelRow}>
                                            <Text style={styles.syllabusLabel}>Syllabus Completion</Text>
                                            <Text style={styles.syllabusVal}>{item.syllabus_progress ?? 65}%</Text>
                                        </View>
                                        <View style={styles.progressBarBg}>
                                            <View style={[styles.progressBarFill, { width: `${item.syllabus_progress ?? 65}%`, backgroundColor: item.grade_point >= 9 ? Colors.success : Colors.primary }]} />
                                        </View>
                                    </View>

                                    <View style={styles.subjectBottom}>
                                        <TagPill
                                            label={`${item.grade} · ${item.grade_point}/10`}
                                            variant={item.grade_point >= 9 ? 'green' : item.grade_point >= 7 ? 'blue' : 'red'}
                                            size="sm"
                                        />
                                        <Text style={styles.nextClass}>Next: {item.next_class || 'TBD'}</Text>
                                    </View>
                                </View>
                            </Card>
                        );
                    })}
                </View>

                <SectionHeader title="Assignments" subtitle="Track deadlines" style={{ marginTop: Spacing.xl }} />
                <View style={styles.assignmentList}>
                    {assignments.map((a: any) => (
                        <Card key={a.id} style={styles.assignmentCard} padding={0}>
                            <View style={styles.assignmentBody}>
                                <View style={styles.assignmentRow}>
                                    <View style={styles.assignmentLeft}>
                                        <Text style={styles.assignmentTitle}>{a.title}</Text>
                                        <Text style={styles.assignmentSubject}>{a.subject_name}</Text>
                                        <Text style={styles.assignmentDue}>Due: {dayjs(a.due_date).format('MMM D, YYYY')}</Text>
                                    </View>
                                    <TagPill
                                        label={a.status.toUpperCase()}
                                        variant={a.status === 'submitted' ? 'green' : a.status === 'graded' ? 'blue' : 'red'}
                                        size="sm"
                                    />
                                </View>
                            </View>
                        </Card>
                    ))}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    scroll: { paddingBottom: Spacing.xl },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.section,
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
        borderWidth: 0.5,
        borderColor: Colors.divider,
    },
    headerTitle: {
        ...Typography.h3,
        color: Colors.text,
    },
    userBanner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.section,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.md,
    },
    branchText: { ...Typography.h2, color: Colors.text },
    yearText: { ...Typography.body2, color: Colors.textSecondary, marginTop: 2 },
    divisionBadge: { backgroundColor: Colors.secondary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.md, borderWidth: 0.5, borderColor: Colors.divider },
    divisionText: { fontSize: 11, fontWeight: '800', color: Colors.text },
    heroBanner: { marginHorizontal: Spacing.section, borderRadius: Radius.xxl, padding: Spacing.lg, marginBottom: Spacing.md, marginTop: Spacing.md },
    heroLabel: { ...Typography.micro, color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
    heroTitle: { ...Typography.h3, color: '#FFF', marginTop: Spacing.xs, marginBottom: Spacing.xs },
    heroSubtitle: { ...Typography.body2, color: 'rgba(255,255,255,0.8)', marginBottom: Spacing.md },
    heroStats: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.md },
    heroStat: { flex: 1 },
    heroStatValue: { ...Typography.h4, color: '#FFF', fontWeight: '700' as const },
    heroStatLabel: { ...Typography.caption, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
    metricsCard: { backgroundColor: Colors.primary, marginHorizontal: Spacing.section, borderRadius: Radius.xl, padding: Spacing.xl, overflow: 'hidden', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', marginBottom: Spacing.md },
    metricsBgCircle: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(255,255,255,1)', opacity: 0.05, top: -60, right: -40 },
    metrics: { flexDirection: 'row', alignItems: 'center' },
    cgpaArea: { alignItems: 'center', gap: 2 },
    cgpaLabel: { ...Typography.micro, color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5 },
    cgpaValue: { ...Typography.display, color: '#FFFFFF', letterSpacing: -2 },
    cgpaSubLabel: { ...Typography.body2, color: 'rgba(255,255,255,0.5)' },
    metricsDivider: { width: 1, height: 80, backgroundColor: 'rgba(255,255,255,0.15)', marginHorizontal: Spacing.xl },
    metricsList: { flex: 1, flexWrap: 'wrap', flexDirection: 'row', gap: Spacing.lg },
    metricItem: { width: '45%' },
    metricValue: { ...Typography.h4, color: '#FFFFFF', fontWeight: '700' as const },
    metricLabel: { ...Typography.caption, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
    subjectList: { paddingHorizontal: Spacing.section, gap: 12 },
    subjectCard: { flexDirection: 'row', overflow: 'hidden', padding: 0, borderWidth: 0.5, borderColor: Colors.divider },
    subjectStrip: { width: 4 },
    subjectBody: { flex: 1, padding: Spacing.md, gap: Spacing.sm },
    subjectTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
    subjectLeft: { flex: 1 },
    subjectCode: { ...Typography.micro, color: Colors.primary, letterSpacing: 1.2 },
    subjectName: { ...Typography.h5, color: Colors.text },
    subjectProf: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
    syllabusTracker: { marginVertical: Spacing.sm },
    syllabusLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    syllabusLabel: { ...Typography.micro, color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5 },
    syllabusVal: { ...Typography.micro, color: Colors.text, fontFamily: 'Sora_700Bold' },
    progressBarBg: { height: 6, backgroundColor: Colors.secondary, borderRadius: 3, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 3 },
    subjectBottom: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
    nextClass: { ...Typography.caption, color: Colors.textTertiary },
    assignmentList: { paddingHorizontal: Spacing.section, gap: 12 },
    assignmentCard: { borderWidth: 0.5, borderColor: Colors.divider },
    assignmentBody: { flex: 1, padding: Spacing.md },
    assignmentRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
    assignmentLeft: { flex: 1 },
    assignmentTitle: { ...Typography.h5, color: Colors.text },
    assignmentSubject: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
    assignmentDue: { ...Typography.caption, color: Colors.primary, marginTop: 6, fontWeight: '700' as const },
});
