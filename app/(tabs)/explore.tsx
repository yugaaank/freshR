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
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    FadeInDown,
    Layout,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import SectionHeader from '../../src/components/ui/SectionHeader';
import TagPill from '../../src/components/ui/TagPill';
import Card from '../../src/components/ui/Card';
import { useHybridStore } from '../../src/store/hybridStore';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../src/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const EVENT_CARD_WIDTH = SCREEN_WIDTH - Spacing.section * 2 - 28;
const EVENT_IMAGE_FALLBACK = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';
const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedLayout = Animated.createAnimatedComponent(View);
const AnimatedContent = Animated.createAnimatedComponent(View);

function SpringCard({ children, style, onPress, delay = 0 }: any) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <AnimatedLayout layout={Layout.springify()} entering={FadeInDown.delay(delay).springify().damping(14)} style={style}>
            <AnimatedPressable
                activeOpacity={0.85}
                onPressIn={() => {
                    scale.value = withSpring(0.96, { damping: 12, stiffness: 250 });
                    opacity.value = withSpring(0.95, { damping: 12, stiffness: 250 });
                }}
                onPressOut={() => {
                    scale.value = withSpring(1, { damping: 14, stiffness: 230 });
                    opacity.value = withSpring(1, { damping: 14, stiffness: 230 });
                }}
                onPress={onPress}
                style={{ flex: 1 }}
            >
                <AnimatedContent style={[{ flex: 1 }, animatedStyle]}>{children}</AnimatedContent>
            </AnimatedPressable>
        </AnimatedLayout>
    );
}

