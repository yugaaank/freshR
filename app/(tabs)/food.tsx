import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../../src/components/ui/SearchBar';
import TagPill from '../../src/components/ui/TagPill';
import { foodCategories, MenuItem, restaurants } from '../../src/data/food';
import { useCartStore } from '../../src/store/cartStore';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../src/theme';

export default function FoodScreen() {
    const [activeCategory, setActiveCategory] = useState('c1');
    const [activeRestaurant, setActiveRestaurant] = useState(restaurants[0].id);
    const totalItems = useCartStore((s) => s.totalItems());
    const totalPrice = useCartStore((s) => s.totalPrice());

    const restaurant = restaurants.find((r) => r.id === activeRestaurant) ?? restaurants[0];
    const filteredMenu =
        activeCategory === 'c1'
            ? restaurant.menu
            : restaurant.menu.filter((m) =>
                foodCategories.find((c) => c.id === activeCategory)?.name === m.category
            );

    return (
        <View style={styles.flex}>
            <SafeAreaView edges={['top']} style={styles.header}>
                <Text style={styles.headerTitle}>Campus Food 🍔</Text>
                <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/order-tracking')}>
                    <Ionicons name="bag-outline" size={22} color={Colors.text} />
                    {totalItems > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{totalItems}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1, 3]}>
                {/* Search */}
                <View style={styles.searchWrap}>
                    <SearchBar placeholder="Search dishes, restaurants..." />
                </View>

                {/* Restaurant Tabs */}
                <View style={styles.restaurantTabsWrap}>
                    <FlatList
                        horizontal
                        data={restaurants}
                        keyExtractor={(r) => r.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.restaurantTabs}
                        renderItem={({ item: r }) => (
                            <TouchableOpacity
                                style={[styles.restaurantTab, activeRestaurant === r.id && styles.restaurantTabActive]}
                                onPress={() => setActiveRestaurant(r.id)}
                            >
                                <Text style={[styles.restaurantTabText, activeRestaurant === r.id && styles.restaurantTabTextActive]}>
                                    {r.name}
                                </Text>
                                {r.tag && <Text style={styles.restaurantTabTag}>{r.tag.split(' ').slice(0, 2).join(' ')}</Text>}
                            </TouchableOpacity>
                        )}
                    />
                </View>

                {/* Restaurant Info */}
                <View style={styles.restaurantInfo}>
                    <Image source={{ uri: restaurant.image }} style={styles.restaurantBanner} />
                    <View style={styles.restaurantDetails}>
                        <View style={styles.restaurantRow}>
                            <View>
                                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                                <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
                            </View>
                            <View style={[restaurant.isOpen ? styles.openBadge : styles.closedBadge]}>
                                <Text style={styles.openBadgeText}>{restaurant.isOpen ? 'Open' : 'Closed'}</Text>
                            </View>
                        </View>
                        <View style={styles.restaurantStats}>
                            <View style={styles.stat}>
                                <Text style={styles.statValue}>⭐ {restaurant.rating}</Text>
                                <Text style={styles.statLabel}>Rating</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.stat}>
                                <Text style={styles.statValue}>{restaurant.deliveryTime}</Text>
                                <Text style={styles.statLabel}>Delivery</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.stat}>
                                <Text style={styles.statValue}>{restaurant.deliveryFee === 0 ? 'Free' : `₹${restaurant.deliveryFee}`}</Text>
                                <Text style={styles.statLabel}>Fee</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Category Row — sticky */}
                <View style={styles.categoryWrap}>
                    <FlatList
                        horizontal
                        data={foodCategories}
                        keyExtractor={(c) => c.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoryRow}
                        renderItem={({ item: c }) => (
                            <TouchableOpacity
                                style={[styles.categoryChip, activeCategory === c.id && styles.categoryChipActive]}
                                onPress={() => setActiveCategory(c.id)}
                            >
                                <Text style={styles.categoryEmoji}>{c.icon}</Text>
                                <Text style={[styles.categoryText, activeCategory === c.id && styles.categoryTextActive]}>
                                    {c.name}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>

                {/* Menu Items */}
                <View style={styles.menuList}>
                    {filteredMenu.map((item) => (
                        <MenuItemCard key={item.id} item={item} restaurantId={restaurant.id} restaurantName={restaurant.name} />
                    ))}
                </View>

                <View style={{ height: totalItems > 0 ? 90 : 24 }} />
            </ScrollView>

            {/* Floating Cart Bar */}
            {totalItems > 0 && (
                <View style={[styles.cartBar, Shadows.floating]}>
                    <View style={styles.cartBarLeft}>
                        <View style={styles.cartCount}>
                            <Text style={styles.cartCountText}>{totalItems}</Text>
                        </View>
                        <Text style={styles.cartBarItems}>{totalItems} item{totalItems > 1 ? 's' : ''} added</Text>
                    </View>
                    <TouchableOpacity style={styles.cartBarBtn} onPress={() => router.push('/order-tracking')}>
                        <Text style={styles.cartBarBtnText}>View Cart · ₹{totalPrice}</Text>
                        <Ionicons name="arrow-forward" size={16} color="#FFF" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

function MenuItemCard({ item, restaurantId, restaurantName }: {
    item: MenuItem;
    restaurantId: string;
    restaurantName: string;
}) {
    const addItem = useCartStore((s) => s.addItem);
    const incrementItem = useCartStore((s) => s.incrementItem);
    const decrementItem = useCartStore((s) => s.decrementItem);
    const quantity = useCartStore((s) => s.getQuantity(item.id));

    return (
        <View style={styles.menuCard}>
            <View style={styles.menuLeft}>
                <View style={styles.vegRow}>
                    <View style={[styles.vegDot, { borderColor: item.isVeg ? Colors.success : Colors.error }]}>
                        <View style={[styles.vegCenter, { backgroundColor: item.isVeg ? Colors.success : Colors.error }]} />
                    </View>
                    {item.isBestseller && (
                        <TagPill label="Bestseller" variant="orange" size="sm" />
                    )}
                </View>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.menuDesc} numberOfLines={2}>{item.description}</Text>
                <View style={styles.menuPriceRow}>
                    <Text style={styles.menuPrice}>₹{item.price}</Text>
                    {item.originalPrice && (
                        <Text style={styles.menuOriginalPrice}>₹{item.originalPrice}</Text>
                    )}
                </View>
                <Text style={styles.menuTime}>⏱ {item.prepTime} min</Text>
            </View>
            <View style={styles.menuRight}>
                <Image source={{ uri: item.image }} style={styles.menuImage} />
                {quantity === 0 ? (
                    <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => addItem(item, restaurantId, restaurantName)}
                    >
                        <Text style={styles.addBtnText}>+ ADD</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.qtyControl}>
                        <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => decrementItem(item.id)}
                        >
                            <Text style={styles.qtyBtnText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyCount}>{quantity}</Text>
                        <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => incrementItem(item.id)}
                        >
                            <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: Colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.sm,
        backgroundColor: Colors.background,
    },
    headerTitle: { ...Typography.h2, color: Colors.text },
    cartBtn: { position: 'relative', padding: Spacing.xs },
    cartBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: Colors.primary,
        borderRadius: 8,
        minWidth: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '700' },
    searchWrap: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm },
    restaurantTabsWrap: { backgroundColor: Colors.background, paddingBottom: Spacing.sm },
    restaurantTabs: { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
    restaurantTab: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: Radius.md,
        backgroundColor: Colors.sectionBg,
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    restaurantTabActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
    restaurantTabText: { ...Typography.body2, color: Colors.textSecondary, fontWeight: '600' },
    restaurantTabTextActive: { color: Colors.primary },
    restaurantTabTag: { ...Typography.caption, color: Colors.textTertiary, fontSize: 10 },
    restaurantInfo: { marginBottom: Spacing.md },
    restaurantBanner: { width: '100%', height: 160 },
    restaurantDetails: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.cardBg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.divider,
    },
    restaurantRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
    restaurantName: { ...Typography.h3, color: Colors.text },
    restaurantCuisine: { ...Typography.body2, color: Colors.textSecondary, marginTop: 2 },
    openBadge: { backgroundColor: Colors.successLight, borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 3 },
    closedBadge: { backgroundColor: Colors.errorLight, borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 3 },
    openBadgeText: { ...Typography.caption, color: Colors.success, fontWeight: '700' },
    restaurantStats: { flexDirection: 'row', alignItems: 'center' },
    stat: { flex: 1, alignItems: 'center' },
    statValue: { ...Typography.h5, color: Colors.text },
    statLabel: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
    statDivider: { width: 1, height: 30, backgroundColor: Colors.divider },
    categoryWrap: { backgroundColor: Colors.background, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.divider },
    categoryRow: { paddingHorizontal: Spacing.lg, gap: Spacing.sm },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs + 2,
        borderRadius: Radius.full,
        backgroundColor: Colors.sectionBg,
    },
    categoryChipActive: { backgroundColor: Colors.primaryLight },
    categoryEmoji: { fontSize: 14 },
    categoryText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },
    categoryTextActive: { color: Colors.primary },
    menuList: { paddingHorizontal: Spacing.lg, gap: 0 },
    menuCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.divider,
        gap: Spacing.md,
    },
    menuLeft: { flex: 1, gap: 5 },
    vegRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    vegDot: { width: 14, height: 14, borderRadius: 1, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
    vegCenter: { width: 7, height: 7, borderRadius: 4 },
    menuName: { ...Typography.h5, color: Colors.text },
    menuDesc: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 17 },
    menuPriceRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    menuPrice: { ...Typography.price, color: Colors.text },
    menuOriginalPrice: { ...Typography.body2, color: Colors.textTertiary, textDecorationLine: 'line-through' },
    menuTime: { ...Typography.caption, color: Colors.textSecondary },
    menuRight: { alignItems: 'center', gap: Spacing.sm },
    menuImage: { width: 90, height: 90, borderRadius: Radius.md },
    addBtn: {
        borderWidth: 1.5,
        borderColor: Colors.primary,
        borderRadius: Radius.sm,
        paddingVertical: 5,
        paddingHorizontal: Spacing.md,
        backgroundColor: Colors.primaryLight,
    },
    addBtnText: { ...Typography.label, color: Colors.primary, fontWeight: '700' },
    qtyControl: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: Colors.primary,
        borderRadius: Radius.sm,
        overflow: 'hidden',
        backgroundColor: Colors.primaryLight,
    },
    qtyBtn: { padding: 6, paddingHorizontal: Spacing.sm },
    qtyBtnText: { ...Typography.h5, color: Colors.primary },
    qtyCount: { paddingHorizontal: Spacing.sm, ...Typography.h5, color: Colors.primary },
    cartBar: {
        position: 'absolute',
        bottom: 20,
        left: Spacing.lg,
        right: Spacing.lg,
        backgroundColor: Colors.primary,
        borderRadius: Radius.xl,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
    },
    cartBarLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    cartCount: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cartCountText: { ...Typography.caption, color: '#FFF', fontWeight: '700' },
    cartBarItems: { ...Typography.body2, color: '#FFF', fontWeight: '600' },
    cartBarBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
    cartBarBtnText: { ...Typography.h5, color: '#FFF', fontWeight: '700' },
});
