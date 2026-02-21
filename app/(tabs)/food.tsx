import { Ionicons } from '@expo/vector-icons';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { menuCategories, menuItems, restaurants } from '../../src/data/food';
import { useCartStore } from '../../src/store/cartStore';
import { router } from 'expo-router';
import { Colors, Radius, Spacing, Typography } from '../../src/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHIP_SIZE = (SCREEN_WIDTH - Spacing.section * 2 - Spacing.md * 2) / 3;
const categories = ['All', ...menuCategories.map((cat) => cat.name)];

const canteenIcons: { [key: string]: React.ComponentProps<typeof Ionicons>['name'] } = {
    'Canteen Central': 'cafe',
    'Burger Shed': 'fast-food',
    'Fresh Greens': 'leaf',
    'Main Canteen': 'restaurant',
    'South Court': 'restaurant',
    'North Court': 'leaf',
    'Express': 'rocket',
    'Green Kitchen': 'water',
};

export default function FoodScreen() {
    const [activeRestaurantId, setActiveRestaurantId] = useState(restaurants[0].id);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [vegOnly, setVegOnly] = useState(false);
    const [nonVegOnly, setNonVegOnly] = useState(false);
    const cart = useCartStore();

    const restaurant =
        restaurants.find((r) => r.id === activeRestaurantId) ?? restaurants[0];

    const filteredItems = useMemo(() => {
        return menuItems
            .filter((item) => {
                if (item.restaurantId !== activeRestaurantId) return false;
                if (activeCategory !== 'All' && item.category !== activeCategory) return false;
                if (vegOnly && !item.isVeg) return false;
                if (nonVegOnly && item.isVeg) return false;
                if (
                    search &&
                    !item.name.toLowerCase().includes(search.toLowerCase()) &&
                    !item.description.toLowerCase().includes(search.toLowerCase())
                ) {
                    return false;
                }
                return true;
            })
            .sort((a, b) => Number(b.isPopular) - Number(a.isPopular));
    }, [activeRestaurantId, activeCategory, vegOnly, nonVegOnly, search]);

    const trendingRecipe = useMemo(
        () =>
            menuItems.find(
                (item) => item.isPopular && item.restaurantId === activeRestaurantId
            ) ??
            menuItems.find((item) => item.isPopular) ??
            menuItems[0],
        [activeRestaurantId]
    );

    const cartCount = cart.totalItems();
    const cartTotal = cart.totalPrice();

    const trendingImageUri =
        trendingRecipe?.image ?? 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&q=80';

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <StatusBar barStyle="dark-content" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.pretitle}>Good afternoon</Text>
                        <Text style={styles.title}>What’s cooking today?</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.cartIconWrap}
                        onPress={() => router.push('/cart')}
                        activeOpacity={0.85}
                    >
                        <Ionicons name="cart-outline" size={22} color={Colors.text} />
                        {cartCount > 0 && (
                            <View style={styles.badgeCircle}>
                                <Text style={styles.badgeText}>{cartCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={styles.searchRow}>
                    <Ionicons name="search" size={18} color={Colors.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search here"
                        placeholderTextColor={Colors.textSecondary}
                        value={search}
                        onChangeText={setSearch}
                    />
                    <Ionicons name="mic" size={18} color={Colors.textSecondary} />
                </View>

                <Text style={styles.sectionLabel}>Choose a canteen</Text>
                <View style={styles.canteenGrid}>
                    {restaurants.map((canteen) => {
                        const iconName = canteenIcons[canteen.name] ?? 'restaurant';
                        const isActive = canteen.id === activeRestaurantId;
                        return (
                            <TouchableOpacity
                                key={canteen.id}
                                style={[
                                    styles.canteenChip,
                                    isActive && styles.canteenChipActive,
                                ]}
                                activeOpacity={0.85}
                                onPress={() => {
                                    setActiveRestaurantId(canteen.id);
                                    setSearch('');
                                    setNonVegOnly(false);
                                    setVegOnly(false);
                                }}
                            >
                                <View style={styles.canteenIconWrap}>
                                    <Ionicons name={iconName} size={22} color={Colors.success} />
                                </View>
                                <Text style={styles.canteenLabel} numberOfLines={2}>
                                    {canteen.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <Text style={styles.sectionLabel}>Trending Recipe</Text>
                <View style={styles.trendingCard}>
                    <Image source={{ uri: trendingImageUri }} style={styles.trendingImage} />
                    <View style={styles.trendingInfo}>
                        <Text style={styles.trendingTag}>Chef’s pick</Text>
                        <Text style={styles.trendingTitle} numberOfLines={2}>
                            {trendingRecipe?.name}
                        </Text>
                        <Text style={styles.trendingMeta}>
                            {trendingRecipe?.description}
                        </Text>
                        <View style={styles.trendingActions}>
                            <TouchableOpacity
                                style={styles.bookBtn}
                                onPress={() => {
                                    if (trendingRecipe) {
                                        cart.addItem(
                                            trendingRecipe,
                                            trendingRecipe.restaurantId,
                                            restaurant.name
                                        );
                                    }
                                }}
                                activeOpacity={0.85}
                            >
                                <Text style={styles.bookBtnText}>Book it</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Ionicons
                                    name="heart-outline"
                                    size={22}
                                    color={Colors.success}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={styles.filterRow}>
                    <TouchableOpacity
                        style={[styles.filterToggle, vegOnly && styles.filterToggleActive]}
                        onPress={() => {
                            setVegOnly(!vegOnly);
                            if (!vegOnly) setNonVegOnly(false);
                        }}
                        activeOpacity={0.85}
                    >
                        <Text style={[styles.toggleText, vegOnly && styles.toggleTextActive]}>Veg only</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterToggle, nonVegOnly && styles.filterToggleActive]}
                        onPress={() => {
                            setNonVegOnly(!nonVegOnly);
                            if (!nonVegOnly) setVegOnly(false);
                        }}
                        activeOpacity={0.85}
                    >
                        <Text style={[styles.toggleText, nonVegOnly && styles.toggleTextActive]}>
                            Non-veg
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryRow}
                >
                    {categories.map((category) => {
                        const isActive = activeCategory === category;
                        return (
                            <TouchableOpacity
                                key={category}
                                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                                onPress={() => setActiveCategory(category)}
                                activeOpacity={0.85}
                            >
                                <Text
                                    style={[
                                        styles.categoryText,
                                        isActive && styles.categoryTextActive,
                                    ]}
                                >
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <View style={styles.menuSection}>
                    {filteredItems.length === 0 && (
                        <Text style={styles.emptyText}>No dishes match your filters.</Text>
                    )}
                    {filteredItems.map((item) => {
                        const qty = cart.getQuantity(item.id);
                        return (
                            <View key={item.id} style={styles.menuCard}>
                                <Image source={{ uri: item.image }} style={styles.menuImage} />
                                <View style={styles.menuContent}>
                                    <Text style={styles.menuTitle}>{item.name}</Text>
                                    <Text style={styles.menuDesc} numberOfLines={2}>
                                        {item.description}
                                    </Text>
                                    <View style={styles.menuMetaRow}>
                                        <Text style={styles.menuPrice}>₹{item.price}</Text>
                                        <View style={styles.menuRating}>
                                            <Ionicons name="star" size={14} color="#FFD60A" />
                                            <Text style={styles.menuRatingText}>{item.rating}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.menuActions}>
                                        {qty === 0 ? (
                                            <TouchableOpacity
                                                style={styles.menuAddBtn}
                                                onPress={() =>
                                                    cart.addItem(item, item.restaurantId, restaurant.name)
                                                }
                                                activeOpacity={0.85}
                                            >
                                                <Text style={styles.menuAddText}>Add</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={styles.qtyRow}>
                                                <TouchableOpacity
                                                    onPress={() => cart.decrementItem(item.id)}
                                                    style={styles.qtyBtn}
                                                    activeOpacity={0.85}
                                                >
                                                    <Ionicons
                                                        name="remove-circle-outline"
                                                        size={24}
                                                        color={Colors.textSecondary}
                                                    />
                                                </TouchableOpacity>
                                                <Text style={styles.qtyValue}>{qty}</Text>
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        cart.addItem(item, item.restaurantId, restaurant.name)
                                                    }
                                                    style={styles.qtyBtn}
                                                    activeOpacity={0.85}
                                                >
                                                    <Ionicons
                                                        name="add-circle"
                                                        size={24}
                                                        color={Colors.success}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {cartCount > 0 && (
                    <TouchableOpacity
                        style={styles.cartSummary}
                        activeOpacity={0.9}
                        onPress={() => router.push('/cart')}
                    >
                        <View>
                            <Text style={styles.cartSummaryLabel}>View cart</Text>
                            <Text style={styles.cartSummaryPrice}>
                                {cartCount} items · ₹{cartTotal}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.text} />
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    scrollContent: {
        padding: Spacing.section,
        paddingBottom: Spacing.xxxl,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
    },
    pretitle: {
        ...Typography.body2,
        color: Colors.textSecondary,
    },
    title: {
        ...Typography.h2,
        color: Colors.text,
        marginTop: Spacing.xs,
    },
    cartIconWrap: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.divider,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    badgeCircle: {
        width: 28,
        height: 28,
        borderRadius: 16,
        backgroundColor: Colors.success,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -4,
        right: -4,
    },
    badgeText: {
        ...Typography.caption,
        color: '#fff',
        fontWeight: '700' as const,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: Radius.xl,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.divider,
        marginBottom: Spacing.lg,
    },
    searchInput: {
        flex: 1,
        ...Typography.body2,
        marginHorizontal: Spacing.sm,
        color: Colors.text,
    },
    sectionLabel: {
        ...Typography.h4,
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    canteenGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
    },
    canteenChip: {
        width: CHIP_SIZE,
        height: CHIP_SIZE,
        backgroundColor: Colors.surface,
        borderRadius: Radius.xl,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: Colors.divider,
        padding: Spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 12,
        shadowOpacity: 0.05,
        elevation: 2,
        marginBottom: Spacing.md,
    },
    canteenChipActive: {
        borderColor: Colors.success,
        backgroundColor: '#EAFFF4',
    },
    canteenIconWrap: {
        width: 42,
        height: 42,
        borderRadius: Radius.md,
        backgroundColor: 'rgba(76,206,143,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xs,
    },
    canteenLabel: {
        ...Typography.caption,
        color: Colors.text,
        textAlign: 'center',
    },
    trendingCard: {
        borderRadius: Radius.xxl,
        backgroundColor: Colors.surface,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.divider,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 6,
        marginBottom: Spacing.lg,
    },
    trendingImage: {
        width: 130,
        height: 150,
        resizeMode: 'cover',
    },
    trendingInfo: {
        flex: 1,
        padding: Spacing.md,
        justifyContent: 'space-between',
    },
    trendingTag: {
        ...Typography.label,
        color: Colors.success,
    },
    trendingTitle: {
        ...Typography.h3,
        color: Colors.text,
        marginBottom: Spacing.xs,
    },
    trendingMeta: {
        ...Typography.body2,
        color: Colors.textSecondary,
    },
    trendingActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: Spacing.sm,
    },
    bookBtn: {
        backgroundColor: Colors.success,
        borderRadius: Radius.md,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
    },
    bookBtnText: {
        ...Typography.body1,
        color: '#fff',
        fontWeight: '600' as const,
    },
    filterRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    filterToggle: {
        flex: 1,
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor: Colors.divider,
        paddingVertical: Spacing.sm,
        alignItems: 'center',
    },
    filterToggleActive: {
        borderColor: Colors.success,
        backgroundColor: '#EAFFF4',
    },
    toggleText: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    toggleTextActive: {
        color: Colors.success,
        fontWeight: '600' as const,
    },
    categoryRow: {
        paddingVertical: Spacing.sm,
        paddingRight: Spacing.section,
    },
    categoryChip: {
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor: Colors.divider,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        marginRight: Spacing.md,
        backgroundColor: Colors.surface,
    },
    categoryChipActive: {
        borderColor: Colors.success,
        backgroundColor: '#F0FFF9',
    },
    categoryText: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    categoryTextActive: {
        color: Colors.success,
        fontWeight: '600' as const,
    },
    menuSection: {
        marginTop: Spacing.md,
        marginBottom: Spacing.lg,
    },
    emptyText: {
        ...Typography.body2,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginVertical: Spacing.lg,
    },
    menuCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: Radius.xl,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.divider,
        marginBottom: Spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.04,
        shadowRadius: 12,
        elevation: 3,
    },
    menuImage: {
        width: 90,
        height: 90,
        borderRadius: Radius.md,
        marginRight: Spacing.md,
    },
    menuContent: {
        flex: 1,
    },
    menuTitle: {
        ...Typography.h4,
        color: Colors.text,
    },
    menuDesc: {
        ...Typography.body2,
        color: Colors.textSecondary,
        marginVertical: Spacing.xs,
    },
    menuMetaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    menuPrice: {
        ...Typography.h4,
        color: Colors.text,
    },
    menuRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs / 2,
    },
    menuRatingText: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    menuActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: Spacing.sm,
    },
    menuAddBtn: {
        backgroundColor: Colors.success,
        borderRadius: Radius.xl,
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.lg,
    },
    menuAddText: {
        ...Typography.body2,
        color: '#fff',
        fontWeight: '600' as const,
    },
    qtyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    qtyBtn: {
        padding: Spacing.xs,
    },
    qtyValue: {
        ...Typography.body2,
        color: Colors.text,
        fontWeight: '700' as const,
    },
    cartSummary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: Radius.xl,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.divider,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 6,
        marginBottom: Spacing.md,
    },
    cartSummaryLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    cartSummaryPrice: {
        ...Typography.body1,
        color: Colors.text,
        fontWeight: '700' as const,
    },
});