export default function ExploreScreen() {
    const { clubs, events, user } = useHybridStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const upcomingEvents = useMemo(
        () =>
            [...events]
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 6),
        [events]
    );

    const heroStats = useMemo(
        () => [
            { label: 'Clubs followed', value: user.followedClubs.length },
            { label: 'Live events', value: events.length },
            { label: 'Upcoming', value: Math.max(0, events.length) },
        ],
        [events.length, user.followedClubs.length]
    );

    const popularClubs = clubs.slice(0, 4);
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

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar barStyle="dark-content" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.heroWrapper}>
                    <Card padding={0} radius={Radius.xxl} style={styles.heroCard} shadow="lg">
                        <LinearGradient colors={['#F4FFF9', '#E0F7EB']} style={styles.heroGradient}>
                            <View style={styles.heroTopRow}>
                                <TouchableOpacity style={styles.heroBack}>
                                    <Ionicons name="arrow-back" size={20} color={Colors.success} />
                                </TouchableOpacity>
                                <View style={styles.heroIconsRight}>
                                    <TouchableOpacity style={styles.heroIconButton}>
                                        <Ionicons name="heart-outline" size={18} color={Colors.textLight} />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.heroIconButton}>
                                        <Ionicons name="ellipsis-horizontal" size={18} color={Colors.textLight} />
                                    </TouchableOpacity>
                                    <View style={styles.heroAvatarWrap}>
                                        <Image
                                            source={{ uri: 'https://i.pravatar.cc/150?img=58' }}
                                            style={styles.heroAvatar}
                                        />
                                    </View>
                                </View>
                            </View>
                            <Text style={styles.heroTitle}>Discover Campus</Text>
                            <Text style={styles.heroSubtitle}>
                                Clubs, live events, and curated spaces wrapped in a fresh, light green shell.
                            </Text>
                            <View style={styles.heroSearchRow}>
                                <Ionicons name="search" size={18} color={Colors.success} />
                                <TextInput
                                    style={styles.searchInput}
                                    placeholder="Search events, clubs, spaces"
                                    placeholderTextColor="rgba(15,27,21,0.45)"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                                <TouchableOpacity>
                                    <Ionicons name="options-outline" size={18} color={Colors.success} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.heroStatsRow}>
                                {heroStats.map((stat) => (
                                    <View key={stat.label} style={styles.heroStat}>
                                        <Text style={styles.heroStatValue}>{stat.value}</Text>
                                        <Text style={styles.heroStatLabel}>{stat.label}</Text>
                                    </View>
                                ))}
                            </View>
                        </LinearGradient>
                    </Card>
                </View>
                <View style={styles.filterRow}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRowContent}>
                        {eventFilters.map((filter) => {
                            const isActive = activeFilter === filter;
                            return (
                                <TouchableOpacity
                                    key={filter}
                                    style={[styles.filterChip, isActive && styles.filterChipActive]}
                                    onPress={() => setActiveFilter(filter)}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                                        {filter}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>
                <View style={styles.sectionBlock}>
                    <SectionHeader title="Popular" subtitle="Clubs" />
                    <Card padding={0} style={styles.popularCard} shadow="sm">
                        <View style={styles.popularCardContent}>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={styles.popularRow}
                            >
                                {popularClubs.map((club) => (
                                    <TouchableOpacity
                                        key={club.id}
                                        style={styles.popularClubCard}
                                        activeOpacity={0.85}
                                        onPress={() => router.push(`/club/${club.id}`)}
                                    >
                                        <View style={styles.popularClubImageWrap}>
                                            <Image source={{ uri: club.logo }} style={styles.popularClubImage} />
                                        </View>
                                        <Text style={styles.popularClubName} numberOfLines={1}>
                                            {club.name}
                                        </Text>
                                        <View style={styles.popularClubMeta}>
                                            <Text style={styles.popularClubTag}>{club.tag ?? club.vibeTag ?? 'Community'}</Text>
                                            <Text style={styles.popularClubFollowers}>{club.followersCount ?? 0} followers</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </Card>
                </View>
                <View style={styles.sectionBlock}>
                    <SectionHeader title="Recommended" subtitle="Live events" />
                    <Card padding={0} style={styles.recommendedCard} shadow="sm">
                        <View style={styles.recommendedCardContent}>
                            <EventCarousel
                                events={recommendedEvents}
                                containerStyle={styles.cardCarouselContent}
                                compact
                            />
                        </View>
                    </Card>
                </View>
                <View style={styles.sectionBlock}>
                    <SectionHeader title="Live & upcoming" subtitle="Swipe to preview" />
                    <Card padding={0} style={styles.recommendedCard} shadow="sm">
                        <View style={styles.recommendedCardContent}>
                            <EventCarousel events={recommendedEvents} containerStyle={styles.cardCarouselContent} compact />
                        </View>
                    </Card>
                    <View style={styles.eventList}>
                        {recommendedEvents.slice(0, 4).map((eventItem) => (
                            <EventListItem key={eventItem.id} event={eventItem} />
                        ))}
                        {!recommendedEvents.length && (
                            <Text style={styles.emptyState}>No matching events. Try another filter.</Text>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function EventListItem({ event }: { event: any }) {
    const catColor = Colors.accent;
    return (
        <TouchableOpacity
            style={styles.eventCardList}
            activeOpacity={0.85}
            onPress={() => event.id && router.push(`/event/${event.id}`)}
        >
            <View style={styles.eventCardListContent}>
                <View>
                    <Text style={styles.eventListTitle}>{event.title}</Text>
                    <Text style={styles.eventListMeta}>{event.time} · {event.location}</Text>
                </View>
                <TagPill label={event.category} variant="green" size="sm" />
            </View>
        </TouchableOpacity>
    );
}

function EventCarousel({ events, containerStyle, compact }: { events: any[]; containerStyle?: object; compact?: boolean }) {
    if (!events.length) {
        return null;
    }

    return (
        <View style={styles.eventCarousel}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={EVENT_CARD_WIDTH + Spacing.md}
                decelerationRate="fast"
                contentContainerStyle={[styles.eventCarouselContent, containerStyle]}
            >
                {events.map((event: any, index: number) => (
                        <SpringCard
                            key={event.id}
                            delay={index * 30}
                            style={[
                                styles.eventCard,
                                compact && styles.cardEventCard,
                                { marginRight: index === events.length - 1 ? 0 : Spacing.md },
                            ]}
                        onPress={() => router.push(`/event/${event.id}` as any)}
                    >
                        <Image source={{ uri: event.image || EVENT_IMAGE_FALLBACK }} style={styles.eventImage} />
                        <LinearGradient colors={['rgba(7,27,14,0.8)', 'transparent']} style={styles.eventGradient} />
                        <View style={styles.eventContent}>
                            <TagPill label={event.category} variant="green" size="sm" />
                            <Text style={styles.eventTitle}>{event.title}</Text>
                            <Text style={styles.eventMeta}>
                                {new Date(event.date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric',
                                })}{' '}
                                · {event.time}
                            </Text>
                            <Text style={styles.eventVenue}>{event.location || event.venue}</Text>
                        </View>
                    </SpringCard>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    scrollContent: {
        paddingBottom: Spacing.xxxl,
        paddingTop: Spacing.md,
        backgroundColor: Colors.background,
    },
    filterRow: {
        paddingHorizontal: Spacing.section,
        marginBottom: Spacing.sm,
    },
    filterRowContent: {
        paddingVertical: Spacing.xs,
    },
    filterChip: {
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.lg,
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor: Colors.divider,
        marginRight: Spacing.sm,
    },
    filterChipActive: {
        backgroundColor: Colors.success,
        borderColor: Colors.success,
    },
    filterChipText: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    filterChipTextActive: {
        color: '#fff',
        fontWeight: '600' as const,
    },
    heroWrapper: {
        paddingHorizontal: Spacing.section,
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.md,
    },
    heroCard: {
        borderRadius: Radius.xxl,
        overflow: 'hidden',
    },
    heroGradient: {
        padding: Spacing.lg,
        minHeight: 260,
        borderRadius: Radius.xxl,
        justifyContent: 'space-between',
        backgroundColor: Colors.surface,
    },
    heroTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    heroBack: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: 'rgba(10, 30, 18, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(15,27,21,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroIconsRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    heroIconButton: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: 'rgba(10, 30, 18, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(15,27,21,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroAvatarWrap: {
        width: 38,
        height: 38,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.18)',
        overflow: 'hidden',
    },
    heroAvatar: {
        width: '100%',
        height: '100%',
    },
    heroTitle: {
        ...Typography.h2,
        color: Colors.text,
        marginTop: Spacing.md,
    },
    heroSubtitle: {
        ...Typography.body2,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
        lineHeight: 20,
    },
    heroSearchRow: {
        marginTop: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.background,
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor: Colors.divider,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    searchInput: {
        flex: 1,
        ...Typography.body1,
        color: Colors.text,
        padding: 0,
    },
    heroStatsRow: {
        marginTop: Spacing.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    heroStat: {
        alignItems: 'flex-start',
    },
    heroStatValue: {
        ...Typography.h4,
        color: Colors.text,
        fontSize: 18,
    },
    heroStatLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    sectionBlock: {
        marginTop: Spacing.xl,
    },
    popularCard: {
        marginHorizontal: Spacing.section,
        borderRadius: Radius.xxl,
    },
    popularCardContent: {
        paddingTop: Spacing.sm,
        paddingBottom: Spacing.sm,
    },
    popularRow: {
        paddingLeft: Spacing.md,
        paddingRight: Spacing.section,
        flexDirection: 'row',
    },
    popularClubCard: {
        width: 200,
        borderRadius: Radius.xxl,
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        marginRight: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.divider,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 3,
    },
    popularClubImageWrap: {
        width: 52,
        height: 52,
        borderRadius: Radius.xl,
        marginBottom: Spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.background,
    },
    popularClubImage: {
        width: 48,
        height: 48,
        borderRadius: Radius.md,
        resizeMode: 'cover',
    },
    popularClubName: {
        ...Typography.body1,
        color: Colors.text,
        fontWeight: '600' as const,
        marginBottom: Spacing.xs,
    },
    popularClubMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    popularClubTag: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    popularClubFollowers: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    recommendedCard: {
        marginHorizontal: Spacing.section,
        borderRadius: Radius.xxl,
        marginTop: Spacing.md,
    },
    recommendedCardContent: {
        paddingBottom: Spacing.md,
    },
    cardCarouselContent: {
        paddingHorizontal: Spacing.md,
        alignItems: 'center',
    },
    eventCarousel: {
        marginTop: Spacing.sm,
    },
    eventCarouselContent: {
        paddingHorizontal: Spacing.md,
    },
    eventList: {
        paddingHorizontal: Spacing.section,
        marginTop: Spacing.md,
    },
    eventCardList: {
        marginBottom: Spacing.sm,
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor: Colors.divider,
        padding: Spacing.sm,
        backgroundColor: Colors.surface,
    },
    eventCardListContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    eventListTitle: {
        ...Typography.body1,
        color: Colors.text,
        fontWeight: '600' as const,
    },
    eventListMeta: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    emptyState: {
        ...Typography.body2,
        color: Colors.textSecondary,
        marginTop: Spacing.sm,
        textAlign: 'center',
    },
    eventCard: {
        width: EVENT_CARD_WIDTH,
        borderRadius: Radius.xxl,
        overflow: 'hidden',
        ...Shadows.md,
        backgroundColor: '#F8FAF7',
    },
    cardEventCard: {
        width: EVENT_CARD_WIDTH - 30,
    },
    eventImage: {
        width: '100%',
        height: 220,
    },
    eventGradient: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    eventContent: {
        position: 'absolute',
        bottom: Spacing.md,
        left: Spacing.md,
        right: Spacing.md,
        gap: Spacing.xs,
    },
    eventTitle: {
        ...Typography.h3,
        color: Colors.textLight,
        lineHeight: 24,
    },
    eventMeta: {
        ...Typography.caption,
        color: Colors.textDimmed,
    },
    eventVenue: {
        ...Typography.body2,
        color: Colors.textLight,
        fontWeight: '700' as const,
    },
});
