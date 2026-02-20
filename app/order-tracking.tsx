import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../src/components/ui/Card';
import { useCartStore } from '../src/store/cartStore';
import { Colors, Radius, Spacing, Typography } from '../src/theme';

const STEPS = [
    { id: 1, label: 'Order Placed', icon: 'checkmark-circle', desc: 'Your order has been received' },
    { id: 2, label: 'Preparing', icon: 'flame', desc: 'Canteen Central is cooking your food' },
    { id: 3, label: 'Ready for Pickup', icon: 'bag-check', desc: 'Your order is ready at the counter' },
    { id: 4, label: 'Delivered', icon: 'home', desc: 'Enjoy your meal!' },
];

export default function OrderTrackingScreen() {
    const [currentStep, setCurrentStep] = useState(2);
    const items = useCartStore((s) => s.items);
    const totalPrice = useCartStore((s) => s.totalPrice());
    const clearCart = useCartStore((s) => s.clearCart);

    // Simulate progress
    useEffect(() => {
        const timers = [
            setTimeout(() => setCurrentStep(2), 3000),
            setTimeout(() => setCurrentStep(3), 8000),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    const orderId = '#CO' + Math.floor(Math.random() * 90000 + 10000);
    const eta = '15–20 min';

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
                        <View style={styles.statusIcon}>
                            <Ionicons
                                name={STEPS[currentStep - 1].icon as any}
                                size={32}
                                color={Colors.primary}
                            />
                        </View>
                        <View style={styles.statusInfo}>
                            <Text style={styles.statusLabel}>{STEPS[currentStep - 1].label}</Text>
                            <Text style={styles.statusDesc}>{STEPS[currentStep - 1].desc}</Text>
                        </View>
                    </View>
                    <View style={styles.etaRow}>
                        <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                        <Text style={styles.etaText}>Estimated time: <Text style={styles.etaBold}>{eta}</Text></Text>
                    </View>
                </Card>

                {/* Order ID */}
                <View style={styles.orderIdRow}>
                    <Text style={styles.orderIdLabel}>Order</Text>
                    <Text style={styles.orderId}>{orderId}</Text>
                </View>

                {/* Progress Steps */}
                <Card style={styles.stepsCard} padding={Spacing.xl} shadow="sm">
                    {STEPS.map((step, idx) => {
                        const isCompleted = step.id < currentStep;
                        const isActive = step.id === currentStep;
                        const isPending = step.id > currentStep;

                        return (
                            <View key={step.id} style={styles.stepRow}>
                                {/* Line + Dot */}
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
                                {/* Content */}
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
                    {items.length === 0 ? (
                        <Text style={styles.summaryItem}>Rajma Chawal × 1 — ₹70</Text>
                    ) : (
                        items.map((c) => (
                            <View key={c.item.id} style={styles.summaryRow}>
                                <Text style={styles.summaryItem}>{c.item.name} × {c.quantity}</Text>
                                <Text style={styles.summaryPrice}>₹{c.item.price * c.quantity}</Text>
                            </View>
                        ))
                    )}
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryTotal}>Total</Text>
                        <Text style={styles.summaryTotalPrice}>₹{items.length > 0 ? totalPrice : 70}</Text>
                    </View>
                </Card>

                <TouchableOpacity
                    style={styles.reorderBtn}
                    onPress={() => { clearCart(); router.replace('/(tabs)/food'); }}
                >
                    <Text style={styles.reorderText}>Order Again</Text>
                </TouchableOpacity>
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
    orderIdRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 2 },
    orderIdLabel: { ...Typography.body2, color: Colors.textSecondary },
    orderId: { ...Typography.h5, color: Colors.text },
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
    summaryItem: { ...Typography.body2, color: Colors.textSecondary },
    summaryPrice: { ...Typography.body2, color: Colors.text },
    summaryDivider: { height: 1, backgroundColor: Colors.divider, marginVertical: Spacing.sm },
    summaryTotal: { ...Typography.h5, color: Colors.text },
    summaryTotalPrice: { ...Typography.price, color: Colors.text },
    reorderBtn: {
        backgroundColor: Colors.primary,
        borderRadius: Radius.md,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        marginTop: Spacing.xs,
    },
    reorderText: { ...Typography.h5, color: '#FFF', fontWeight: '700' },
});
