import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../src/components/ui/Card';
import SearchBar from '../src/components/ui/SearchBar';
import { teachers } from '../src/data/teachers';
import { Colors, Radius, Spacing, Typography } from '../src/theme';

function MiniContributionGraph({ data }: { data: number[] }) {
    const max = Math.max(...data, 1);
    return (
        <View style={graphStyles.container}>
            {data.map((val, i) => (
                <View
                    key={i}
                    style={[
                        graphStyles.bar,
                        { height: Math.max(3, (val / max) * 30), backgroundColor: val === max ? Colors.primary : Colors.tagBlue }
                    ]}
                />
            ))}
        </View>
    );
}

const graphStyles = StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 34 },
    bar: { width: 6, borderRadius: 2 },
});

export default function TeacherDashboard() {
    const [search, setSearch] = useState('');
    const filtered = teachers.filter(
        (t) =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.subject.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Faculty 👩‍🏫</Text>
                <View style={{ width: 22 }} />
            </View>

            <View style={styles.searchWrap}>
                <SearchBar
                    placeholder="Search teachers or subjects..."
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <FlatList
                data={filtered}
                keyExtractor={(t) => t.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item: teacher }) => (
                    <Card style={styles.card} padding={Spacing.md} shadow="sm">
                        {/* Top Row */}
                        <View style={styles.cardTop}>
                            <View style={styles.avatarWrap}>
                                <Image source={{ uri: teacher.image }} style={styles.avatar} />
                                <View style={[styles.availDot, { backgroundColor: teacher.isAvailableNow ? Colors.success : Colors.error }]} />
                            </View>
                            <View style={styles.teacherInfo}>
                                <Text style={styles.teacherName}>{teacher.name}</Text>
                                <Text style={styles.teacherSubject}>{teacher.subject}</Text>
                                <Text style={styles.teacherDept}>{teacher.department} · {teacher.experience} yrs</Text>
                            </View>
                            <View style={styles.ratingBox}>
                                <Text style={styles.ratingVal}>⭐ {teacher.rating}</Text>
                                <Text style={styles.ratingCount}>{teacher.reviewCount} reviews</Text>
                            </View>
                        </View>

                        {/* Graph */}
                        <View style={styles.graphRow}>
                            <View style={styles.graphLeft}>
                                <Text style={styles.graphLabel}>Weekly Classes (12 wk)</Text>
                                <MiniContributionGraph data={teacher.weeklyClasses} />
                            </View>
                            <View style={styles.availBadge}>
                                <Text style={[styles.availText, { color: teacher.isAvailableNow ? Colors.success : Colors.error }]}>
                                    {teacher.isAvailableNow ? '● Available' : '○ Unavailable'}
                                </Text>
                            </View>
                        </View>

                        {/* Info Row */}
                        <View style={styles.infoRow}>
                            <View style={styles.infoItem}>
                                <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                                <Text style={styles.infoText}>{teacher.officeHours}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                                <Text style={styles.infoText}>Cabin {teacher.cabin}</Text>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionsRow}>
                            <TouchableOpacity style={styles.emailBtn}>
                                <Ionicons name="mail-outline" size={14} color={Colors.primary} />
                                <Text style={styles.emailBtnText}>Email</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.reviewBtn}>
                                <Text style={styles.reviewBtnText}>Write Review</Text>
                            </TouchableOpacity>
                        </View>
                    </Card>
                )}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No teachers found 🙁</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.sectionBg },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.background,
    },
    headerTitle: { ...Typography.h3, color: Colors.text },
    searchWrap: { paddingHorizontal: Spacing.lg, paddingVertical: Spacing.sm, backgroundColor: Colors.background },
    list: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.xxl, gap: Spacing.md },
    card: {},
    cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, marginBottom: Spacing.md },
    avatarWrap: { position: 'relative' },
    avatar: { width: 52, height: 52, borderRadius: 26 },
    availDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: Colors.cardBg },
    teacherInfo: { flex: 1 },
    teacherName: { ...Typography.h5, color: Colors.text },
    teacherSubject: { ...Typography.body2, color: Colors.primary, fontWeight: '600', marginTop: 2 },
    teacherDept: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
    ratingBox: { alignItems: 'flex-end' },
    ratingVal: { ...Typography.body2, color: Colors.text, fontWeight: '700' },
    ratingCount: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
    graphRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: Spacing.sm },
    graphLeft: { flex: 1, gap: 5 },
    graphLabel: { ...Typography.caption, color: Colors.textSecondary },
    availBadge: { marginLeft: Spacing.md },
    availText: { ...Typography.caption, fontWeight: '700' },
    infoRow: { flexDirection: 'row', gap: Spacing.lg, marginBottom: Spacing.md },
    infoItem: { flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 },
    infoText: { ...Typography.caption, color: Colors.textSecondary, flex: 1 },
    actionsRow: { flexDirection: 'row', gap: Spacing.sm },
    emailBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        flex: 1,
        borderWidth: 1.5,
        borderColor: Colors.primary,
        borderRadius: Radius.sm,
        paddingVertical: Spacing.sm,
        justifyContent: 'center',
    },
    emailBtnText: { ...Typography.body2, color: Colors.primary, fontWeight: '600' },
    reviewBtn: {
        flex: 1,
        backgroundColor: Colors.primary,
        borderRadius: Radius.sm,
        paddingVertical: Spacing.sm,
        alignItems: 'center',
    },
    reviewBtnText: { ...Typography.body2, color: '#FFF', fontWeight: '700' },
    empty: { alignItems: 'center', paddingTop: 60 },
    emptyText: { ...Typography.body1, color: Colors.textSecondary },
});
