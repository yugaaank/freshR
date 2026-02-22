import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import QRCode from 'react-native-qrcode-svg';
import Card from '../src/components/ui/Card';
import { useOrder, useOrderStatus, useUpdateOrderStatus } from '../src/hooks/useOrders';
import { useCartStore } from '../src/store/cartStore';
import { Colors, Radius, Spacing, Typography } from '../src/theme';

const STEPS = [
    { id: 1, label: 'Order Placed', icon: 'checkmark-circle', desc: 'Your order has been received' },
    { id: 2, label: 'Preparing', icon: 'flame', desc: 'Canteen Central is cooking your food' },
    { id: 3, label: 'Ready for Pickup', icon: 'bag-check', desc: 'Your order is ready at the counter' },
    { id: 4, label: 'Delivered', icon: 'home', desc: 'Enjoy your meal!' },
];

const STATUS_STEP: Record<string, number> = {
    pending: 1,
    confirmed: 2,
    preparing: 2,
    ready: 3,
    delivered: 4,
    cancelled: 1,
};

export default function OrderTrackingScreen() {
    const { orderId: routeOrderId } = useLocalSearchParams<{ orderId?: string }>();
    const clearCart = useCartStore((s) => s.clearCart);
    const clearActiveOrder = useCartStore((s) => s.clearActiveOrder);
    const activeOrderId = useCartStore((s) => s.activeOrderId);
    const orderId = routeOrderId || activeOrderId;

    // Fetch order details
    const { data: orderData, isLoading: isOrderLoading } = useOrder(orderId ?? null);

    // Real-time order status from Supabase
    const liveStatus = useOrderStatus(orderId ?? null);
    const updateStatus = useUpdateOrderStatus();
    
    // Simulation state
    const [simStep, setSimStep] = useState(2);
    
    // Derived state
    const currentStep = liveStatus ? (STATUS_STEP[liveStatus] ?? 1) : 1;
    const isDemo = !!(orderId && orderId.startsWith('demo-'));
    const displayStep = isDemo ? simStep : currentStep;
    const isDelivered = displayStep === 4;

    const handleOrderScanned = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if (orderId && !isDemo) {
            updateStatus.mutate({ orderId: orderId, status: 'delivered' });
        } else {
            // Simulation fallback
            setSimStep(4);
            clearActiveOrder();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    // Auto-progress simulation
    useEffect(() => {
        if (!isDemo || simStep >= 4) return;
        
        const timers = [
            setTimeout(() => setSimStep(2), 3000),
            setTimeout(() => setSimStep(3), 8000),
        ];
        return () => timers.forEach(clearTimeout);
    }, [orderId, isDemo]);

    // Clear banner if delivered in real-time
    useEffect(() => {
        if (liveStatus === 'delivered') {
            clearActiveOrder();
        }
    }, [liveStatus]);

    if (!orderId) {
        return (
            <SafeAreaView style={styles.safe} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={22} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Order Tracking</Text>
                    <View style={{ width: 22 }} />
                </View>
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={80} color={Colors.mutedForeground} />
                    <Text style={styles.emptyTitle}>No order placed</Text>
                    <Text style={styles.emptySubtitle}>You haven't placed any orders yet. Head to the food section to order something delicious!</Text>
                    <TouchableOpacity 
                        style={styles.browseBtn}
                        onPress={() => router.replace('/(tabs)/food')}
                    >
                        <Text style={styles.browseBtnText}>Browse Food</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    if (isOrderLoading && !isDemo) {
        return (
            <SafeAreaView style={styles.safe} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={22} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Order Tracking</Text>
                    <View style={{ width: 22 }} />
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    const displayOrderId = orderId ? (isDemo ? '#DEMO' + orderId.slice(-5).toUpperCase() : `#${orderId.slice(-6).toUpperCase()}`) : '#CO' + Math.floor(Math.random() * 90000 + 10000);
    const eta = isDelivered ? 'Arrived' : '10–15 min';

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={22} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Tracking</Text>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {/* Status Hero */}
                <Card style={styles.statusHero} shadow="md">
                    <View style={styles.statusTop}>
                        <View style={[styles.statusIcon, isDelivered && { backgroundColor: Colors.successLight }]}>
                            <Ionicons
                                name={STEPS[displayStep - 1].icon as any}
                                size={32}
                                color={isDelivered ? Colors.success : Colors.primary}
                            />
                        </View>
                        <View style={styles.statusInfo}>
                            <Text style={styles.statusLabel}>{STEPS[displayStep - 1].label}</Text>
                            <Text style={styles.statusDesc}>{STEPS[displayStep - 1].desc}</Text>
                        </View>
                    </View>
                    <View style={styles.etaRow}>
                        <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                        <Text style={styles.etaText}>Status: <Text style={styles.etaBold}>{isDelivered ? 'Delivered' : eta}</Text></Text>
                    </View>
                </Card>

                {/* QR Section */}
                {!isDelivered && (
                    <Card style={styles.qrCard} shadow="sm">
                        <Text style={styles.qrTitle}>Digital Receipt</Text>
                        <Text style={styles.qrSubtitle}>Show this QR at the counter for pickup</Text>
                        <View style={styles.qrCodeContainer}>
                            <QRCode
                                value={orderId}
                                size={140}
                                color={Colors.text}
                                backgroundColor="transparent"
                            />
                        </View>
                        <Text style={styles.qrOrderId}>{displayOrderId}</Text>
                    </Card>
                )}

                {/* Progress Steps */}
                <Card style={styles.stepsCard} padding={Spacing.xl} shadow="sm">
                    {STEPS.map((step, idx) => {
                        const isCompleted = step.id < displayStep;
                        const isActive = step.id === displayStep;
                        const isPending = step.id > displayStep;

                        return (
                            <View key={step.id} style={styles.stepRow}>
                                <View style={styles.stepIndicator}>
                                    <View
                                        style={[
                                            styles.stepDot,
                                            isCompleted && styles.stepDotCompleted,
                                            isActive && styles.stepDotActive,
                                            isPending && styles.stepDotPending,
                                        ]}
                                    >
                                        {isCompleted ? (
                                            <Ionicons name="checkmark" size={12} color="#FFF" />
                                        ) : isActive ? (
                                            <View style={styles.stepDotInner} />
                                        ) : null}
                                    </View>
                                    {idx < STEPS.length - 1 && (
                                        <View
                                            style={[styles.stepLine, isCompleted && styles.stepLineCompleted]}
                                        />
                                    )}
                                </View>
                                <View style={styles.stepContent}>
                                    <Text style={[styles.stepLabel, isPending && styles.stepLabelPending]}>
                                        {step.label}
                                    </Text>
                                    <Text style={styles.stepDesc}>{step.desc}</Text>
                                    {idx < STEPS.length - 1 && <View style={{ height: Spacing.xl }} />}
                                </View>
                            </View>
                        );
                    })}
                </Card>

                {/* Order Summary */}
                <Card style={styles.summaryCard} shadow="sm">
                    <Text style={styles.summaryTitle}>Order Summary</Text>
                    {isDemo && !orderData ? (
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryItem}>Hackathon Special Combo × 1</Text>
                            <Text style={styles.summaryPrice}>₹70</Text>
                        </View>
                    ) : (
                        orderData?.order_items.map((entry) => (
                            <View key={entry.id} style={styles.summaryRow}>
                                <Text style={styles.summaryItem}>{entry.menu_items?.name || 'Item'} × {entry.quantity}</Text>
                                <Text style={styles.summaryPrice}>₹{entry.unit_price * entry.quantity}</Text>
                            </View>
                        ))
                    )}
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryTotal}>Total Paid</Text>
                        <Text style={styles.summaryTotalPrice}>₹{orderData ? orderData.total_price : 70}</Text>
                    </View>
                </Card>

                {/* Action Buttons */}
                <View style={styles.actionContainer}>
                    {!isDelivered ? (
                        <TouchableOpacity
                            style={[styles.scannedBtn, updateStatus.isPending && styles.btnDisabled]}
                            onPress={handleOrderScanned}
                            disabled={updateStatus.isPending}
                        >
                            <Ionicons name="checkmark-done" size={20} color="#FFF" />
                            <Text style={styles.scannedBtnText}>
                                {updateStatus.isPending ? 'Updating...' : 'Confirm Collection'}
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.reorderBtnMain}
                            onPress={() => { 
                                clearCart(); 
                                clearActiveOrder();
                                router.replace('/(tabs)/food'); 
                            }}
                        >
                            <Ionicons name="restaurant-outline" size={20} color="#FFF" />
                            <Text style={styles.reorderTextMain}>Order Again</Text>
                        </TouchableOpacity>
                    )}

                    {!isDelivered && (
                        <TouchableOpacity
                            style={styles.reorderBtn}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.reorderText}>Back to Canteen</Text>
                        </TouchableOpacity>
                    )}
                </View>
                
                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.sectionBg },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: { ...Typography.h3, color: Colors.text },
    scroll: { padding: Spacing.lg, gap: Spacing.md },
    statusHero: { marginBottom: 0 },
    statusTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
    statusIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusInfo: { flex: 1 },
    statusLabel: { ...Typography.h3, color: Colors.text },
    statusDesc: { ...Typography.body2, color: Colors.textSecondary, marginTop: 4 },
    etaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.sectionBg, borderRadius: Radius.sm, padding: Spacing.sm },
    etaText: { ...Typography.body2, color: Colors.textSecondary },
    etaBold: { fontWeight: '700', color: Colors.text },
    qrCard: {
        alignItems: 'center',
        paddingVertical: Spacing.lg,
    },
    qrTitle: {
        ...Typography.h4,
        color: Colors.text,
        marginBottom: 4,
    },
    qrSubtitle: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginBottom: Spacing.md,
    },
    qrCodeContainer: {
        padding: Spacing.md,
        backgroundColor: '#FFF',
        borderRadius: Radius.lg,
        borderWidth: 1,
        borderColor: Colors.divider,
        marginBottom: Spacing.sm,
    },
    qrOrderId: {
        ...Typography.micro,
        color: Colors.textSecondary,
        fontFamily: 'Sora_700Bold',
        letterSpacing: 1,
    },
    stepsCard: {},
    stepRow: { flexDirection: 'row' },
    stepIndicator: { alignItems: 'center', marginRight: Spacing.lg },
    stepDot: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.border,
        backgroundColor: Colors.cardBg,
    },
    stepDotCompleted: { backgroundColor: Colors.success, borderColor: Colors.success },
    stepDotActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
    stepDotPending: { borderColor: Colors.divider },
    stepDotInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
    stepLine: { width: 2, flex: 1, marginTop: 4, backgroundColor: Colors.divider },
    stepLineCompleted: { backgroundColor: Colors.success },
    stepContent: { flex: 1, paddingTop: 4 },
    stepLabel: { ...Typography.h5, color: Colors.text },
    stepLabelPending: { color: Colors.textSecondary },
    stepDesc: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
    summaryCard: {},
    summaryTitle: { ...Typography.h4, color: Colors.text, marginBottom: Spacing.md },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xs },
    summaryItem: { ...Typography.body2, color: Colors.textSecondary, flex: 1 },
    summaryPrice: { ...Typography.body2, color: Colors.text },
    summaryDivider: { height: 1, backgroundColor: Colors.divider, marginVertical: Spacing.sm },
    summaryTotal: { ...Typography.h5, color: Colors.text },
    summaryTotalPrice: { ...Typography.price, color: Colors.text },
    actionContainer: {
        gap: Spacing.md,
        marginTop: Spacing.sm,
    },
    reorderBtn: {
        backgroundColor: Colors.surface,
        borderRadius: Radius.md,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.divider,
    },
    reorderText: { ...Typography.h5, color: Colors.text, fontWeight: '700' },
    reorderBtnMain: {
        backgroundColor: Colors.primary,
        borderRadius: Radius.md,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    reorderTextMain: { ...Typography.h5, color: '#FFF', fontWeight: '700' },
    scannedBtn: {
        backgroundColor: Colors.success,
        borderRadius: Radius.md,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    scannedBtnText: { ...Typography.h5, color: '#FFF', fontWeight: '700' },
    btnDisabled: { opacity: 0.6 },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.xl,
        gap: Spacing.md,
    },
    emptyTitle: {
        ...Typography.h2,
        color: Colors.text,
        marginTop: Spacing.md,
    },
    emptySubtitle: {
        ...Typography.body1,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    browseBtn: {
        marginTop: Spacing.lg,
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: Radius.pill,
    },
    browseBtnText: {
        ...Typography.h5,
        color: '#FFF',
        fontWeight: '700',
    },
});
