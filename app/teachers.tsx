import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
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
import { useTeachers } from '../src/hooks/useTeachers';
import Skeleton from '../src/components/ui/Skeleton';
import { Teacher } from '../src/lib/types/database.types';
import { Colors, Radius, Spacing, Typography } from '../src/theme';

function MiniContributionGraph({ data, color }: { data: number[], color: string }) {
    const max = Math.max(...data, 1);
    return (
        <View style={graphStyles.container}>
            {data.map((val, i) => (
                <View
                    key={i}
                    style={[
                        graphStyles.bar,
                        { height: Math.max(3, (val / max) * 30), backgroundColor: val === max ? color : color + '40' }
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
    const { data: teachers = [], isLoading, error } = useTeachers();

    if (error) {
        return (
            <SafeAreaView style={styles.safe} edges={['top']}>
                <View style={styles.loading}>
                    <Text style={{color: Colors.error}}>Failed to load faculty directory.</Text>
                    <TouchableOpacity onPress={() => router.back()} style={{marginTop: 10}}>
                        <Text style={{color: Colors.primary}}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const filtered = teachers.filter(
        (t: Teacher) =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.subject.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Faculty Directory</Text>
                <View style={{ width: 22 }} />
            </View>

            <View style={styles.searchWrap}>
                <SearchBar
                    placeholder="Search teachers or subjects..."
                    value={search}
                    onChangeText={setSearch}
                    onClear={() => setSearch('')}
                />
            </View>

            {isLoading ? (
                <View style={styles.list}>
                    {[1, 2, 3].map((i) => (
                        <Card key={i} style={styles.card} padding={Spacing.md}>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <Skeleton width={52} height={52} radius={26} />
                                <View style={{ flex: 1, gap: 8 }}>
                                    <Skeleton width="60%" height={18} />
                                    <Skeleton width="40%" height={14} />
                                </View>
                            </View>
                            <Skeleton width="100%" height={40} style={{ marginTop: 16 }} />
                        </Card>
                    ))}
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(t) => t.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item: teacher }) => {
                        return (
                            <Card 
                                style={[styles.card, { borderColor: Colors.border, borderWidth: 0.5 }]} 
                                padding={Spacing.md} 
                            >
                                <View style={styles.cardTop}>
                                    <View style={styles.avatarWrap}>
                                        <Image source={{ uri: teacher.image ?? undefined }} style={styles.avatar} />
                                        <View style={[styles.availDot, { backgroundColor: teacher.is_available_now ? Colors.success : Colors.error }]} />
                                    </View>
                                    <View style={styles.teacherInfo}>
                                        <Text style={styles.teacherName}>{teacher.name}</Text>
                                        <Text style={[styles.teacherSubject, { color: Colors.foreground, fontFamily: 'Sora_600SemiBold' }]}>{teacher.subject}</Text>
                                        <Text style={styles.teacherDept}>{teacher.department} · {teacher.experience} yrs</Text>
                                    </View>
                                    <View style={styles.ratingBox}>
                                        <Text style={styles.ratingVal}>⭐ {teacher.rating}</Text>
                                        <Text style={styles.ratingCount}>{teacher.review_count} reviews</Text>
                                    </View>
                                </View>

                                <View style={styles.graphRow}>
                                    <View style={styles.graphLeft}>
                                        <Text style={styles.graphLabel}>Weekly Classes (12 wk)</Text>
                                        <MiniContributionGraph data={teacher.weekly_classes ?? []} color="#26a641" />
                                    </View>
                                    <View style={styles.availBadge}>
                                        <Text style={[styles.availText, { color: teacher.is_available_now ? Colors.success : Colors.error }]}>
                                            {teacher.is_available_now ? '● Available' : '○ Busy'}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.infoRow}>
                                    <View style={styles.infoItem}>
                                        <Ionicons name="time-outline" size={14} color={Colors.mutedForeground} />
                                        <Text style={styles.infoText}>{teacher.office_hours}</Text>
                                    </View>
                                    <View style={styles.infoItem}>
                                        <Ionicons name="location-outline" size={14} color={Colors.mutedForeground} />
                                        <Text style={styles.infoText}>Cabin {teacher.cabin}</Text>
                                    </View>
                                </View>

                                <View style={styles.actionsRow}>
                                    <TouchableOpacity style={[styles.emailBtn, { borderColor: Colors.border }]}>
                                        <Ionicons name="mail-outline" size={14} color={Colors.primary} />
                                        <Text style={[styles.emailBtnText, { color: Colors.foreground }]}>Email</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.mapLinkBtn, { backgroundColor: Colors.primary }]}
                                        onPress={() => router.push({ pathname: '/campus-map', params: { highlight: teacher.department.toLowerCase().includes('cs') ? 'l7' : 'l1' } })}
                                    >
                                        <Ionicons name="map-outline" size={14} color="#FFF" />
                                        <Text style={styles.mapLinkBtnText}>Locate</Text>
                                    </TouchableOpacity>
                                </View>
                            </Card>
                        );
                    }}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Text style={styles.emptyText}>No teachers found 🙁</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
    card: {
        backgroundColor: Colors.surface,
    },
    cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, marginBottom: Spacing.md },
    avatarWrap: { position: 'relative' },
    avatar: { width: 52, height: 52, borderRadius: Radius.md },
    availDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: Colors.surface },
    teacherInfo: { flex: 1 },
    teacherName: { ...Typography.h5, color: Colors.text },
    teacherSubject: { ...Typography.body2, fontFamily: 'Sora_600SemiBold', marginTop: 2 },
    teacherDept: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
    ratingBox: { alignItems: 'flex-end' },
    ratingVal: { ...Typography.body2, color: Colors.text, fontFamily: 'Sora_700Bold' },
    ratingCount: { ...Typography.micro, color: Colors.textSecondary, marginTop: 2 },
    graphRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: Spacing.sm },
    graphLeft: { flex: 1, gap: 5 },
    graphLabel: { ...Typography.micro, color: Colors.textSecondary },
    availBadge: { marginLeft: Spacing.md },
    availText: { ...Typography.micro, fontFamily: 'Sora_700Bold' },
    infoRow: { flexDirection: 'row', gap: Spacing.lg, marginBottom: Spacing.md },
    infoItem: { flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 },
    infoText: { ...Typography.caption, color: Colors.textSecondary, flex: 1 },
    actionsRow: { flexDirection: 'row', gap: Spacing.sm },
    emailBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5,
        borderWidth: 0.5, 
        borderRadius: Radius.md, paddingVertical: Spacing.sm, justifyContent: 'center',
    },
    emailBtnText: { ...Typography.micro, fontFamily: 'Sora_600SemiBold' },
    mapLinkBtn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5,
        borderRadius: Radius.md, paddingVertical: Spacing.sm, justifyContent: 'center',
    },
    mapLinkBtnText: { ...Typography.micro, color: '#FFF', fontFamily: 'Sora_700Bold' },
    empty: { alignItems: 'center', paddingTop: 60 },
    emptyText: { ...Typography.body1, color: Colors.textSecondary },
});
