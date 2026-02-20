import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    Easing,
    Extrapolation,
    FadeInDown,
    FadeInUp,
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset,
    useSharedValue,
    withRepeat,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../src/components/ui/Card';
import TagPill from '../../src/components/ui/TagPill';
import { events } from '../../src/data/events';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../src/theme';



const TABS = ['My College', 'City Events'];
const CATEGORIES = ['All', 'Tech', 'Music', 'Sports', 'Cultural', 'Workshop', 'Academic'];

const CATEGORY_COLORS: Record<string, string> = {
    Tech: '#007AFF', Music: '#FF2D55', Sports: '#34C759',
    Cultural: '#AF52DE', Workshop: '#FF9500', Academic: '#5856D6', All: '#6B6B6B',
};

const CAT_ICONS: Record<string, any> = {
    Tech: 'laptop-outline', Music: 'musical-notes-outline', Sports: 'football-outline',
    Cultural: 'color-palette-outline', Workshop: 'hammer-outline', Academic: 'book-outline', All: 'ticket-outline',
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function SpringCard({ children, style, onPress, delay = 0, entering, ...props }: any) {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    return (
        <AnimatedPressable
            onPressIn={() => { scale.value = withSpring(0.96, { damping: 15, stiffness: 200 }); }}
            onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 200 }); }}
            onPress={onPress}
            style={[style, animatedStyle]}
            entering={entering ? entering.delay(delay).springify() : FadeInUp.delay(delay).springify()}
            {...props}
        >
            {children}
        </AnimatedPressable>
    );
}

function SkeletonCard() {
    const opacity = useSharedValue(0.3);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
            -1,
            true
        );
    }, [opacity]);

    const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
        <Animated.View style={[styles.skeletonRow, animatedStyle]}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonContent}>
                <View style={styles.skeletonTop} />
                <View style={[styles.skeletonLine, { width: '80%' }]} />
                <View style={[styles.skeletonLine, { width: '50%' }]} />
            </View>
        </Animated.View>
    );
}

