import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../src/components/ui/Card';
import SectionHeader from '../../src/components/ui/SectionHeader';
import TagPill from '../../src/components/ui/TagPill';
import { useHybridStore } from '../../src/store/hybridStore';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../src/theme';

const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);

function SpringCard({ children, style, onPress, delay = 0, entering, ...props }: any) {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
    return (
        <AnimatedPressable
            activeOpacity={0.9}
            onPressIn={() => {
                scale.value = withSpring(0.96, { damping: 15, stiffness: 200 });
            }}
            onPressOut={() => {
                scale.value = withSpring(1, { damping: 15, stiffness: 200 });
            }}
            onPress={onPress}
            style={[style, animatedStyle]}
            entering={entering ? entering.delay(delay).springify() : FadeInDown.delay(delay).springify()}
            {...props}
        >
            {children}
        </AnimatedPressable>
    );
}

type FilterType = 'all' | 'clubs' | 'depts' | 'public';

export default function ExploreScreen() {
    const { filter: initialFilter } = useLocalSearchParams<{ filter?: string }>();
    const { clubs, events, user } = useHybridStore();
    const [activeFilter, setActiveFilter] = useState<FilterType>((initialFilter as FilterType) || 'all');

    const heroStats = useMemo(
        () => [
            { label: 'Clubs followed', value: user.followedClubs.length },
            { label: 'Live events', value: events.length },
            { label: 'Active streak', value: '14 days' },
        ],
        [user.followedClubs.length, events.length]
    );

    const chips: { id: FilterType; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'clubs', label: 'Clubs' },
        { id: 'depts', label: 'Departments' },
        { id: 'public', label: 'Public' },
    ];

    const getClubLabel = (vibe: string) => (vibe.toLowerCase().includes('tech') ? 'Department' : 'Club');
    const featuredClubs = clubs.slice(0, 3);
    const spotlightEvent = events.find((ev) => ev.isFeatured) ?? events[0];

    const filteredEvents = useMemo(() => {
        if (activeFilter === 'public') {
            return events.filter(
                (ev) =>
                    ev.host?.toLowerCase().includes('hackmit') ||
                    ev.host?.toLowerCase().includes('university')
            );
        }
        const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return activeFilter === 'clubs' || activeFilter === 'depts' ? [] : sorted;
    }, [activeFilter, events]);

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar barStyle="light-content" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentEnhanced}>
                <View style={styles.heroWrapper}>
                    <LinearGradient colors={['#0A0C24', '#120A3E']} style={styles.heroBackground}>
                        <Text style={styles.heroTitle}>Explore Campus</Text>
                        <Text style={styles.heroSubtitle}>Clubs, spaces, and events curated for your vibe.</Text>
                        <View style={styles.heroStats}>
                            {heroStats.map((stat) => (
                                <View key={stat.label} style={styles.heroStat}>
                                    <Text style={styles.heroStatValue}>{stat.value}</Text>
                                    <Text style={styles.heroStatLabel}>{stat.label}</Text>
                                </View>
                            ))}
                        </View>
                    </LinearGradient>
                </View>

                <View style={styles.chipsWrap}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
                        {chips.map((chip) => (
                            <TouchableOpacity
                                key={chip.id}
                                style={[styles.chip, activeFilter === chip.id && styles.chipActive]}
                                onPress={() => setActiveFilter(chip.id)}
                            >
                                <Text style={[styles.chipText, activeFilter === chip.id && styles.chipTextActive]}>
                                    {chip.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <SectionHeader title="Featured clubs" subtitle="Stay connected with your favorites" />
                <View style={styles.clubRow}>
                    {featuredClubs.map((club, idx) => (
                        <SpringCard
                            key={club.id}
                            delay={idx * 40}
                            style={styles.clubCard}
                            onPress={() => router.push(`/club/${club.id}` as any)}
                        >
                            <Image source={{ uri: club.banner }} style={styles.clubImage} />
                            <LinearGradient colors={['rgba(0,0,0,0.55)', 'transparent']} style={styles.clubGradient} />
                            <View style={styles.clubInfo}>
                                <Text style={styles.clubName}>{club.name}</Text>
                                <Text style={styles.clubTag}>{getClubLabel(club.vibeTag)}</Text>
                                <Text style={styles.clubFollowers}>{club.followersCount} followers</Text>
                            </View>
                        </SpringCard>
                    ))}
                </View>

                <SectionHeader title="Spotlight event" subtitle="Trending right now" />
                <SpringCard
                    style={styles.spotlightCard}
                    onPress={() => router.push(`/event/${spotlightEvent.id}` as any)}
                >
                    <LinearGradient colors={['#4C46D6', '#6C63FF']} style={styles.spotlightGradient}>
                        <Text style={styles.spotlightLabel}>Today</Text>
                        <Text style={styles.spotlightTitle}>{spotlightEvent.title}</Text>
                        <View style={styles.spotlightMetaRow}>
                            <Text style={styles.spotlightMetaText}>
                                {spotlightEvent.date} · {spotlightEvent.time}
                            </Text>
                            <TagPill label={spotlightEvent.category} variant="blue" size="sm" />
                        </View>
                    </LinearGradient>
                </SpringCard>

                <SectionHeader title="Popular events" subtitle="Curated with community energy" />
                <View style={styles.eventList}>
                    {filteredEvents.slice(0, 5).map((item, index) => {
                        const seatsLeft = item.totalSeats - item.registeredCount;
                        return (
                            <SpringCard
                                key={item.id}
                                delay={index * 40}
                                style={styles.eventListCard}
                                onPress={() => router.push(`/event/${item.id}` as any)}
                            >
                                <Image source={{ uri: item.image }} style={styles.eventImage} />
                                <LinearGradient colors={['rgba(0,0,0,0.45)', 'transparent']} style={styles.eventGradient} />
                                <View style={styles.eventListContent}>
                                    <View style={styles.eventTagRow}>
                                        <TagPill label={item.category} variant="dark" size="sm" />
                                        <Text style={styles.eventTagText}>{seatsLeft <= 15 ? 'Hot' : 'Open'}</Text>
                                    </View>
                                    <Text style={styles.eventName}>{item.title}</Text>
                                    <Text style={styles.eventDetails}>
                                        {new Date(item.date).toLocaleString('default', { month: 'short', day: 'numeric' })} · {item.time}
                                    </Text>
                                    <View style={styles.eventFooter}>
                                        <Text style={styles.eventSeats}>{seatsLeft} seats left</Text>
                                        <Text style={styles.eventVenue}>{item.location}</Text>
                                    </View>
                                </View>
                            </SpringCard>
                        );
                    })}
                    <View style={{ height: Spacing.xxl }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    heroWrapper: {
        paddingHorizontal: Spacing.section,
        paddingTop: Spacing.sm,
    },
    heroBackground: {
        borderRadius: Radius.xxl,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        minHeight: 200,
        justifyContent: 'space-between',
    },
    heroTitle: {
        ...Typography.h1,
        color: '#FFF',
        marginBottom: Spacing.sm,
    },
    heroSubtitle: {
        ...Typography.body2,
        color: 'rgba(255,255,255,0.75)',
        marginBottom: Spacing.md,
    },
    heroStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: Spacing.md,
    },
    heroStat: {
        flex: 1,
    },
    heroStatValue: {
        ...Typography.h4,
        color: '#FFF',
    },
    heroStatLabel: {
        ...Typography.caption,
        color: 'rgba(255,255,255,0.7)',
    },
    chipsWrap: {
        paddingVertical: Spacing.sm,
        paddingLeft: 0,
    },
    chipsRow: {
        paddingHorizontal: Spacing.section,
        gap: Spacing.sm,
    },
    chip: {
        backgroundColor: Colors.surface,
        borderRadius: Radius.xxl,
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    chipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    chipText: {
        ...Typography.body2,
        color: Colors.text,
    },
    chipTextActive: {
        color: '#FFF',
        fontWeight: '700' as const,
    },
    scrollContentEnhanced: {
        paddingHorizontal: Spacing.section,
        paddingBottom: Spacing.xl,
    },
    clubRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    clubCard: {
        flex: 1,
        minHeight: 160,
        borderRadius: Radius.xl,
        overflow: 'hidden',
    },
    clubImage: {
        ...StyleSheet.absoluteFillObject,
    },
    clubGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    clubInfo: {
        position: 'absolute',
        bottom: Spacing.md,
        left: Spacing.md,
        right: Spacing.md,
    },
    clubName: {
        ...Typography.h4,
        color: '#FFF',
    },
    clubTag: {
        ...Typography.caption,
        color: 'rgba(255,255,255,0.8)',
    },
    clubFollowers: {
        ...Typography.caption,
        color: '#FFF',
        marginTop: Spacing.xs,
    },
    spotlightCard: {
        borderRadius: Radius.xxl,
        overflow: 'hidden',
        marginBottom: Spacing.lg,
    },
    spotlightGradient: {
        padding: Spacing.lg,
        minHeight: 150,
        justifyContent: 'space-between',
    },
    spotlightLabel: {
        ...Typography.micro,
        color: 'rgba(255,255,255,0.8)',
        letterSpacing: 1.1,
    },
    spotlightTitle: {
        ...Typography.h3,
        color: '#FFF',
        marginTop: Spacing.xs,
    },
    spotlightMetaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Spacing.sm,
    },
    spotlightMetaText: {
        ...Typography.body2,
        color: 'rgba(255,255,255,0.8)',
    },
    eventList: {
        flexDirection: 'column',
        gap: Spacing.md,
    },
    eventListCard: {
        borderRadius: Radius.xl,
        overflow: 'hidden',
        minHeight: 190,
    },
    eventImage: {
        width: '100%',
        height: 140,
    },
    eventGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    eventListContent: {
        padding: Spacing.md,
        gap: Spacing.xs,
        minHeight: 120,
        justifyContent: 'space-between',
        backgroundColor: Colors.cardBg,
    },
    eventTagRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    eventTagText: {
        ...Typography.caption,
        color: Colors.primary,
        fontWeight: '700' as const,
    },
    eventName: {
        ...Typography.h4,
        color: Colors.text,
        marginTop: Spacing.sm,
        lineHeight: 20,
    },
    eventDetails: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
    },
    eventFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: Spacing.sm,
    },
    eventSeats: {
        ...Typography.h5,
        color: Colors.primary,
    },
    eventVenue: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
});
