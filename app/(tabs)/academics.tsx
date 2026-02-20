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
                {/* Header */}
                <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>Academics 📚</Text>
                    <Text style={styles.pageSubtitle}>
                        {academicProfile.branch} · Sem {academicProfile.semester} · {academicProfile.year}rd Year
                    </Text>
                </View>

                {/* CGPA + Metrics Row */}
                <View style={[styles.metricsCard, Shadows.md]}>
                    <View style={styles.cgpaArea}>
                        <ProgressRing
                            progress={(academicProfile.cgpa / 10) * 100}
                            size={96}
                            strokeWidth={9}
                            color={Colors.primary}
                            label={String(academicProfile.cgpa)}
                            sublabel="CGPA"
                        />
                    </View>
                    <View style={styles.metricsList}>
                        {[
                            { label: 'SGPA', value: String(academicProfile.sgpa), color: Colors.info },
                            { label: 'Credits Earned', value: `${academicProfile.earnedCredits}/${academicProfile.totalCredits}`, color: Colors.success },
                            { label: 'Division', value: academicProfile.division, color: Colors.primary },
                            { label: 'Roll No', value: academicProfile.rollNo, color: Colors.text },
                        ].map((m) => (
                            <View key={m.label} style={styles.metricItem}>
                                <Text style={[styles.metricValue, { color: m.color }]}>{m.value}</Text>
                                <Text style={styles.metricLabel}>{m.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Subjects */}
                <SectionHeader title="Subjects" subtitle="Current Semester" style={{ marginTop: Spacing.lg }} />
                <View style={styles.subjectList}>
                    {subjects.map((subject) => {
                        const lowAttendance = subject.attendance < 75;
                        return (
                            <Card key={subject.id} style={styles.subjectCard} padding={Spacing.md} shadow="sm">
                                <View style={styles.subjectTop}>
                                    <View style={styles.subjectLeft}>
                                        <Text style={styles.subjectCode}>{subject.code}</Text>
                                        <Text style={styles.subjectName}>{subject.name}</Text>
                                        <Text style={styles.subjectProf}>{subject.professor}</Text>
                                    </View>
                                    <View style={styles.subjectRight}>
                                        <ProgressRing
                                            progress={subject.attendance}
                                            size={52}
                                            strokeWidth={5}
                                            color={lowAttendance ? Colors.error : Colors.success}
                                            label={`${subject.attendance}%`}
                                        />
                                    </View>
                                </View>
                                <View style={styles.subjectBottom}>
                                    <View style={styles.gradeRow}>
                                        <Text style={styles.gradeLabel}>Grade</Text>
                                        <Text style={[styles.gradeValue, { color: subject.gradePoint >= 9 ? Colors.success : subject.gradePoint >= 7 ? Colors.primary : Colors.error }]}>
                                            {subject.grade} · {subject.gradePoint}/10
                                        </Text>
                                    </View>
                                    <View style={styles.nextClassRow}>
                                        <Text style={styles.nextClassLabel}>Next class</Text>
                                        <Text style={styles.nextClassValue}>{subject.nextClass}</Text>
                                    </View>
                                    {lowAttendance && (
                                        <TagPill label="⚠️ Low attendance" variant="red" size="sm" style={{ marginTop: Spacing.xs }} />
                                    )}
                                </View>
                            </Card>
                        );
                    })}
                </View>

                {/* Assignments */}
                <SectionHeader title="Assignments" subtitle="Due this month" style={{ marginTop: Spacing.lg }} />
                <View style={styles.assignmentList}>
                    {assignments.map((a) => (
                        <Card key={a.id} style={styles.assignmentCard} padding={Spacing.md} shadow="sm">
                            <View style={styles.assignmentRow}>
                                <View style={styles.assignmentLeft}>
                                    <Text style={styles.assignmentTitle}>{a.title}</Text>
                                    <Text style={styles.assignmentSubject}>{a.subject}</Text>
                                    <Text style={styles.assignmentDue}>Due: {a.dueDate}</Text>
                                </View>
                                <View style={styles.assignmentStatus}>
                                    <TagPill
                                        label={a.status === 'graded' ? `${a.marks}/${a.totalMarks}` : a.status}
                                        variant={a.status === 'submitted' ? 'blue' : a.status === 'graded' ? 'green' : 'red'}
                                        size="sm"
                                    />
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
    pageHeader: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.lg, backgroundColor: Colors.background },
    pageTitle: { ...Typography.h2, color: Colors.text },
    pageSubtitle: { ...Typography.body2, color: Colors.textSecondary, marginTop: 3 },
    metricsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.cardBg,
        marginHorizontal: Spacing.lg,
        borderRadius: Radius.xl,
        padding: Spacing.xl,
        marginBottom: Spacing.sm,
    },
    cgpaArea: { marginRight: Spacing.xl },
    metricsList: { flex: 1, flexWrap: 'wrap', flexDirection: 'row', gap: Spacing.md },
    metricItem: { width: '45%' },
    metricValue: { ...Typography.h4, fontWeight: '700' },
    metricLabel: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
    subjectList: { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
    subjectCard: {},
    subjectTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
    subjectLeft: { flex: 1 },
    subjectCode: { ...Typography.label, color: Colors.primary, marginBottom: 3 },
    subjectName: { ...Typography.h5, color: Colors.text },
    subjectProf: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
    subjectRight: { marginLeft: Spacing.md },
    subjectBottom: { marginTop: Spacing.sm, gap: 3 },
    gradeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    gradeLabel: { ...Typography.caption, color: Colors.textSecondary },
    gradeValue: { ...Typography.body2, fontWeight: '700' },
    nextClassRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    nextClassLabel: { ...Typography.caption, color: Colors.textSecondary },
    nextClassValue: { ...Typography.caption, color: Colors.text, fontWeight: '500' },
    assignmentList: { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
    assignmentCard: {},
    assignmentRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
    assignmentLeft: { flex: 1 },
    assignmentTitle: { ...Typography.h5, color: Colors.text },
    assignmentSubject: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
    assignmentDue: { ...Typography.caption, color: Colors.primary, marginTop: 3, fontWeight: '600' },
    assignmentStatus: { marginLeft: Spacing.md, marginTop: 2 },
});