export default function EventsScreen() {
    const [activeTab, setActiveTab] = useState(0);
    const [activeCat, setActiveCat] = useState('All');
    const [search, setSearch] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const searchLower = search.trim().toLowerCase();

    const filtered = events.filter((e) => {
        const matchesCat = activeCat === 'All' || e.category === activeCat;
        const matchesSearch = searchLower === '' ||
            e.title.toLowerCase().includes(searchLower) ||
            e.venue.toLowerCase().includes(searchLower);
        return matchesCat && matchesSearch;
    });

    const featured = filtered.length > 0 && searchLower === '' ? filtered[0] : null;
    const rest = searchLower === '' ? filtered.slice(1) : filtered;

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const t = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(t);
    }, []);

    const listData = isLoading
        ? Array.from({ length: 5 }).map((_, i) => ({ id: `skel-${i}`, isSkeleton: true } as any))
        : rest;

    const scrollRef = useAnimatedRef<Animated.FlatList<any>>();
    const scrollOffset = useScrollViewOffset(scrollRef);

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            marginTop: interpolate(scrollOffset.value, [0, 60], [0, -60], Extrapolation.CLAMP),
            transform: [{ translateY: interpolate(scrollOffset.value, [0, 60], [0, -60], Extrapolation.CLAMP) }],
            opacity: interpolate(scrollOffset.value, [0, 40], [1, 0], Extrapolation.CLAMP),
        };
    });

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            {/* Header */}
            <Animated.View style={[styles.header, headerAnimatedStyle, { overflow: 'hidden' }]}>
                {isSearching ? (
                    <View style={styles.searchBarActive}>
                        <Ionicons name="search" size={18} color={Colors.textTertiary} />
                        <TextInput
                            autoFocus
                            style={styles.searchInput}
                            placeholder="Search events, venues..."
                            placeholderTextColor={Colors.textTertiary}
                            value={search}
                            onChangeText={setSearch}
                        />
                        <TouchableOpacity onPress={() => { setIsSearching(false); setSearch(''); }}>
                            <Ionicons name="close-circle" size={20} color={Colors.textTertiary} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <Text style={styles.headerTitle}>Events</Text>
                        <TouchableOpacity style={styles.searchIconBtn} activeOpacity={0.88} onPress={() => setIsSearching(true)}>
                            <Ionicons name="search-outline" size={22} color={Colors.text} />
                        </TouchableOpacity>
                    </>
                )}
            </Animated.View>

            {/* Tabs */}
            <View style={styles.tabRow}>
                {TABS.map((tab, idx) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === idx && styles.tabActive]}
                        onPress={() => setActiveTab(idx)}
                        activeOpacity={0.88}
                    >
                        <Text style={[styles.tabText, activeTab === idx && styles.tabTextActive]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Category Pills */}
            <View style={styles.catRowWrap}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.catRow}
                >
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.catChip,
                                activeCat === cat
                                    ? { backgroundColor: Colors.primary, borderColor: Colors.primary }
                                    : { backgroundColor: 'transparent', borderColor: Colors.border }
                            ]}
                            onPress={() => setActiveCat(cat)}
                            activeOpacity={0.88}
                        >
                            <Text style={[styles.catText, activeCat === cat && styles.catTextActive]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <Animated.FlatList
                ref={scrollRef as any}
                data={listData}
                keyExtractor={(e) => e.id}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                contentContainerStyle={styles.list}
                ListHeaderComponent={
                    isLoading ? (
                        <View style={[styles.featuredCard, { height: 240, backgroundColor: Colors.surface, opacity: 0.5 }]} />
                    ) : featured ? (
                        <SpringCard
                            delay={0}
                            entering={FadeInDown}
                            onPress={() => router.push(`/event/${featured.id}` as any)}
                            style={styles.featuredCard}
                        >
                            <LinearGradient
                                colors={['#0D3D27', '#000000']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 0, y: 1 }}
                                style={styles.featuredHero}
                            >
                                {/* Gradient overlay via dark-to-transparent via absolute view */}
                                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.featuredOverlay} />
                                <View style={styles.featuredContent}>
                                    <TagPill label={featured.category} variant="dark" size="sm" />
                                    <View style={styles.featuredBottom}>
                                        <Text style={styles.featuredTitle} numberOfLines={2}>{featured.title}</Text>
                                        <View style={styles.featuredMeta}>
                                            <Ionicons name="location-outline" size={13} color="rgba(255,255,255,0.7)" />
                                            <Text style={styles.featuredMetaText}>{featured.venue}</Text>
                                            <View style={styles.dot} />
                                            <Text style={styles.featuredMetaText}>{featured.date}</Text>
                                        </View>
                                        <View style={styles.featuredFooter}>
                                            <Text style={styles.featuredPrice}>
                                                {featured.tickets[0].price === 0 ? 'Free' : `₹${featured.tickets[0].price}`}
                                            </Text>
                                            {featured.seatsLeft < 30 && (
                                                <View style={styles.urgencyPill}>
                                                    <Ionicons name="flash" size={11} color="#FFD60A" />
                                                    <Text style={styles.urgencyText}>{featured.seatsLeft} seats left</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </LinearGradient>
                        </SpringCard>
                    ) : null
                }
                renderItem={({ item, index }) => {
                    if (item.isSkeleton) return <SkeletonCard />;
                    return (
                        <SpringCard
                            delay={index * 50}
                            onPress={() => router.push(`/event/${item.id}` as any)}
                        >
                            <Card style={StyleSheet.flatten([styles.eventRow, { borderLeftWidth: 4, borderLeftColor: CATEGORY_COLORS[item.category] || Colors.primary }])} padding={0} shadow="sm">
                                {/* Left image block */}
                                <LinearGradient
                                    colors={[item.colorBg ?? '#1A1A2E', '#000000']}
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
                                        {item.seatsLeft < 30 && (
                                            <Text style={styles.seatsLeft}>⚡ {item.seatsLeft} left</Text>
                                        )}
                                    </View>
                                    <Text style={styles.eventRowTitle} numberOfLines={2}>{item.title}</Text>
                                    <Text style={styles.eventRowMeta}>{item.date} · {item.venue}</Text>
                                    <Text style={styles.eventRowPrice}>
                                        {item.tickets[0].price === 0 ? 'Free' : `₹${item.tickets[0].price}`}
                                    </Text>
                                </View>
                            </Card>
                        </SpringCard>
                    )
                }}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            />
        </SafeAreaView>
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
        paddingBottom: Spacing.sm,
    },
    headerTitle: { ...Typography.h1, color: Colors.text },
    searchIconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchBarActive: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: Radius.pill,
        paddingHorizontal: Spacing.md,
        height: 40,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        ...Typography.body2,
        color: Colors.text,
        padding: 0,
    },
    // Tab bar
    tabRow: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.section,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        marginBottom: Spacing.sm,
    },
    tab: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        marginRight: Spacing.md,
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    tabActive: { borderBottomColor: Colors.primary },
    tabText: { ...Typography.h5, color: Colors.textSecondary },
    tabTextActive: { color: Colors.primary },
    // Categories
    catRowWrap: {
        height: 48,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    catRow: {
        paddingHorizontal: Spacing.section,
        gap: 8,
        alignItems: 'center' as const,
        flexDirection: 'row' as const,
    },
    catChip: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: Radius.pill,
        borderWidth: 1,
        alignSelf: 'center' as const,
    },
    catText: { ...Typography.label, fontSize: 12, color: Colors.textSecondary, fontWeight: '600' as const },
    catTextActive: { color: '#FFF' },
    // Featured card
    featuredCard: {
        marginHorizontal: Spacing.section,
        marginBottom: 10,
        borderRadius: Radius.xl,
        overflow: 'hidden',
        ...Shadows.md,
    },
    featuredHero: { height: 240, justifyContent: 'flex-end' },
    featuredOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.55)',
    },
    featuredContent: { padding: Spacing.lg, gap: Spacing.md },
    featuredBottom: { gap: 8 },
    featuredTitle: { ...Typography.hero, color: '#FFF' },
    featuredMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    featuredMetaText: { ...Typography.caption, color: 'rgba(255,255,255,0.70)' },
    dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.40)' },
    featuredFooter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    featuredPrice: { ...Typography.price, color: '#FFF' },
    urgencyPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255,59,48,0.25)',
        borderRadius: Radius.pill,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    urgencyText: { ...Typography.label, color: '#FFD60A', fontSize: 11 },
    // Event row card (horizontal)
    list: { paddingHorizontal: Spacing.section, paddingBottom: 90 },
    eventRow: { flexDirection: 'row', overflow: 'hidden' },
    eventRowImage: {
        width: 110,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    eventRowEmoji: { fontSize: 44 },
    eventRowContent: { flex: 1, padding: Spacing.md, gap: 5, justifyContent: 'center' },
    eventRowTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    seatsLeft: { ...Typography.micro, color: Colors.error, fontWeight: '700' as const },
    eventRowTitle: { ...Typography.h5, color: Colors.text },
    eventRowMeta: { ...Typography.caption, color: Colors.textSecondary },
    eventRowPrice: { ...Typography.label, color: Colors.primary, fontSize: 13, fontWeight: '700' as const },
    // Skeleton
    skeletonRow: {
        flexDirection: 'row',
        backgroundColor: Colors.cardBg,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    skeletonImage: {
        width: 110,
        height: 120,
        backgroundColor: Colors.surface,
        borderRadius: Radius.md,
    },
    skeletonContent: { flex: 1, padding: Spacing.md, gap: 12, justifyContent: 'center' },
    skeletonTop: { width: 60, height: 20, backgroundColor: Colors.surface, borderRadius: Radius.pill },
    skeletonLine: { height: 16, backgroundColor: Colors.surface, borderRadius: Radius.sm },
});
