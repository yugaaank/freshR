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
import TagPill from '../../src/components/ui/TagPill';
import UrgencyTag from '../../src/components/ui/UrgencyTag';
import { Event, EventCategory, events } from '../../src/data/events';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../src/theme';

type Tab = 'college' | 'city';

const CATEGORY_FILTERS: Array<{ id: string; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'Tech', label: '💻 Tech' },
    { id: 'Music', label: '🎵 Music' },
    { id: 'Sports', label: '⚽ Sports' },
    { id: 'Cultural', label: '🎭 Cultural' },
    { id: 'Workshop', label: '🔧 Workshop' },
    { id: 'Academic', label: '📚 Academic' },
];

const variantMap: Record<EventCategory, 'blue' | 'orange' | 'green' | 'purple' | 'red' | 'grey'> = {
    Tech: 'blue',
    Cultural: 'purple',
    Sports: 'green',
    Academic: 'blue',
    Music: 'orange',
    Drama: 'purple',
    Workshop: 'orange',
};

export default function EventsScreen() {
    const [tab, setTab] = useState<Tab>('college');
    const [activeFilter, setActiveFilter] = useState('all');

    const filtered = events
        .filter((e) =>
            tab === 'college' ? e.college !== 'City Event' : e.college === 'City Event'
        )
        .filter((e) => activeFilter === 'all' || e.category === activeFilter);

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Events</Text>
                <TouchableOpacity style={styles.filterBtn}>
                    <Ionicons name="options-outline" size={20} color={Colors.text} />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabRow}>
                {(['college', 'city'] as Tab[]).map((t) => (
                    <TouchableOpacity
                        key={t}
                        style={[styles.tab, tab === t && styles.tabActive]}
                        onPress={() => setTab(t)}
                    >
                        <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                            {t === 'college' ? 'My College' : 'City Events'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Category Filter Chips */}
            <FlatList
                horizontal
                data={CATEGORY_FILTERS}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[styles.filterChip, activeFilter === item.id && styles.filterChipActive]}
                        onPress={() => setActiveFilter(item.id)}
                    >
                        <Text style={[styles.filterChipText, activeFilter === item.id && styles.filterChipTextActive]}>
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                )}
            />

            {/* Events List */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => <EventCard event={item} />}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No events found 🙁</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

function EventCard({ event }: { event: Event }) {
    return (
        <TouchableOpacity
            style={[styles.card, Shadows.sm]}
            onPress={() => router.push(`/event/${event.id}` as any)}
            activeOpacity={0.92}
        >
            <Image source={{ uri: event.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
                <View style={styles.cardTop}>
                    <TagPill label={event.category} variant={variantMap[event.category] || 'blue'} size="sm" />
                    {event.seatsLeft < 20 && (
                        <UrgencyTag label={`${event.seatsLeft} left`} variant="danger" />
                    )}
                </View>
                <Text style={styles.cardTitle} numberOfLines={2}>{event.title}</Text>
                <View style={styles.cardMeta}>
                    <Ionicons name="calendar-outline" size={12} color={Colors.textSecondary} />
                    <Text style={styles.cardMetaText}>{event.date} · {event.time}</Text>
                </View>
                <View style={styles.cardMeta}>
                    <Ionicons name="location-outline" size={12} color={Colors.textSecondary} />
                    <Text style={styles.cardMetaText} numberOfLines={1}>{event.venue}</Text>
                </View>
                <View style={styles.cardFooter}>
                    <Text style={styles.cardPrice}>
                        {event.tickets[0].price === 0 ? 'Free' : `₹${event.tickets[0].price}`}
                    </Text>
                    <View style={styles.attendeesRow}>
                        <Ionicons name="people-outline" size={12} color={Colors.textSecondary} />
                        <Text style={styles.attendeesText}>{event.attendees} attending</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
    },
    headerTitle: { ...Typography.h2, color: Colors.text },
    filterBtn: {
        width: 36,
        height: 36,
        borderRadius: Radius.sm,
        backgroundColor: Colors.sectionBg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabRow: {
        flexDirection: 'row',
        marginHorizontal: Spacing.lg,
        backgroundColor: Colors.sectionBg,
        borderRadius: Radius.md,
        padding: 3,
        marginBottom: Spacing.md,
    },
    tab: {
        flex: 1,
        paddingVertical: Spacing.sm,
        alignItems: 'center',
        borderRadius: Radius.sm,
    },
    tabActive: { backgroundColor: Colors.cardBg, ...Shadows.sm },
    tabText: { ...Typography.body2, color: Colors.textSecondary, fontWeight: '600' },
    tabTextActive: { color: Colors.text },
    filterRow: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, marginBottom: Spacing.md },
    filterChip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs + 2,
        borderRadius: Radius.full,
        backgroundColor: Colors.sectionBg,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    filterChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
    filterChipText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
    filterChipTextActive: { color: Colors.primary },
    list: { paddingHorizontal: Spacing.lg, gap: Spacing.md, paddingBottom: Spacing.xxl },
    card: {
        flexDirection: 'row',
        backgroundColor: Colors.cardBg,
        borderRadius: Radius.lg,
        overflow: 'hidden',
    },
    cardImage: { width: 110, height: 130 },
    cardContent: { flex: 1, padding: Spacing.md, gap: 5 },
    cardTop: { flexDirection: 'row', gap: Spacing.xs, flexWrap: 'wrap' },
    cardTitle: { ...Typography.h5, color: Colors.text },
    cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    cardMetaText: { ...Typography.caption, color: Colors.textSecondary, flex: 1 },
    cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
    cardPrice: { ...Typography.price, color: Colors.primary, fontSize: 15 },
    attendeesRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    attendeesText: { ...Typography.caption, color: Colors.textSecondary },
    empty: { alignItems: 'center', paddingTop: 60 },
    emptyText: { ...Typography.body1, color: Colors.textSecondary },
});
