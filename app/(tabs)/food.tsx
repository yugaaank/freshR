import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState, useEffect } from 'react';
import {
    Alert,
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
import * as Haptics from 'expo-haptics';
import { useRestaurants, useMenuItems, useMenuCategories } from '../../src/hooks/useFood';
import { useCartStore } from '../../src/store/cartStore';
import { useUserStore } from '../../src/store/userStore';
import { router } from 'expo-router';
import { Colors, Radius, Spacing, Typography } from '../../src/theme';
import SearchBar from '../../src/components/ui/SearchBar';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const canteenIcons: { [key: string]: React.ComponentProps<typeof Ionicons>['name'] } = {
    'Saffron Dhaba': 'cafe',
    'Burger Shed': 'fast-food',
    'Fresh Greens': 'leaf',
    'Wok in Progress': 'restaurant',
};

export default function FoodScreen() {
    const { profile } = useUserStore();
    const { data: restaurants = [], isLoading: restaurantsLoading } = useRestaurants();
    const [activeRestaurantId, setActiveRestaurantId] = useState<string | null>(null);
    
    useEffect(() => {
        if (restaurants.length > 0 && !activeRestaurantId) {
            setActiveRestaurantId(restaurants[0].id);
        }
    }, [restaurants, activeRestaurantId]);

    const { data: menuItems = [], isLoading: menuLoading } = useMenuItems(activeRestaurantId ?? '');
    const { data: dbCategories = [] } = useMenuCategories(activeRestaurantId ?? '');

    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [vegOnly, setVegOnly] = useState(false);
    const [nonVegOnly, setNonVegOnly] = useState(false);
    
    const cart = useCartStore();

    const restaurant = useMemo(() => 
        restaurants.find((r) => r.id === activeRestaurantId) ?? restaurants[0]
    , [restaurants, activeRestaurantId]);

    const categories = useMemo(() => {
        const unique = new Set(['All', ...dbCategories]);
        return Array.from(unique);
    }, [dbCategories]);

    const filteredItems = useMemo(() => {
        return menuItems
            .filter((item) => {
                if (activeCategory !== 'All' && item.category !== activeCategory) return false;
                if (vegOnly && !item.is_veg) return false;
                if (nonVegOnly && item.is_veg) return false;
                if (
                    search &&
                    !item.name.toLowerCase().includes(search.toLowerCase()) &&
                    !item.description.toLowerCase().includes(search.toLowerCase())
                ) {
                    return false;
                }
                return true;
            })
            .sort((a, b) => Number(b.is_popular) - Number(a.is_popular));
    }, [menuItems, activeCategory, vegOnly, nonVegOnly, search]);

    const trendingRecipe = useMemo(() => 
        filteredItems.find((item) => item.is_popular) ?? filteredItems[0]
    , [filteredItems]);

    const cartCount = cart.totalItems();
    const cartTotal = cart.totalPrice();

    const handleAddItem = (item: any) => {
        const currentRestId = cart.restaurantId;
        const currentRestName = cart.restaurantName || 'another restaurant';
        
        if (currentRestId && currentRestId !== item.restaurant_id) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Alert.alert(
                'Replace cart items?',
                `Your cart contains items from ${currentRestName}. Do you want to discard them and add this item from ${restaurant?.name || 'this restaurant'}?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                        text: 'Discard & Add', 
                        style: 'destructive',
                        onPress: () => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                            cart.addItem(item, item.restaurant_id, restaurant?.name);
                        }
                    },
                ]
            );
        } else {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            cart.addItem(item, item.restaurant_id, restaurant?.name);
        }
    };

    const handleDecrement = (itemId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        cart.decrementItem(itemId);
    };

    if (restaurantsLoading) {
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
                    <Text style={styles.welcomeText}>Craving something?</Text>
                    <Text style={styles.nameText}>{profile?.name?.split(' ')[0] ?? 'Yugank'}'s Kitchen</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.trackOrderBtn}
                        onPress={() => router.push('/order-tracking')}
                        activeOpacity={0.85}
                    >
                        <Ionicons name="location-outline" size={16} color={Colors.primary} />
                        <Text style={styles.trackOrderText}>Track Order</Text>
                    </TouchableOpacity>
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
                        Current selection: <Text style={styles.summaryHighlight}>{restaurant?.name || 'Loading...'}</Text> is ready for orders.
                    </Text>
                </View>

                <View style={styles.searchContainerSticky}>
                    <SearchBar
                        placeholder="Search menu items..."
                        value={search}
                        onChangeText={setSearch}
                        onClear={() => setSearch('')}
                    />
                </View>

                <View style={styles.sectionHeaderWrap}>
                    <Text style={styles.sectionLabel}>Quick Canteens</Text>
                </View>

                <View style={styles.shortcutsSection}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shortcutsGrid}>
                        {restaurants.map((canteen) => {
                            const iconName = canteenIcons[canteen.name] ?? 'restaurant';
                            const isActive = canteen.id === activeRestaurantId;
                            
                            return (
                                <TouchableOpacity
                                    key={canteen.id}
                                    style={styles.shortcutItem}
                                    activeOpacity={0.85}
                                    onPress={() => {
                                        setActiveRestaurantId(canteen.id);
                                        setActiveCategory('All');
                                        setSearch('');
                                    }}
                                >
                                    <View style={[
                                        styles.shortcutIconWrap, 
                                        { backgroundColor: isActive ? Colors.primary : Colors.secondary },
                                    ]}>
                                        <Ionicons name={iconName} size={22} color={isActive ? Colors.primaryForeground : Colors.primary} />
                                    </View>
                                    <Text style={[styles.shortcutText, isActive && { color: Colors.primary, fontFamily: 'Sora_700Bold' }]} numberOfLines={1}>
                                        {canteen.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {menuLoading ? (
                    <ActivityIndicator color={Colors.primary} style={{ marginVertical: 40 }} />
                ) : (
                    <>
                        <View style={styles.sectionHeaderWrap}>
                            <Text style={styles.sectionLabel}>Student’s Top Pick</Text>
                        </View>
                        
                        {trendingRecipe && (
                            <TouchableOpacity style={styles.spotlightWrap} onPress={() => handleAddItem(trendingRecipe)}>
                                <View style={styles.trendingCard}>
                                    <Image source={{ uri: trendingRecipe.image || '' }} style={styles.trendingImage} />
                                    <View style={styles.trendingInfo}>
                                        <View style={styles.trendingHeader}>
                                            <Text style={styles.trendingTag}>RECOMMENDED</Text>
                                            <TouchableOpacity>
                                                <Ionicons name="heart-outline" size={20} color={Colors.textLight} />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.trendingTitle} numberOfLines={1}>
                                            {trendingRecipe.name}
                                        </Text>
                                        <Text style={styles.trendingMeta} numberOfLines={2}>
                                            {trendingRecipe.description}
                                        </Text>
                                        <View style={styles.trendingFooter}>
                                            <Text style={styles.trendingPrice}>₹{trendingRecipe.price}</Text>
                                            <View style={styles.bookBtn}>
                                                <Text style={styles.bookBtnText}>ADD</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}

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
                                        <View style={[styles.menuImageWrap, { backgroundColor: Colors.secondary }]}>
                                            <Image source={{ uri: item.image || '' }} style={styles.menuImage} />
                                        </View>
                                        <View style={styles.menuContent}>
                                            <View style={styles.menuTopRow}>
                                                <Text style={styles.menuTitle}>{item.name}</Text>
                                                <View style={styles.menuRating}>
                                                    <Ionicons name="star" size={12} color={Colors.warning} />
                                                    <Text style={styles.menuRatingText}>{item.rating}</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.menuDesc} numberOfLines={1}>
                                                {item.description}
                                            </Text>
                                            <View style={styles.menuMetaRow}>
                                                <Text style={styles.menuPrice}>₹{item.price}</Text>
                                                <View style={styles.menuActions}>
                                                    {qty === 0 ? (
                                                        <TouchableOpacity
                                                            style={[styles.menuAddBtn, { backgroundColor: Colors.primary }]}
                                                            onPress={() => handleAddItem(item)}
                                                            activeOpacity={0.85}
                                                        >
                                                            <Text style={styles.menuAddText}>+ ADD</Text>
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <View style={styles.qtyRow}>
                                                            <TouchableOpacity
                                                                onPress={() => handleDecrement(item.id)}
                                                                style={styles.qtyBtn}
                                                                activeOpacity={0.85}
                                                            >
                                                                <Ionicons name="remove-circle-outline" size={22} color={Colors.mutedForeground} />
                                                            </TouchableOpacity>
                                                            <Text style={styles.qtyValue}>{qty}</Text>
                                                            <TouchableOpacity
                                                                onPress={() => handleAddItem(item)}
                                                                style={styles.qtyBtn}
                                                                activeOpacity={0.85}
                                                            >
                                                                <Ionicons name="add-circle" size={22} color={Colors.primary} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </>
                )}

                {cartCount > 0 && (
                    <TouchableOpacity
                        style={styles.cartSummary}
                        activeOpacity={0.9}
                        onPress={() => router.push('/cart')}
                    >
                        <View>
                            <Text style={styles.cartSummaryLabel}>Review your selection</Text>
                            <Text style={styles.cartSummaryPrice}>
                                {cartCount} items · ₹{cartTotal}
                            </Text>
                        </View>
                        <View style={styles.cartSummaryArrow}>
                            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
                        </View>
                    </TouchableOpacity>
                )}
                <View style={{ height: 120 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    scrollContent: {
        paddingBottom: 110,
    },
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
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    trackOrderBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primaryLight,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: Radius.pill,
        gap: 6,
        borderWidth: 1,
        borderColor: Colors.primary + '20',
    },
    trackOrderText: {
        ...Typography.micro,
        color: Colors.primary,
        fontFamily: 'Sora_700Bold',
    },
    cartIconWrap: {
        width: 40,
        height: 40,
        borderRadius: Radius.md,
        backgroundColor: Colors.surface,
        borderWidth: 0.5,
        borderColor: Colors.divider,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    badgeCircle: {
        width: 20,
        height: 20,
        borderRadius: Radius.pill,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: -6,
        right: -6,
    },
    badgeText: {
        ...Typography.micro,
        color: '#fff',
        fontFamily: 'Sora_700Bold',
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
    sectionHeaderWrap: { paddingHorizontal: Spacing.section, marginTop: Spacing.md, marginBottom: Spacing.md },
    sectionLabel: {
        ...Typography.h4,
        color: Colors.text,
    },
    shortcutsSection: { marginBottom: Spacing.lg },
    shortcutsGrid: { paddingHorizontal: Spacing.section, gap: Spacing.md },
    shortcutItem: { alignItems: 'center', width: 100 },
    shortcutIconWrap: { 
        width: 50, 
        height: 50, 
        borderRadius: Radius.lg, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginBottom: 8, 
        borderWidth: 0.5, 
        borderColor: Colors.divider 
    },
    shortcutText: { ...Typography.micro, color: Colors.textSecondary },
    spotlightWrap: { 
        marginHorizontal: Spacing.section, 
        marginVertical: Spacing.md, 
        borderRadius: Radius.xxl, 
        overflow: 'hidden', 
    },
    trendingCard: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        height: 160,
    },
    trendingImage: {
        width: 140,
        height: '100%',
        resizeMode: 'cover',
    },
    trendingInfo: {
        flex: 1,
        padding: Spacing.md,
        justifyContent: 'space-between',
    },
    trendingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    trendingTag: {
        ...Typography.micro,
        color: Colors.success,
        fontFamily: 'Sora_700Bold',
        letterSpacing: 1,
    },
    trendingTitle: {
        ...Typography.h3,
        color: '#FFFFFF',
    },
    trendingMeta: {
        ...Typography.caption,
        color: 'rgba(255,255,255,0.7)',
        lineHeight: 16,
    },
    trendingFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    trendingPrice: { ...Typography.h4, color: '#FFFFFF' },
    bookBtn: {
        backgroundColor: '#FFFFFF',
        borderRadius: Radius.pill,
        paddingHorizontal: 16,
        paddingVertical: 6,
    },
    bookBtnText: {
        ...Typography.micro,
        color: Colors.primary,
        fontFamily: 'Sora_700Bold',
    },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.section,
        gap: Spacing.sm,
        marginTop: Spacing.sm,
        marginBottom: Spacing.md,
    },
    filterToggle: {
        flex: 1,
        borderRadius: Radius.lg,
        borderWidth: 0.5,
        borderColor: Colors.divider,
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: Colors.surface,
    },
    filterToggleActive: {
        borderColor: Colors.primary + '40',
        backgroundColor: Colors.primaryLight,
    },
    toggleText: {
        ...Typography.caption,
        color: Colors.textSecondary,
        fontFamily: 'Sora_600SemiBold',
    },
    toggleTextActive: {
        color: Colors.primary,
        fontFamily: 'Sora_700Bold',
    },
    categoryRow: {
        paddingHorizontal: Spacing.section,
        paddingBottom: Spacing.md,
        gap: Spacing.md,
    },
    categoryChip: {
        borderRadius: Radius.pill,
        borderWidth: 0.5,
        borderColor: Colors.divider,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: Colors.surface,
    },
    categoryChipActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
    },
    categoryText: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    categoryTextActive: {
        color: Colors.textLight,
        fontFamily: 'Sora_700Bold',
    },
    menuSection: {
        paddingHorizontal: Spacing.section,
        gap: Spacing.md,
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
        gap: 12, 
        padding: 12, 
        borderRadius: Radius.lg, 
        backgroundColor: Colors.surface, 
        borderWidth: 0.5, 
        borderColor: Colors.divider 
    },
    menuImageWrap: { 
        width: 70, 
        height: 70, 
        borderRadius: Radius.md, 
        overflow: 'hidden',
        alignItems: 'center', 
        justifyContent: 'center', 
    },
    menuImage: {
        width: '100%',
        height: '100%',
        borderRadius: Radius.md,
    },
    menuContent: {
        flex: 1,
    },
    menuTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    menuTitle: { ...Typography.h5, color: Colors.text },
    menuRating: { flexDirection: 'row', alignItems: 'center', gap: 2 },
    menuRatingText: { ...Typography.micro, color: Colors.textSecondary },
    menuDesc: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    menuMetaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    menuPrice: {
        ...Typography.h5,
        fontFamily: 'Sora_700Bold',
        color: Colors.text,
    },
    menuActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuAddBtn: {
        borderRadius: Radius.pill,
        paddingVertical: 6,
        paddingHorizontal: 16,
    },
    menuAddText: {
        ...Typography.micro,
        color: '#fff',
        fontFamily: 'Sora_700Bold',
    },
    qtyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    qtyBtn: {
        padding: 2,
    },
    qtyValue: {
        ...Typography.body2,
        color: Colors.text,
        fontFamily: 'Sora_700Bold',
        minWidth: 20,
        textAlign: 'center',
    },
    cartSummary: {
        position: 'absolute',
        bottom: 100,
        left: Spacing.section,
        right: Spacing.section,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: Radius.xl,
        backgroundColor: Colors.primary,
    },
    cartSummaryLabel: {
        ...Typography.micro,
        color: 'rgba(255,255,255,0.8)',
        fontFamily: 'Sora_600SemiBold',
        letterSpacing: 0.5,
    },
    cartSummaryPrice: {
        ...Typography.h4,
        color: Colors.textLight,
        marginTop: 2,
    },
    cartSummaryArrow: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
