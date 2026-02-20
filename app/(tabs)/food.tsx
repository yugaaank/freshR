import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { menuCategories, menuItems, restaurants } from '../../src/data/food';
import { useCartStore } from '../../src/store/cartStore';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../src/theme';

const { width: SW } = Dimensions.get('window');
const ITEM_W = (SW - Spacing.section * 2 - 12) / 2;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function SpringCard({ children, style, onPress, delay = 0, ...props }: any) {
    const scale = useSharedValue(1);
    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    return (
        <AnimatedPressable
            onPressIn={() => { scale.value = withSpring(0.96, { damping: 15, stiffness: 200 }); }}
            onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 200 }); }}
            onPress={onPress}
            style={[style, animatedStyle]}
            entering={FadeInDown.delay(delay).springify()}
            {...props}
        >
            {children}
        </AnimatedPressable>
    );
}

export default function FoodScreen() {
    const [activeRestaurantId, setActiveRestaurantId] = useState(restaurants[0].id);
    const [activeCategory, setActiveCategory] = useState('All');
    const [vegOnly, setVegOnly] = useState(false);
    const [nonVegOnly, setNonVegOnly] = useState(false);
    const [search, setSearch] = useState('');
    const cart = useCartStore();

    const restaurant = restaurants.find((r) => r.id === activeRestaurantId) ?? restaurants[0];

    const filtered = menuItems.filter((item) => {
        if (item.restaurantId !== activeRestaurantId) return false;
        if (activeCategory !== 'All' && item.category !== activeCategory) return false;
        if (vegOnly && !item.isVeg) return false;
        if (nonVegOnly && item.isVeg) return false;
        if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const cartCount = cart.totalItems();
    const cartTotal = cart.totalPrice();

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            {/* ═══ RESTAURANT TABS (Blinkit-style top switcher) ═══ */}
            <View style={styles.tabBar}>
                <View style={styles.restTabsWrap}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.restTabs}
                    >
                        {restaurants.map((r) => (
                            <TouchableOpacity
                                key={r.id}
                                style={[styles.restTab, activeRestaurantId === r.id && styles.restTabActive]}
                                onPress={() => { setActiveRestaurantId(r.id); setActiveCategory('All'); }}
                                activeOpacity={0.85}
                            >
                                <Text style={[styles.restTabText, activeRestaurantId === r.id && styles.restTabTextActive]} numberOfLines={1}>
                                    {r.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>

            {/* ═══ RESTAURANT INFO CARD (Blinkit floating card) ═══ */}
            <SpringCard delay={100} style={styles.infoCard}>
                <View style={styles.infoCardTop}>
                    <View style={styles.infoLeft}>
                        <Text style={styles.infoName}>{restaurant.name}</Text>
                        <Text style={styles.infoMeta}>{restaurant.deliveryTime} · {restaurant.cuisine.split('·')[0].trim()}</Text>
                    </View>
                    <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={11} color="#FFF" />
                        <Text style={styles.ratingText}>{restaurant.rating}</Text>
                    </View>
                </View>
                <View style={styles.offerStrip}>
                    <View style={styles.offerBadge}>
                        <Ionicons name="pricetag" size={11} color="#FFF" />
                        <Text style={styles.offerBadgeText}>FREE DELIVERY</Text>
                    </View>
                    <Text style={styles.offerDesc}>No delivery charge on all orders</Text>
                </View>
            </SpringCard>

            {/* ═══ SEARCH + FILTERS ═══ */}
            <View style={styles.searchRow}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={16} color={Colors.textTertiary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for dishes"
                        placeholderTextColor={Colors.textTertiary}
                        value={search}
                        onChangeText={setSearch}
                    />
                    <Ionicons name="mic" size={16} color={Colors.primary} />
                </View>
            </View>

            {/* ── Veg / Non-veg toggles + category chips ── */}
            <View style={styles.filterBarWrap}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterBar}
                >
                    <TouchableOpacity
                        style={[styles.vegToggle, vegOnly && styles.vegToggleActive]}
                        onPress={() => { setVegOnly(!vegOnly); setNonVegOnly(false); }}
                        activeOpacity={0.85}
                    >
                        <View style={styles.vegDot} />
                        <Text style={styles.vegToggleText}>Veg</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.nonVegToggle, nonVegOnly && styles.nonVegToggleActive]}
                        onPress={() => { setNonVegOnly(!nonVegOnly); setVegOnly(false); }}
                        activeOpacity={0.85}
                    >
                        <View style={styles.nonVegDot} />
                        <Text style={styles.vegToggleText}>Non-veg</Text>
                    </TouchableOpacity>
                    {['All', ...menuCategories.map((c) => c.name)].map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
                            onPress={() => setActiveCategory(cat)}
                            activeOpacity={0.85}
                        >
                            <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* ═══ SECTION HEADER ═══ */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recommended ({filtered.length})</Text>
                <Ionicons name="chevron-down" size={16} color={Colors.textSecondary} />
            </View>

            {/* ═══ 2-COLUMN MENU GRID (Blinkit style) ═══ */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.grid}
                renderItem={({ item, index }) => {
                    const qty = cart.items.find((c) => c.item.id === item.id)?.quantity ?? 0;
                    return (
                        <SpringCard delay={150 + index * 50} style={styles.menuCardWrap}>
                            <View style={styles.menuCard}>
                                {/* Food image */}
                                <View style={styles.imageWrap}>
                                    <Image
                                        source={{ uri: item.image }}
                                        style={styles.foodImage}
                                        resizeMode="cover"
                                        defaultSource={{ uri: 'https://via.placeholder.com/200x160/F2F2F7/999999?text=🍽' }}
                                    />
                                    {/* Veg / NonVeg indicator */}
                                    <View style={[styles.vegIndicator, { borderColor: item.isVeg ? '#22C55E' : '#EF4444' }]}>
                                        <View style={[styles.vegIndicatorDot, { backgroundColor: item.isVeg ? '#22C55E' : '#EF4444' }]} />
                                    </View>
                                    {/* Rating chip */}
                                    <View style={styles.ratingChip}>
                                        <Ionicons name="star" size={9} color="#FFD60A" />
                                        <Text style={styles.ratingChipText}>{item.rating}</Text>
                                    </View>
                                    {item.isPopular && (
                                        <View style={styles.popularChip}>
                                            <Text style={styles.popularChipText}>🔥 Popular</Text>
                                        </View>
                                    )}
                                </View>
                                {/* Item info */}
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                    <Text style={styles.itemDesc} numberOfLines={1}>{item.description}</Text>
                                    <View style={styles.itemBottom}>
                                        <Text style={styles.itemPrice}>₹{item.price}</Text>
                                        {qty === 0 ? (
                                            <TouchableOpacity
                                                style={styles.addBtn}
                                                onPress={() => cart.addItem(item, item.restaurantId)}
                                                activeOpacity={0.85}
                                            >
                                                <Text style={styles.addBtnText}>ADD</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={styles.qtyCtrl}>
                                                <TouchableOpacity onPress={() => cart.decrementItem(item.id)} style={styles.qtyBtn}>
                                                    <Ionicons name="remove" size={12} color={Colors.primary} />
                                                </TouchableOpacity>
                                                <Text style={styles.qtyText}>{qty}</Text>
                                                <TouchableOpacity onPress={() => cart.addItem(item, item.restaurantId)} style={styles.qtyBtn}>
                                                    <Ionicons name="add" size={12} color={Colors.primary} />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </SpringCard>
                    );
                }}
            />

            {/* ═══ CART BAR ═══ */}
            {cartCount > 0 && (
                <View style={styles.cartBarWrap}>
                    <TouchableOpacity activeOpacity={0.92}>
                        <BlurView intensity={80} tint="dark" style={styles.cartBar}>
                            <View style={styles.cartLeft}>
                                <View style={styles.cartBadge}>
                                    <Text style={styles.cartBadgeText}>{cartCount}</Text>
                                </View>
                                <Text style={styles.cartLabel}>View Cart</Text>
                            </View>
                            <Text style={styles.cartPrice}>₹{cartTotal}</Text>
                        </BlurView>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F5F5F5' },

    // Restaurant tabs
    tabBar: {
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    restTabsWrap: { height: 50 },
    restTabs: {
        paddingHorizontal: Spacing.section,
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
        height: 50,
    },
    restTab: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: Radius.pill,
        backgroundColor: Colors.surface,
    },
    restTabActive: { backgroundColor: Colors.primary },
    restTabText: { ...Typography.label, fontSize: 13, color: Colors.textSecondary, fontWeight: '600' as const },
    restTabTextActive: { color: '#FFF' },

    // Restaurant info card
    infoCard: {
        marginHorizontal: Spacing.section,
        marginVertical: Spacing.md,
        backgroundColor: '#FFF',
        borderRadius: Radius.xl,
        padding: Spacing.md,
        ...Shadows.md,
    },
    infoCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    infoLeft: { flex: 1, marginRight: Spacing.md },
    infoName: { ...Typography.h4, color: Colors.text },
    infoMeta: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: '#1A9E5F',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    ratingText: { ...Typography.label, color: '#FFF', fontSize: 12, fontWeight: '700' as const },
    offerStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: Spacing.sm,
        paddingTop: Spacing.sm,
        borderTopWidth: 1,
        borderTopColor: Colors.divider,
    },
    offerBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#6C63FF',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 3,
    },
    offerBadgeText: { ...Typography.micro, color: '#FFF', fontWeight: '700' as const, fontSize: 9 },
    offerDesc: { ...Typography.caption, color: Colors.textSecondary },

    // Search
    searchRow: { paddingHorizontal: Spacing.section, paddingBottom: Spacing.sm, backgroundColor: '#FFF' },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        borderRadius: Radius.lg,
        paddingHorizontal: Spacing.md,
        paddingVertical: 10,
        gap: 8,
    },
    searchInput: { flex: 1, ...Typography.body2, color: Colors.text, padding: 0 },

    // Filters
    filterBarWrap: { height: 48, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: Colors.border },
    filterBar: {
        paddingHorizontal: Spacing.section,
        gap: 8,
        alignItems: 'center',
        flexDirection: 'row',
        height: 48,
    },
    vegToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: Radius.pill,
        borderWidth: 1.5,
        borderColor: '#22C55E',
    },
    vegToggleActive: { backgroundColor: '#DCFCE7' },
    nonVegToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: Radius.pill,
        borderWidth: 1.5,
        borderColor: '#EF4444',
    },
    nonVegToggleActive: { backgroundColor: '#FEE2E2' },
    vegDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
    nonVegDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
    vegToggleText: { ...Typography.micro, color: Colors.textSecondary, fontWeight: '600' as const },
    catChip: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: Radius.pill,
        backgroundColor: Colors.surface,
    },
    catChipActive: { backgroundColor: Colors.primaryLight, borderWidth: 1, borderColor: Colors.primary },
    catText: { ...Typography.micro, color: Colors.textSecondary, fontWeight: '600' as const },
    catTextActive: { color: Colors.primary },

    // Section
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: Spacing.section,
        paddingVertical: Spacing.sm,
        backgroundColor: '#FFF',
    },
    sectionTitle: { ...Typography.h4, color: Colors.text },

    // 2-column grid
    grid: { paddingHorizontal: Spacing.section, paddingTop: Spacing.sm, paddingBottom: 100 },
    row: { gap: 12, marginBottom: 12 },
    menuCardWrap: {
        width: ITEM_W,
        borderRadius: Radius.lg,
        ...Shadows.sm,
    },
    menuCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: Radius.lg,
        overflow: 'hidden',
    },

    // Food image
    imageWrap: { width: '100%', height: ITEM_W * 0.75, position: 'relative' },
    foodImage: { width: '100%', height: '100%', backgroundColor: '#F0F0F0' },
    vegIndicator: {
        position: 'absolute',
        bottom: 6,
        left: 6,
        width: 14,
        height: 14,
        borderRadius: 3,
        borderWidth: 1.5,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    vegIndicatorDot: { width: 7, height: 7, borderRadius: 3.5 },
    ratingChip: {
        position: 'absolute',
        top: 6,
        right: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        backgroundColor: 'rgba(0,0,0,0.65)',
        borderRadius: 4,
        paddingHorizontal: 5,
        paddingVertical: 3,
    },
    ratingChipText: { fontSize: 9, color: '#FFF', fontWeight: '700' as const },
    popularChip: {
        position: 'absolute',
        bottom: 6,
        right: 6,
        backgroundColor: '#FFF3E8',
        borderRadius: 4,
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    popularChipText: { fontSize: 9, color: Colors.primary, fontWeight: '700' as const },

    // Item info
    itemInfo: { padding: Spacing.sm, gap: 3 },
    itemName: { ...Typography.h5, color: Colors.text, fontSize: 13 },
    itemDesc: { ...Typography.micro, color: Colors.textSecondary, fontSize: 10 },
    itemBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
    itemPrice: { ...Typography.label, color: Colors.text, fontWeight: '700' as const, fontSize: 13 },

    // ADD / QTY (Blinkit outlined style)
    addBtn: {
        borderWidth: 1.5,
        borderColor: Colors.primary,
        borderRadius: 6,
        paddingHorizontal: 14,
        paddingVertical: 5,
    },
    addBtnText: { ...Typography.label, color: Colors.primary, fontSize: 12, fontWeight: '700' as const },
    qtyCtrl: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: Colors.primary,
        borderRadius: 6,
        overflow: 'hidden',
    },
    qtyBtn: { padding: 5, paddingHorizontal: 7 },
    qtyText: { ...Typography.label, color: Colors.primary, fontSize: 12, minWidth: 18, textAlign: 'center' },

    // Cart bar
    cartBarWrap: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Spacing.section,
        paddingBottom: Spacing.xl,
    },
    cartBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.65)', // Semi-transparent overlay to mix with dark tint
    },
    cartLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    cartBadge: {
        width: 24, height: 24, borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center', justifyContent: 'center',
    },
    cartBadgeText: { ...Typography.micro, color: '#FFF', fontWeight: '700' as const },
    cartLabel: { ...Typography.h5, color: '#FFF' },
    cartPrice: { ...Typography.h5, color: '#FFF' },
});
