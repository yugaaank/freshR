import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../src/components/ui/Card';
import TagPill from '../../src/components/ui/TagPill';
import { useHybridStore } from '../../src/store/hybridStore';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../src/theme';

const AnimatedPressable = Animated.createAnimatedComponent(TouchableOpacity);

const CATEGORY_COLORS: Record<string, string> = {
    Tech: '#007AFF', Music: '#FF2D55', Sports: '#34C759',
    Cultural: '#AF52DE', Workshop: '#FF9500', Academic: '#5856D6', All: '#6B6B6B',
};

const CAT_ICONS: Record<string, any> = {
    Tech: 'laptop-outline', Music: 'musical-notes-outline', Sports: 'football-outline',
    Cultural: 'color-palette-outline', Workshop: 'hammer-outline', Academic: 'book-outline', All: 'ticket-outline',
};

function SpringCard({ children, style, onPress, delay = 0, entering, ...props }: any) {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    return (
        <AnimatedPressable
            activeOpacity={0.9}
            onPressIn={() => { scale.value = withSpring(0.96, { damping: 15, stiffness: 200 }); }}
            onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 200 }); }}
            onPress={onPress}
            style={[style, animatedStyle]}
            entering={entering ? entering.delay(delay).springify() : FadeInDown.delay(delay).springify()}
            {...props}
        >
            {children}
        </AnimatedPressable>
    );
}

