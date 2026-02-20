import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    Extrapolation,
    FadeInDown,
    Layout,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
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

function createQRCode(prefix: string) {
    return `${prefix}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

export default function FoodScreen() {
    const [activeRestaurantId, setActiveRestaurantId] = useState(restaurants[0].id);
    const [activeCategory, setActiveCategory] = useState('All');
    const [vegOnly, setVegOnly] = useState(false);
    const [nonVegOnly, setNonVegOnly] = useState(false);
    const [search, setSearch] = useState('');
    const cart = useCartStore();
    const [cartOpen, setCartOpen] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState<'review' | 'payment'>('review');
    const [orderStatus, setOrderStatus] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [lastSlot, setLastSlot] = useState<string | null>(null);
    const [slotOpen, setSlotOpen] = useState(false);
    const [qrPending, setQrPending] = useState(false);
    const [qrScanned, setQrScanned] = useState(false);
    const [qrCode, setQrCode] = useState<string>('');
    const slots = useMemo(() => {
        const generated: string[] = [];
        for (let hour = 8; hour < 18; hour++) {
            for (let minute = 0; minute < 60; minute += 10) {
                const label = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
                generated.push(label);
            }
        }
        return generated;
    }, []);

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

    const scrollY = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    const stickyHeaderStyle = useAnimatedStyle(() => {
        const translateY = interpolate(
            scrollY.value,
            [0, 200, 250],
            [-100, -100, 0],
            Extrapolation.CLAMP
        );
        const opacity = interpolate(
            scrollY.value,
            [0, 200, 250],
            [0, 0, 1],
            Extrapolation.CLAMP
        );
        return {
            transform: [{ translateY }],
            opacity,
        };
    });

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            {/* ═══ STICKY FILTER HEADER ═══ */}
            <Animated.View style={[styles.stickyHeader, stickyHeaderStyle]}>
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
                        <View style={styles.vegBadgeIcon}>
                            <View style={styles.vegDot} />
                        </View>
                        <Text style={styles.vegToggleText}>Veg</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.nonVegToggle, nonVegOnly && styles.nonVegToggleActive]}
                        onPress={() => { setNonVegOnly(!nonVegOnly); setVegOnly(false); }}
                        activeOpacity={0.85}
                    >
                        <View style={styles.nonVegBadgeIcon}>
                            <View style={styles.nonVegDot} />
                        </View>
                        <Text style={styles.vegToggleText}>Non-veg</Text>
                    </TouchableOpacity>
                    {['All', ...menuCategories.map((c) => c.name)].map((cat) => (
                        <TouchableOpacity
                            key={`sticky-${cat}`}
                            style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
                            onPress={() => setActiveCategory(cat)}
                            activeOpacity={0.85}
                        >
                            <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </Animated.View>

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
                        <View style={styles.vegBadgeIcon}>
                            <View style={styles.vegDot} />
                        </View>
                        <Text style={styles.vegToggleText}>Veg</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.nonVegToggle, nonVegOnly && styles.nonVegToggleActive]}
                        onPress={() => { setNonVegOnly(!nonVegOnly); setVegOnly(false); }}
                        activeOpacity={0.85}
                    >
                        <View style={styles.nonVegBadgeIcon}>
                            <View style={styles.nonVegDot} />
                        </View>
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
            <Animated.FlatList
                data={filtered}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                keyExtractor={(item: any) => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.grid}
                renderItem={({ item, index }: any) => {
                    const qty = cart.items.find((c) => c.item.id === item.id)?.quantity ?? 0;
                    return (
                        <SpringCard delay={150 + index * 50} style={styles.menuCardWrap}>
                            <View style={styles.menuCard}>
                                {/* Food image container */}
                                <View style={styles.imageWrap}>
                                    {item.image ? (
                                        <Image
                                            source={{ uri: item.image }}
                                            style={styles.foodImage}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <LinearGradient
                                            colors={[Colors.surface, Colors.border]}
                                            style={styles.imagePlaceholder}
                                        >
                                            <Ionicons name="fast-food-outline" size={32} color={Colors.textTertiary} />
                                        </LinearGradient>
                                    )}
                                    {/* Veg / NonVeg indicator over image */}
                                    <View style={[styles.vegIndicator, { borderColor: item.isVeg ? '#22C55E' : '#EF4444' }]}>
                                        <View style={[styles.vegIndicatorDot, { backgroundColor: item.isVeg ? '#22C55E' : '#EF4444' }]} />
                                    </View>
                                    {/* Rating badge overlapping top right */}
                                    <View style={styles.ratingChip}>
                                        <Ionicons name="star" size={10} color="#FFD60A" />
                                        <Text style={styles.ratingChipText}>{item.rating}</Text>
                                    </View>
                                    {item.isPopular && (
                                        <LinearGradient
                                            colors={['#FF8A00', '#E52E71']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={styles.popularChipGradient}
                                        >
                                            <Text style={styles.popularChipTextGradient}>🔥 Bestseller</Text>
                                        </LinearGradient>
                                    )}
                                </View>

                                {/* Item textual info */}
                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                                    <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>

                                    <View style={styles.itemActionsRow}>
                                        <View>
                                            <Text style={styles.itemPrice}>₹{item.price}</Text>
                                            {item.isPopular && <Text style={styles.strikePrice}>₹{Math.floor(item.price * 1.2)}</Text>}
                                        </View>

                                        {qty === 0 ? (
                                            <TouchableOpacity
                                                style={styles.addBtnContainer}
                                                onPress={() => cart.addItem(item, item.restaurantId)}
                                                activeOpacity={0.8}
                                            >
                                                <Text style={styles.addBtnTextBeautiful}>ADD <Ionicons name="add" size={14} /></Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={styles.qtyCtrlBeautiful}>
                                                <TouchableOpacity onPress={() => cart.decrementItem(item.id)} style={styles.qtyBtnBeautiful}>
                                                    <Ionicons name="remove" size={16} color="#FFF" />
                                                </TouchableOpacity>
                                                <Text style={styles.qtyTextBeautiful}>{qty}</Text>
                                                <TouchableOpacity onPress={() => cart.addItem(item, item.restaurantId)} style={styles.qtyBtnBeautiful}>
                                                    <Ionicons name="add" size={16} color="#FFF" />
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
                    <TouchableOpacity activeOpacity={0.92} onPress={() => { setCartOpen(true); setCheckoutStep('review'); }}>
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

            {cartOpen && (
                <View style={styles.cartOverlayContainer}>
                    <TouchableOpacity style={styles.cartOverlayBackdrop} onPress={() => { setCartOpen(false); setOrderStatus(null); }} />
                    <View style={styles.cartOverlay}>
                        <View style={styles.cartHeader}>
                            <Text style={styles.cartHeaderTitle}>Your Order</Text>
                            <TouchableOpacity onPress={() => { setCartOpen(false); setOrderStatus(null); }}>
                                <Ionicons name="close-circle" size={24} color={Colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                            <ScrollView style={styles.cartItemsList}>
                            {cart.items.map((entry) => (
                                <View key={entry.item.id} style={styles.cartItem}>
                                    <View>
                                        <Text style={styles.cartItemName}>{entry.item.name}</Text>
                                        <Text style={styles.cartItemMeta}>₹{entry.item.price} • {entry.quantity} pcs</Text>
                                    </View>
                                    <View style={styles.qtyCtrlBeautiful}>
                                        <TouchableOpacity onPress={() => cart.decrementItem(entry.item.id)} style={styles.qtyBtnBeautiful}>
                                            <Ionicons name="remove" size={16} color="#FFF" />
                                        </TouchableOpacity>
                                        <Text style={styles.qtyTextBeautiful}>{entry.quantity}</Text>
                                        <TouchableOpacity onPress={() => cart.addItem(entry.item, entry.restaurantId)} style={styles.qtyBtnBeautiful}>
                                            <Ionicons name="add" size={16} color="#FFF" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                        <View style={styles.cartSlotSection}>
                            <Text style={styles.cartSlotLabel}>Pickup window (10 min)</Text>
                            <TouchableOpacity
                                style={[styles.dropdown, slotOpen && styles.dropdownActive]}
                                onPress={() => setSlotOpen((prev) => !prev)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.dropdownLabel, selectedSlot ? styles.dropdownLabelActive : styles.dropdownPlaceholder]}>
                                    {selectedSlot ?? 'Select a time slot'}
                                </Text>
                                <Ionicons name={slotOpen ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textSecondary} />
                            </TouchableOpacity>
                            {slotOpen && (
                                <View style={styles.dropdownList}>
                                    <ScrollView nestedScrollEnabled style={{ maxHeight: 160 }}>
                                        {slots.map((slot) => (
                                            <TouchableOpacity
                                                key={slot}
                                                style={styles.dropdownItem}
                                                onPress={() => {
                                                    setSelectedSlot(slot);
                                                    setSlotOpen(false);
                                                }}
                                            >
                                                <Text style={styles.dropdownItemText}>{slot}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}
                        </View>
                        <View style={styles.cartFooter}>
                            <Text style={styles.cartFooterTotal}>Total ₹{cartTotal}</Text>
                            {checkoutStep === 'review' ? (
                                <TouchableOpacity
                                    style={[styles.cartPrimaryBtn, !selectedSlot && styles.cartPrimaryBtnDisabled]}
                                    onPress={() => {
                                        if (!selectedSlot) {
                                            setOrderStatus('Pick a pickup window before placing the order.');
                                            return;
                                        }
                                        setCheckoutStep('payment');
                                        setOrderStatus('Order placed — ready for payment.');
                                    }}
                                    disabled={!selectedSlot}
                                >
                                    <Text style={styles.cartPrimaryText}>Place order</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.cartPrimaryBtn, styles.cartPrimaryBtnPay]}
                                    onPress={() => {
                                        setOrderStatus('Payment successful. Collect your meal at the counter.');
                                        setQrPending(true);
                                        setQrScanned(false);
                                        setLastSlot(selectedSlot);
                                        setQrCode(createQRCode('FOOD'));
                                        cart.clearCart();
                                        setSelectedSlot(null);
                                        setTimeout(() => { setCartOpen(false); setOrderStatus(null); }, 800);
                                        setCheckoutStep('review');
                                    }}
                                >
                                    <Text style={styles.cartPrimaryText}>Pay now</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        {orderStatus && <Text style={styles.orderStatus}>{orderStatus}</Text>}
                    </View>
                </View>
            )}
            {qrPending && (
                <Animated.View layout={Layout.springify()} style={[styles.qrCard, qrScanned && styles.qrCardCollected]}>
                    <Text style={styles.qrLabel}>Order QR</Text>
                    <Text style={styles.qrCode}>{qrCode}</Text>
                    <Text style={styles.qrSlot}>Slot: {lastSlot ?? '—'}</Text>
                    <Text style={styles.qrStatus}>
                        {qrScanned ? 'Collected' : 'Pending collection — scan QR to confirm.'}
                    </Text>
                    {!qrScanned && (
                        <TouchableOpacity
                            style={styles.qrBtn}
                            onPress={() => {
                                setQrScanned(true);
                                setOrderStatus('Order collected successfully.');
                                setTimeout(() => {
                                    setQrPending(false);
                                    setLastSlot(null);
                                }, 1200);
                            }}
                        >
                            <Text style={styles.qrBtnText}>Scan</Text>
                        </TouchableOpacity>
                    )}
                </Animated.View>
            )}
        </SafeAreaView>
    );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#F5F5F5', position: 'relative' },
    stickyHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        paddingTop: Spacing.xl + 20, // push below safe area
        paddingBottom: Spacing.sm,
        ...Shadows.sm,
    },

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
    vegBadgeIcon: {
        width: 14, height: 14, borderWidth: 1.5, borderColor: '#22C55E', alignItems: 'center', justifyContent: 'center', borderRadius: 3
    },
    nonVegBadgeIcon: {
        width: 14, height: 14, borderWidth: 1.5, borderColor: '#EF4444', alignItems: 'center', justifyContent: 'center', borderRadius: 3
    },
    vegDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#22C55E' },
    nonVegDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
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
    row: { gap: 16, marginBottom: 16 },
    menuCardWrap: {
        width: ITEM_W,
        borderRadius: 20,
        backgroundColor: '#FFF',
        ...Shadows.md,
        shadowColor: 'rgba(0,0,0,0.1)', // Softer shadow
        shadowRadius: 10,
        elevation: 6,
    },
    menuCard: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
    },

    // Food image
    imageWrap: { width: '100%', height: ITEM_W * 0.85, position: 'relative' },
    foodImage: { width: '100%', height: '100%', backgroundColor: Colors.surface },
    imagePlaceholder: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' },
    vegIndicator: {
        position: 'absolute',
        top: 8,
        left: 8,
        width: 16,
        height: 16,
        borderRadius: 4,
        borderWidth: 1.5,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    vegIndicatorDot: { width: 8, height: 8, borderRadius: 4 },
    ratingChip: {
        position: 'absolute',
        top: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: Radius.pill,
        paddingHorizontal: 8,
        paddingVertical: 4,
        ...Shadows.sm,
    },
    ratingChipText: { fontSize: 11, color: '#333', fontWeight: 'bold' as const },
    popularChipGradient: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        borderRadius: Radius.pill,
        paddingHorizontal: 8,
        paddingVertical: 4,
        ...Shadows.sm,
    },
    popularChipTextGradient: { fontSize: 10, color: '#FFF', fontWeight: 'bold' as const },

    // Item info
    itemInfo: { padding: Spacing.md, gap: 4, flex: 1, justifyContent: 'space-between' },
    itemName: { ...Typography.h5, color: Colors.text, fontSize: 14, lineHeight: 18 },
    itemDesc: { ...Typography.caption, color: Colors.textTertiary, fontSize: 11, lineHeight: 15 },
    itemActionsRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    itemPrice: { ...Typography.h5, color: Colors.text, fontSize: 15 },
    strikePrice: { ...Typography.micro, color: Colors.textTertiary, textDecorationLine: 'line-through', marginTop: 2 },

    // Beautiful ADD / QTY controls
    addBtnContainer: {
        backgroundColor: 'rgba(255,107,53,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,107,53,0.3)',
        borderRadius: Radius.lg,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    addBtnTextBeautiful: {
        ...Typography.label,
        color: Colors.primary,
        fontSize: 13,
        fontWeight: 'bold' as const,
    },
    qtyCtrlBeautiful: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        borderRadius: Radius.lg,
        paddingHorizontal: 4,
        paddingVertical: 4,
        ...Shadows.sm,
    },
    qtyBtnBeautiful: { padding: 4, paddingHorizontal: 6 },
    qtyTextBeautiful: { ...Typography.label, color: '#FFF', fontSize: 13, minWidth: 20, textAlign: 'center', fontWeight: 'bold' as const },

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
    cartOverlayContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 100,
    },
    cartOverlayBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    cartOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Spacing.lg,
        backgroundColor: '#F9FAFB',
        borderTopLeftRadius: Radius.xxl,
        borderTopRightRadius: Radius.xxl,
        maxHeight: '70%',
    },
    cartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    cartHeaderTitle: {
        ...Typography.h4,
    },
    cartItemsList: {
        maxHeight: 220,
        marginBottom: Spacing.md,
    },
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderColor: Colors.border,
    },
    cartItemName: {
        ...Typography.body1,
        fontWeight: '600',
    },
    cartItemMeta: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    cartFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cartFooterTotal: {
        ...Typography.h5,
        fontWeight: '700',
    },
    cartPrimaryBtn: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        borderRadius: Radius.lg,
    },
    cartPrimaryBtnPay: {
        backgroundColor: '#0F172A',
    },
    cartPrimaryText: {
        ...Typography.label,
        color: '#FFF',
        fontWeight: '700',
    },
    orderStatus: {
        marginTop: Spacing.sm,
        ...Typography.body2,
        color: Colors.success,
        textAlign: 'center',
    },
    cartSlotSection: {
        marginBottom: Spacing.sm,
    },
    cartSlotLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginBottom: Spacing.xs,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.md,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.surface,
    },
    dropdownActive: {
        borderColor: Colors.primary,
    },
    dropdownLabel: {
        ...Typography.body2,
    },
    dropdownPlaceholder: {
        color: Colors.textTertiary,
    },
    dropdownLabelActive: {
        color: Colors.text,
        fontWeight: '700',
    },
    dropdownList: {
        marginTop: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.md,
        backgroundColor: Colors.cardBg,
    },
    dropdownItem: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
    },
    dropdownItemText: {
        ...Typography.body2,
        color: Colors.text,
    },
    cartPrimaryBtnDisabled: {
        opacity: 0.5,
    },
    qrCard: {
        position: 'absolute',
        bottom: 90,
        left: Spacing.section,
        right: Spacing.section,
        backgroundColor: '#FFF',
        borderRadius: Radius.xl,
        padding: Spacing.lg,
        ...Shadows.lg,
        alignItems: 'center',
    },
    qrCardCollected: {
        borderWidth: 1,
        borderColor: Colors.success,
    },
    qrLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginBottom: Spacing.xs,
    },
    qrCode: {
        ...Typography.h3,
        marginBottom: Spacing.xs,
    },
    qrSlot: {
        ...Typography.body2,
        color: Colors.textSecondary,
    },
    qrStatus: {
        ...Typography.body2,
        marginTop: Spacing.sm,
        color: Colors.text,
        textAlign: 'center',
    },
    qrBtn: {
        marginTop: Spacing.sm,
        backgroundColor: Colors.primary,
        borderRadius: Radius.lg,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
    },
    qrBtnText: {
        ...Typography.label,
        color: '#FFF',
        fontWeight: '700',
    },
});
