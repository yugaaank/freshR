import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TagPill from '../../src/components/ui/TagPill';
import { menuCategories, menuItems, restaurants } from '../../src/data/food';
import { useCartStore } from '../../src/store/cartStore';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../src/theme';

const { width: SW } = Dimensions.get('window');

export default function FoodScreen() {
    const [activeRestaurantId, setActiveRestaurantId] = useState(restaurants[0].id);
    const [activeCategory, setActiveCategory] = useState('All');
    const cart = useCartStore();

    const restaurant = restaurants.find((r) => r.id === activeRestaurantId) ?? restaurants[0];
    const menuForRestaurant = menuItems.filter(
        (item) =>
            item.restaurantId === activeRestaurantId &&
            (activeCategory === 'All' || item.category === activeCategory)
    );

    const cartCount = cart.totalItems();
    const cartTotal = cart.totalPrice();

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            {/* ═══ RESTAURANT BANNER ═══ */}
            <View style={[styles.banner, { backgroundColor: restaurant.colorBg ?? '#FF6B35' }]}>
                <View style={styles.bannerOverlay} />
                <View style={styles.bannerContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <Ionicons name="arrow-back" size={20} color="#FFF" />
                    </TouchableOpacity>
                    <View style={styles.bannerBottom}>
                        <Text style={styles.bannerEmoji}>{restaurant.emoji ?? '🍽️'}</Text>
                        <View>
                            <Text style={styles.bannerName}>{restaurant.name}</Text>
                            <Text style={styles.bannerMeta}>{restaurant.cuisine} · {restaurant.deliveryTime}</Text>
                            <View style={styles.bannerRating}>
                                <Ionicons name="star" size={12} color="#FFD60A" />
                                <Text style={styles.bannerRatingText}>{restaurant.rating}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* ═══ RESTAURANT SELECTOR ═══ */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.restSelectorWrap}
                contentContainerStyle={styles.restSelector}
            >
                {restaurants.map((r) => (
                    <TouchableOpacity
                        key={r.id}
                        style={[styles.restChip, activeRestaurantId === r.id && styles.restChipActive]}
                        onPress={() => { setActiveRestaurantId(r.id); setActiveCategory('All'); }}
                        activeOpacity={0.88}
                    >
                        <Text style={[styles.restChipText, activeRestaurantId === r.id && styles.restChipTextActive]}>
                            {r.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* ═══ CATEGORY FILTER ═══ */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.catRow}
            >
                {['All', ...menuCategories.map((c) => c.name)].map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
                        onPress={() => setActiveCategory(cat)}
                        activeOpacity={0.88}
                    >
                        <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* ═══ MENU ITEMS ═══ */}
            <FlatList
                data={menuForRestaurant}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.menuList}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item }) => {
                    const inCart = cart.items.find((c) => c.item.id === item.id);
                    const qty = inCart?.quantity ?? 0;

                    return (
                        <View style={styles.menuItem}>
                            {/* Colored left border strip — replaces veg dot */}
                            <View style={[styles.vegStrip, { backgroundColor: item.isVeg ? Colors.success : Colors.error }]} />

                            <View style={styles.menuContent}>
                                <View style={styles.menuLeft}>
                                    <View style={styles.menuTop}>
                                        <Text style={styles.menuName}>{item.name}</Text>
                                        {item.isPopular && (
                                            <TagPill label="🔥 Popular" variant="orange" size="sm" />
                                        )}
                                    </View>
                                    <Text style={styles.menuDesc} numberOfLines={2}>{item.description}</Text>
                                    <Text style={styles.menuPrice}>₹{item.price}</Text>
                                </View>

                                {/* ADD / QTY control */}
                                <View style={styles.menuRight}>
                                    {qty === 0 ? (
                                        <TouchableOpacity
                                            style={styles.addBtn}
                                            activeOpacity={0.88}
                                            onPress={() => cart.addItem(item, activeRestaurantId)}
                                        >
                                            <Text style={styles.addBtnText}>ADD</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <View style={styles.qtyControl}>
                                            <TouchableOpacity
                                                style={styles.qtyBtn}
                                                activeOpacity={0.88}
                                                onPress={() => cart.decrementItem(item.id)}
                                            >
                                                <Ionicons name="remove" size={14} color="#FFF" />
                                            </TouchableOpacity>
                                            <Text style={styles.qtyText}>{qty}</Text>
                                            <TouchableOpacity
                                                style={styles.qtyBtn}
                                                activeOpacity={0.88}
                                                onPress={() => cart.addItem(item, activeRestaurantId)}
                                            >
                                                <Ionicons name="add" size={14} color="#FFF" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    );
                }}
            />

            {/* ═══ FLOATING CART BAR ═══ */}
            {cartCount > 0 && (
                <View style={styles.cartBarWrap}>
                    {/* White fade behind bar */}
                    <View style={styles.cartBarFade} />
                    <TouchableOpacity
                        style={styles.cartBar}
                        activeOpacity={0.92}
                        onPress={() => router.push('/order-tracking')}
                    >
                        <View style={styles.cartBarLeft}>
                            <View style={styles.cartCount}>
                                <Text style={styles.cartCountText}>{cartCount}</Text>
                            </View>
                            <Text style={styles.cartBarLabel}>View Cart</Text>
                        </View>
                        <View style={styles.cartBarRight}>
                            <Text style={styles.cartBarPrice}>₹{cartTotal}</Text>
                            <Ionicons name="arrow-forward" size={16} color="#FFF" />
                        </View>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },

    // Banner
    banner: { height: 180, position: 'relative' },
    bannerOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.40)',
    },
    bannerContent: { flex: 1, padding: Spacing.section, justifyContent: 'space-between' },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.30)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerBottom: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.md },
    bannerEmoji: { fontSize: 52 },
    bannerName: { ...Typography.h2, color: '#FFF' },
    bannerMeta: { ...Typography.body2, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
    bannerRating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    bannerRatingText: { ...Typography.label, color: '#FFD60A', fontSize: 13 },

    // Restaurant selector
    restSelectorWrap: { borderBottomWidth: 1, borderBottomColor: Colors.border },
    restSelector: { paddingHorizontal: Spacing.section, paddingVertical: Spacing.sm, gap: 8 },
    restChip: {
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderRadius: Radius.pill,
        backgroundColor: Colors.surface,
    },
    restChipActive: { backgroundColor: Colors.primary },
    restChipText: { ...Typography.label, fontSize: 12, color: Colors.textSecondary, fontWeight: '600' as const },
    restChipTextActive: { color: '#FFF' },

    // Category filter
    catRow: { paddingHorizontal: Spacing.section, gap: 8, paddingVertical: Spacing.sm },
    catChip: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: Radius.pill,
        backgroundColor: Colors.surface,
    },
    catChipActive: { backgroundColor: Colors.primaryLight, borderWidth: 1, borderColor: Colors.primary },
    catText: { ...Typography.label, fontSize: 11, color: Colors.textSecondary, fontWeight: '600' as const },
    catTextActive: { color: Colors.primary },

    // Menu
    menuList: { paddingVertical: Spacing.sm, paddingBottom: 100 },
    separator: { height: 1, backgroundColor: Colors.divider, marginLeft: 20 },
    menuItem: { flexDirection: 'row', backgroundColor: Colors.cardBg },
    vegStrip: { width: 4 },
    menuContent: { flex: 1, flexDirection: 'row', padding: Spacing.md, gap: Spacing.md },
    menuLeft: { flex: 1, gap: 5 },
    menuTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' },
    menuName: { ...Typography.h5, color: Colors.text, flex: 1 },
    menuDesc: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 17 },
    menuPrice: { ...Typography.label, color: Colors.text, fontSize: 14, fontWeight: '700' as const },
    menuRight: { justifyContent: 'center', alignItems: 'center' },
    // ADD button — solid fill pill (Blinkit spec)
    addBtn: {
        backgroundColor: Colors.primary,
        borderRadius: Radius.pill,
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    addBtnText: { ...Typography.label, color: '#FFF', fontSize: 13, fontWeight: '700' as const },
    qtyControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        borderRadius: Radius.pill,
        overflow: 'hidden',
    },
    qtyBtn: { padding: 8, paddingHorizontal: 10 },
    qtyText: { ...Typography.label, color: '#FFF', fontSize: 14, minWidth: 24, textAlign: 'center' },

    // Cart bar
    cartBarWrap: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: Spacing.section,
        paddingBottom: Spacing.xl,
    },
    cartBarFade: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 90,
        backgroundColor: 'rgba(255,255,255,0.95)',
    },
    cartBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.primary,
        borderRadius: Radius.xl,
        padding: Spacing.lg,
        ...Shadows.colored(Colors.primary),
    },
    cartBarLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    cartCount: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartCountText: { ...Typography.label, color: '#FFF', fontSize: 12 },
    cartBarLabel: { ...Typography.h5, color: '#FFF' },
    cartBarRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    cartBarPrice: { ...Typography.price, color: '#FFF' },
});