export default function ExploreScreen() {
    const { filter: initialFilter } = useLocalSearchParams<{ filter?: string }>();
    const { clubs, events, user } = useHybridStore();

    // Type definitions for the selected tab
    type FilterType = 'all' | 'clubs' | 'depts' | 'public';
    const [activeFilter, setActiveFilter] = useState<FilterType>((initialFilter as FilterType) || 'all');

    // Make sure to sync with initial filter if routed here
    useEffect(() => {
        if (initialFilter) setActiveFilter(initialFilter as FilterType);
    }, [initialFilter]);

    const getTypeLabel = (vibe: string) => {
        if (vibe.toLowerCase().includes('tech')) return 'Department';
        return 'Club';
    };

    const chips: { id: FilterType; label: string }[] = [
        { id: 'all', label: 'All Events' },
        { id: 'clubs', label: 'Clubs' },
        { id: 'depts', label: 'Departments' },
        { id: 'public', label: 'Public Events' },
    ];

    const renderClubRow = ({ item, index }: { item: typeof clubs[0], index: number }) => {
        return (
            <SpringCard
                delay={index * 50}
                onPress={() => router.push(`/club/${item.id}` as any)}
                style={styles.clubCardContainer}
            >
                <ImageBackground
                    source={{ uri: item.banner }}
                    style={styles.clubCardBanner}
                    imageStyle={{ borderRadius: Radius.lg }}
                >
                    <LinearGradient
                        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.85)']}
                        style={styles.clubCardGradient}
                    >
                        <Image source={{ uri: item.logo }} style={styles.clubCardLogo} />
                        <View style={styles.clubCardContent}>
                            <Text style={styles.clubCardTitle} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.clubCardSubtitle} numberOfLines={1}>
                                {getTypeLabel(item.vibeTag)}
                            </Text>
                            <Text style={styles.clubCardFollowers} numberOfLines={1}>
                                {item.followersCount} Followers
                            </Text>
                        </View>
                    </LinearGradient>
                </ImageBackground>
            </SpringCard>
        );
    };

    const renderEventRow = ({ item, index }: { item: typeof events[0], index: number }) => {
        const isRegistered = user.registeredEvents.includes(item.id);
        const seatsLeft = item.totalSeats - item.registeredCount;
        const categoryBg: Record<string, string> = {
            Tech: '#0A2540', Music: '#2D0A1A', Sports: '#0A2D14',
            Cultural: '#1A0A2D', Workshop: '#2D1A0A', Academic: '#0A0A2D', Competitive: '#2A0A0A',
        };
        const bgColor = categoryBg[item.category] ?? '#1A1A2E';

        return (
            <SpringCard
                delay={index * 50}
                onPress={() => router.push(`/event/${item.id}` as any)}
                style={{ marginBottom: Spacing.lg }}
            >
                <Card style={StyleSheet.flatten([styles.eventRow, { borderLeftWidth: 4, borderLeftColor: CATEGORY_COLORS[item.category] || Colors.primary }])} padding={0} shadow="sm">
                    {/* Left image block */}
                    <LinearGradient
                        colors={[bgColor, '#000000']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.eventRowImage}
                    >
                        <Ionicons name={CAT_ICONS[item.category] || 'ticket-outline'} size={32} color="rgba(255,255,255,0.9)" />
                    </LinearGradient>
                    {/* Content */}
                    <View style={styles.eventRowContent}>
                        <View style={styles.eventRowTop}>
                            <TagPill label={item.category} variant="blue" size="sm" />
                            {seatsLeft < 30 && (
                                <Text style={styles.seatsLeft}>⚡ {seatsLeft} left</Text>
                            )}
                        </View>
                        <Text style={styles.eventRowTitle} numberOfLines={2}>{item.title}</Text>
                        <Text style={styles.eventRowMeta}>{new Date(item.date).toLocaleString('default', { month: 'short', day: 'numeric' })} · {item.time} · {item.location}</Text>

                        <View style={styles.eventRowBottom}>
                            <Text style={styles.eventRowPrice}>Free</Text>
                            {isRegistered && (
                                <View style={styles.explicitBadge}>
                                    <Text style={styles.explicitText}>REGISTERED</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </Card>
            </SpringCard>
        );
    };

    // Derived filtering logic
    let listData: any[] = [];
    let renderFunc = renderClubRow;

    if (activeFilter === 'all') {
        // All events occurring "this week" (for mockup purposes, showing all events sorted by date)
        listData = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        renderFunc = renderEventRow as any;
    } else if (activeFilter === 'clubs') {
        listData = clubs.filter(c => !c.vibeTag.toLowerCase().includes('tech'));
        renderFunc = renderClubRow as any;
    } else if (activeFilter === 'depts') {
        listData = clubs.filter(c => c.vibeTag.toLowerCase().includes('tech'));
        renderFunc = renderClubRow as any;
    } else if (activeFilter === 'public') {
        // Events that do not belong to any specific club list (in our mock data, club hosts are just strings instead of ids)
        // For demonstration, let's treat any event where host is "HackMIT" or "Admin" as public
        listData = events.filter(e => e.host?.toLowerCase().includes('hackmit') || e.host?.toLowerCase().includes('university'));
        renderFunc = renderEventRow as any;
    }

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar barStyle="light-content" />

            {/* Standard Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Explore</Text>
            </View>

            {/* Chips */}
            <View style={styles.chipsWrap}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
                    {chips.map((chip) => {
                        const isActive = activeFilter === chip.id;
                        return (
                            <TouchableOpacity
                                key={chip.id}
                                style={isActive ? styles.chipActive : styles.chip}
                                onPress={() => setActiveFilter(chip.id)}
                            >
                                <Text style={isActive ? styles.chipTextActive : styles.chipText}>{chip.label}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <View style={styles.sortRow}>
                <View style={styles.sortLeft}>
                    <Ionicons name="swap-vertical" size={16} color={Colors.textSecondary} />
                    <Text style={styles.sortText}>Recents</Text>
                </View>
                <Ionicons name="grid-outline" size={18} color={Colors.textSecondary} />
            </View>

            {/* List */}
            <FlatList
                // Add a unique key that changes when numColumns changes to force a fresh render
                key={activeFilter === 'clubs' || activeFilter === 'depts' ? 'grid' : 'list'}
                data={listData}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={renderFunc}
                numColumns={activeFilter === 'clubs' || activeFilter === 'depts' ? 2 : 1}
                columnWrapperStyle={(activeFilter === 'clubs' || activeFilter === 'depts') ? styles.gridRow : undefined}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },

    // Header
    header: {
        paddingHorizontal: Spacing.section,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.md,
    },
    headerTitle: { ...Typography.h1, color: Colors.text },

    // Chips
    chipsWrap: {
        marginBottom: Spacing.md,
    },
    chipsRow: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.section,
        gap: Spacing.sm,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: Radius.pill,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    chipText: { ...Typography.label, color: Colors.textSecondary },
    chipActive: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: Radius.pill,
        backgroundColor: Colors.primary,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    chipTextActive: { ...Typography.label, color: '#FFF', fontWeight: '700' },

    // Sort Row
    sortRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.section,
        paddingVertical: Spacing.sm,
        marginBottom: Spacing.xs,
    },
    sortLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    sortText: { ...Typography.label, color: Colors.textSecondary, fontWeight: '600' },

    // List / Grid
    listContent: { paddingHorizontal: Spacing.section, paddingBottom: 100 },
    gridRow: { gap: Spacing.md, marginBottom: Spacing.md },
    clubCardContainer: {
        flex: 1,
        borderRadius: Radius.lg,
        ...Shadows.md,
        overflow: 'hidden',
    },
    clubCardBanner: {
        width: '100%',
        height: 160,
        backgroundColor: Colors.surface,
    },
    clubCardGradient: {
        flex: 1,
        padding: Spacing.md,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    clubCardLogo: {
        width: 56,
        height: 56,
        borderRadius: 28, // Circular logo for visual flair
        backgroundColor: Colors.surface,
        marginBottom: Spacing.sm,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    clubCardContent: {
        width: '100%',
        alignItems: 'center',
    },
    clubCardTitle: {
        ...Typography.h5,
        color: '#FFF',
        marginBottom: 2,
        textAlign: 'center',
    },
    clubCardSubtitle: {
        ...Typography.micro,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        marginBottom: 2,
    },
    clubCardFollowers: {
        ...Typography.micro,
        color: 'rgba(255,255,255,0.9)',
        fontWeight: 'bold',
        textAlign: 'center',
    },

    // Event Row Styles (Matching Events Tab)
    eventRow: { flexDirection: 'row', overflow: 'hidden' },
    eventRowImage: {
        width: 110,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    eventRowContent: { flex: 1, padding: Spacing.md, gap: 5, justifyContent: 'center' },
    eventRowTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    seatsLeft: { ...Typography.micro, color: Colors.error, fontWeight: '700' as const },
    eventRowTitle: { ...Typography.h5, color: Colors.text },
    eventRowMeta: { ...Typography.caption, color: Colors.textSecondary },
    eventRowBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
    eventRowPrice: { ...Typography.label, color: Colors.primary, fontSize: 13, fontWeight: '700' as const },
    explicitBadge: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    explicitText: {
        fontSize: 9,
        color: '#FFF',
        fontWeight: 'bold',
    },
});
