import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../src/components/ui/Card';
import TagPill from '../../src/components/ui/TagPill';
import { events } from '../../src/data/events';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../src/theme';

const { width: SW } = Dimensions.get('window');

const TABS = ['My College', 'City Events'];
const CATEGORIES = ['All', 'Tech', 'Music', 'Sports', 'Cultural', 'Workshop', 'Academic'];

const CATEGORY_COLORS: Record<string, string> = {
    Tech: '#007AFF', Music: '#FF2D55', Sports: '#34C759',
    Cultural: '#AF52DE', Workshop: '#FF9500', Academic: '#5856D6', All: '#6B6B6B',
};

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

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
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
            </View>

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
                                activeCat === cat && { backgroundColor: CATEGORY_COLORS[cat] ?? Colors.primary },
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

            <FlatList
                data={rest}
                keyExtractor={(e) => e.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}
                ListHeaderComponent={
                    featured ? (
                        <TouchableOpacity
                            activeOpacity={0.92}
                            onPress={() => router.push(`/event/${featured.id}` as any)}
                            style={styles.featuredCard}
                        >
                            <View style={[styles.featuredHero, { backgroundColor: featured.colorBg ?? '#1A1A2E' }]}>
                                {/* Gradient overlay via dark-to-transparent via absolute view */}
                                <View style={styles.featuredOverlay} />
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
                            </View>
                        </TouchableOpacity>
                    ) : null
                }
                renderItem={({ item }) => (
                    <TouchableOpacity
                        activeOpacity={0.88}
                        onPress={() => router.push(`/event/${item.id}` as any)}
                    >
                        <Card style={styles.eventRow} padding={0} shadow="sm">
                            {/* Left image block */}
                            <View style={[styles.eventRowImage, { backgroundColor: item.colorBg ?? '#1A1A2E' }]}>
                                <Text style={styles.eventRowEmoji}>{item.emoji ?? '🎉'}</Text>
                            </View>
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
                    </TouchableOpacity>
                )}
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
        backgroundColor: Colors.surface,
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
});
