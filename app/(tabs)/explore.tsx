import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TagPill from '../../src/components/ui/TagPill';
import Card from '../../src/components/ui/Card';
import SearchBar from '../../src/components/ui/SearchBar';
import { useClubs } from '../../src/hooks/useClubs';
import { useEvents } from '../../src/hooks/useEvents';
import { useUserStore } from '../../src/store/userStore';
import { Colors, Radius, Spacing, Typography, Gradients, Palette } from '../../src/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const EVENT_CARD_WIDTH = SCREEN_WIDTH - Spacing.section * 2 - 28;
const EVENT_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';

export default function ExploreScreen() {
    const { data: clubs = [], isLoading: clubsLoading } = useClubs();
    const { data: events = [], isLoading: eventsLoading } = useEvents();
    const { followedClubs } = useUserStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const isLoading = clubsLoading || eventsLoading;

    const upcomingEvents = useMemo(() => {
        return [...events]
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 6);
    }, [events]);

    const liveCount = events.length;

    const popularClubs = clubs;
    const eventFilters = useMemo(() => {
        const cats = new Set<string>();
        events.forEach((event) => cats.add(event.category));
        return ['All', ...Array.from(cats)];
    }, [events]);

    const recommendedEvents = useMemo(() => {
        const base = [...upcomingEvents];
        const query = searchQuery.toLowerCase();
        return base.filter((event) => {
            if (activeFilter !== 'All' && event.category !== activeFilter) {
                return false;
            }
            if (searchQuery && !event.title.toLowerCase().includes(query)) {
                return false;
            }
            return true;
        });
    }, [searchQuery, activeFilter, upcomingEvents]);

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safe} edges={['top']}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator color={Colors.primary} size="large" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>What's happening,</Text>
                    <Text style={styles.nameText}>Explore Campus</Text>
                </View>
                <TouchableOpacity style={styles.bellBtn} onPress={() => router.push('/notifications')}>
                    <Ionicons name="notifications-outline" size={20} color={Colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="always"
                stickyHeaderIndices={[1]}
            >
                <View style={styles.summaryWrap}>
                    <View style={styles.summaryIconWrap}>
                        <Ionicons name="sparkles" size={14} color={Colors.accent} />
                    </View>
                    <Text style={styles.summaryText}>
                        Discover <Text style={styles.summaryHighlight}>{liveCount} live event{liveCount !== 1 ? 's' : ''}</Text> and <Text style={styles.summaryHighlight}>{clubs.length} clubs</Text> across campus today.
                    </Text>
                </View>

                <View style={styles.searchContainerSticky}>
                    <SearchBar
                        placeholder="Search events, clubs, spaces..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onClear={() => setSearchQuery('')}
                    />
                </View>

                <View style={styles.filterRow}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRowContent}>
                        {eventFilters.map((filter) => {
                            const isActive = activeFilter === filter;
                            return (
                                <TouchableOpacity
                                    key={filter}
                                    style={[
                                        styles.filterChip, 
                                        isActive ? { backgroundColor: Colors.primary, borderColor: Colors.primary } : { backgroundColor: Colors.secondary, borderColor: Colors.border }
                                    ]}
                                    onPress={() => setActiveFilter(filter)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive, !isActive && { color: Colors.mutedForeground }]}>
                                        {filter}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                <View style={styles.sectionBlock}>
                    <View style={styles.sectionHeaderWrap}>
                        <Text style={styles.sectionTitle}>Popular Clubs</Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.popularRow}
                    >
                        {popularClubs.map((club) => {
                            return (
                                <TouchableOpacity
                                    key={club.id}
                                    style={styles.popularClubCardWrap}
                                    onPress={() => router.push(`/club/${club.id}`)}
                                >
                                    <View style={[styles.popularClubCard, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
                                        <View style={styles.popularClubImageWrap}>
                                            <Image source={{ uri: club.logo }} style={styles.popularClubImage} />
                                        </View>
                                        <Text style={[styles.popularClubName, { color: Colors.foreground }]} numberOfLines={1}>
                                            {club.name}
                                        </Text>
                                        <Text style={[styles.popularClubFollowers, { color: Colors.mutedForeground }]}>{club.followers_count ?? 0} followers</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                <View style={styles.sectionBlock}>
                    <View style={styles.sectionHeaderWrap}>
                        <Text style={styles.sectionTitle}>Recommended Events</Text>
                    </View>
                    <EventCarousel events={recommendedEvents} />
                </View>

                <View style={styles.sectionBlock}>
                    <View style={styles.sectionHeaderWrap}>
                        <Text style={styles.sectionTitle}>Live & Upcoming</Text>
                    </View>
                    <View style={styles.eventList}>
                        {recommendedEvents.slice(0, 4).map((eventItem) => (
                            <EventListItem key={eventItem.id} event={eventItem} />
                        ))}
                        {!recommendedEvents.length && (
                            <Text style={styles.emptyState}>No matching events. Try another filter.</Text>
                        )}
                    </View>
                </View>
                <View style={{ height: 120 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

function EventListItem({ event }: { event: any }) {
    return (
        <TouchableOpacity
            style={styles.eventCardList}
            activeOpacity={0.85}
            onPress={() => event.id && router.push(`/event/${event.id}`)}
        >
            <View style={[styles.listIconWrap, { backgroundColor: Colors.secondary }]}>
                <Ionicons name="flash" size={18} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.eventListTitle}>{event.title}</Text>
                <Text style={styles.eventListMeta}>{event.time} · {event.venue}</Text>
            </View>
            <TagPill label={event.category} variant="grey" size="sm" />
        </TouchableOpacity>
    );
}

function EventCarousel({ events }: { events: any[] }) {
    if (!events.length) return null;

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={EVENT_CARD_WIDTH + Spacing.md}
            decelerationRate="fast"
            contentContainerStyle={styles.eventCarouselContent}
        >
            {events.map((event: any) => {
                return (
                    <TouchableOpacity
                        key={event.id}
                        style={styles.eventCardWrap}
                        onPress={() => router.push(`/event/${event.id}` as any)}
                    >
                        <View style={[styles.eventCard, { backgroundColor: Colors.card, borderColor: Colors.border }]}>
                            <Image source={{ uri: event.image || event.media_assets?.[0] || EVENT_IMAGE_FALLBACK }} style={styles.eventImage} />
                            <View style={styles.eventContent}>
                                <View style={styles.eventCardTop}>
                                    <TagPill label={event.category} variant="grey" size="sm" />
                                    <Text style={[styles.eventCardTime, { color: Colors.mutedForeground }]}>{event.time}</Text>
                                </View>
                                <Text style={[styles.eventTitle, { color: Colors.foreground }]} numberOfLines={1}>{event.title}</Text>
                                <View style={styles.eventCardFooter}>
                                    <Ionicons name="location-outline" size={12} color={Colors.mutedForeground} />
                                    <Text style={[styles.eventVenue, { color: Colors.mutedForeground }]} numberOfLines={1}>{event.venue}</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: Spacing.section, 
        paddingTop: Spacing.md, 
        paddingBottom: Spacing.md, 
        backgroundColor: Colors.background 
    },
    welcomeText: { ...Typography.caption, color: Colors.textSecondary },
    nameText: { ...Typography.h2, color: Colors.text },
    bellBtn: { 
        width: 40, 
        height: 40, 
        borderRadius: Radius.md, 
        backgroundColor: Colors.surface, 
        alignItems: 'center', 
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: Colors.divider,
    },
    summaryWrap: { 
        paddingHorizontal: Spacing.section, 
        marginBottom: Spacing.sm, 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 10 
    },
    summaryIconWrap: { 
        width: 24, 
        height: 24, 
        borderRadius: Radius.pill, 
        backgroundColor: Colors.accentLight, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    summaryText: { flex: 1, ...Typography.caption, color: Colors.textSecondary },
    summaryHighlight: { color: Colors.text, fontFamily: 'Sora_700Bold' },
    searchContainerSticky: { 
        paddingHorizontal: Spacing.section, 
        paddingVertical: Spacing.sm, 
        backgroundColor: Colors.background, 
        zIndex: 10 
    },
    scrollContent: {
        paddingBottom: 110,
    },
    filterRow: {
        marginTop: Spacing.sm,
        marginBottom: Spacing.md,
    },
    filterRowContent: {
        paddingHorizontal: Spacing.section,
        gap: Spacing.sm,
    },
    filterChip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: Radius.pill,
        borderWidth: 0.5,
        borderColor: Colors.divider,
    },
    filterChipText: {
        ...Typography.caption,
        fontFamily: 'Sora_600SemiBold',
    },
    filterChipTextActive: {
        color: Colors.textLight,
        fontFamily: 'Sora_700Bold',
    },
    sectionBlock: {
        marginTop: Spacing.lg,
    },
    sectionHeaderWrap: { paddingHorizontal: Spacing.section, marginBottom: Spacing.md },
    sectionTitle: { ...Typography.h4, color: Colors.text },
    popularRow: {
        paddingHorizontal: Spacing.section,
        gap: Spacing.md,
    },
    popularClubCardWrap: { width: 160, height: 120 },
    popularClubCard: {
        flex: 1,
        borderRadius: Radius.xl,
        padding: Spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.5,
    },
    popularClubImageWrap: {
        width: 44,
        height: 44,
        borderRadius: Radius.md,
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    popularClubImage: {
        width: 32,
        height: 32,
        borderRadius: Radius.sm,
    },
    popularClubName: {
        ...Typography.caption,
        fontFamily: 'Sora_700Bold',
        marginBottom: 2,
    },
    popularClubFollowers: {
        ...Typography.micro,
    },
    eventCarouselContent: {
        paddingHorizontal: Spacing.section,
        gap: Spacing.md,
    },
    eventCardWrap: { width: 240, height: 180 },
    eventCard: {
        flex: 1,
        borderRadius: Radius.xxl,
        overflow: 'hidden',
        borderWidth: 0.5,
    },
    eventImage: {
        width: '100%',
        height: 100,
    },
    eventContent: {
        padding: Spacing.md,
        gap: 4,
    },
    eventCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    eventCardTime: { ...Typography.micro, fontFamily: 'Sora_700Bold' },
    eventTitle: {
        ...Typography.body1,
        fontFamily: 'Sora_700Bold',
    },
    eventCardFooter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    eventVenue: {
        ...Typography.micro,
    },
    eventList: {
        paddingHorizontal: Spacing.section,
        gap: 12,
    },
    eventCardList: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: Radius.lg,
        backgroundColor: Colors.surface,
        borderWidth: 0.5,
        borderColor: Colors.divider,
    },
    listIconWrap: { 
        width: 36, 
        height: 36, 
        borderRadius: Radius.md, 
        alignItems: 'center', 
        justifyContent: 'center', 
    },
    eventListTitle: {
        ...Typography.h5,
        fontSize: 13,
        color: Colors.text,
    },
    eventListMeta: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    emptyState: {
        ...Typography.body2,
        color: Colors.textSecondary,
        textAlign: 'center',
        paddingVertical: 40,
    },
});
