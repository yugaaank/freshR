import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../src/components/ui/Card';
import ProgressRing from '../../src/components/ui/ProgressRing';
import SectionHeader from '../../src/components/ui/SectionHeader';
import TagPill from '../../src/components/ui/TagPill';
import { academicProfile, assignments, subjects } from '../../src/data/academics';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../src/theme';

export default function AcademicDashboard() {
    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {/* ═══ HEADER ═══ */}
                <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>Academics 📚</Text>
                    <Text style={styles.pageSubtitle}>
                        {academicProfile.branch} · Sem {academicProfile.semester} · {academicProfile.year}rd Year
                    </Text>
                </View>

                {/* ═══ DARK METRICS CARD (Blinkit-inspired dark punch) ═══ */}
                <View style={[styles.metricsCard, Shadows.lg]}>
                    {/* Decorative bg circle */}
                    <View style={styles.metricsBgCircle} />

                    <View style={styles.metrics}>
                        <View style={styles.cgpaArea}>
                            <Text style={styles.cgpaLabel}>CGPA</Text>
                            <Text style={styles.cgpaValue}>{academicProfile.cgpa}</Text>
                            <Text style={styles.cgpaSubLabel}>/ 10.0</Text>
                            <ProgressRing
                                progress={(academicProfile.cgpa / 10) * 100}
                                size={80}
                                strokeWidth={6}
                                color={Colors.primary}
                                label=""
                            />
                        </View>

                        <View style={styles.metricsDivider} />

                        <View style={styles.metricsList}>
                            {[
                                { label: 'SGPA', value: String(academicProfile.sgpa), color: Colors.primary },
                                { label: 'Credits', value: `${academicProfile.earnedCredits}/${academicProfile.totalCredits}`, color: Colors.success },
                                { label: 'Attendance', value: '84%', color: '#00C9B1' }, // Added overall attendance here
                                { label: 'Division', value: academicProfile.division, color: '#FFD60A' },
                            ].map((m) => (
                                <View key={m.label} style={styles.metricItem}>
                                    <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
                                    <Text style={styles.metricLabel}>{m.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>

                {/* ═══ SUBJECTS ═══ */}
                <SectionHeader title="Subjects" subtitle="Current Semester" style={{ marginTop: Spacing.xl }} />
                <View style={styles.subjectList}>
                    {subjects.map((subject) => {
                        const att = subject.attendance;
                        let ringColor = Colors.success;
                        if (att < 75) ringColor = Colors.error;
                        else if (att < 85) ringColor = Colors.warning;

                        const ring = (
                            <ProgressRing
                                progress={att}
                                size={56}
                                strokeWidth={5}
                                color={ringColor}
                                label={`${att}%`}
                            />
                        );
                        return (
                            <Card key={subject.id} style={styles.subjectCard} padding={Spacing.md} shadow="xs">
                                {/* Left veg dot replaced with colored left-border strip */}
                                <View style={[styles.subjectStrip, {
                                    backgroundColor: subject.gradePoint >= 9 ? Colors.success : subject.gradePoint >= 7 ? Colors.info : Colors.error,
                                }]} />
                                <View style={styles.subjectBody}>
                                    <View style={styles.subjectTop}>
                                        <View style={styles.subjectLeft}>
                                            <Text style={styles.subjectCode}>{subject.code}</Text>
                                            <Text style={styles.subjectName}>{subject.name}</Text>
                                            <Text style={styles.subjectProf}>{subject.professor}</Text>
                                        </View>
                                        {ring}
                                    </View>
                                    <View style={styles.subjectBottom}>
                                        <TagPill
                                            label={`${subject.grade} · ${subject.gradePoint}/10`}
                                            variant={subject.gradePoint >= 9 ? 'green' : subject.gradePoint >= 7 ? 'blue' : 'red'}
                                            size="sm"
                                        />
                                        <Text style={styles.nextClass}>Next: {subject.nextClass}</Text>
                                        {att < 75 && (
                                            <TagPill label="⚠ Low attendance" variant="red" size="sm" />
                                        )}
                                    </View>
                                </View>
                            </Card>
                        );
                    })}
                </View>

                {/* ═══ ASSIGNMENTS ═══ */}
                <SectionHeader title="Assignments" subtitle="Due this month" style={{ marginTop: Spacing.xl }} />
                <View style={styles.assignmentList}>
                    {assignments.map((a) => (
                        <Card key={a.id} style={styles.assignmentCard} padding={Spacing.md} shadow="xs">
                            <View style={[styles.assignmentStrip, {
                                backgroundColor: a.status === 'submitted' ? Colors.success : a.status === 'graded' ? Colors.info : Colors.error,
                            }]} />
                            <View style={styles.assignmentBody}>
                                <View style={styles.assignmentRow}>
                                    <View style={styles.assignmentLeft}>
                                        <Text style={styles.assignmentTitle}>{a.title}</Text>
                                        <Text style={styles.assignmentSubject}>{a.subject}</Text>
                                        <Text style={styles.assignmentDue}>Due: {a.dueDate}</Text>
                                    </View>
                                    <TagPill
                                        label={a.status === 'graded' ? `${a.marks}/${a.totalMarks}` : a.status}
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
    pageHeader: {
        paddingHorizontal: Spacing.section,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.lg,
    },
    pageTitle: { ...Typography.h1, color: Colors.text },
    pageSubtitle: { ...Typography.body2, color: Colors.textSecondary, marginTop: 4 },

    // Dark metrics card
    metricsCard: {
        backgroundColor: Colors.darkBg,
        marginHorizontal: Spacing.section,
        borderRadius: Radius.xl,
        padding: Spacing.xl,
        overflow: 'hidden',
        borderTopWidth: 1,
        borderTopColor: Colors.highlight,
    },
    metricsBgCircle: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: Colors.accentGradientStart,
        opacity: 0.07,
        top: -60,
        right: -40,
    },
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

    // Subjects
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

    // Assignments
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
