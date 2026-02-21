import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '../../src/store/cartStore';
import { useUserStore } from '../../src/store/userStore';
import QRCode from 'react-native-qrcode-svg';
import * as Haptics from 'expo-haptics';
import { Colors, Radius, Spacing, Typography } from '../../src/theme';

function createPaymentCode() {
    return `QR-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export default function CartScreen() {
    const cart = useCartStore();
    const { authUser } = useUserStore();
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [collected, setCollected] = useState(false);

    const items = cart.items;
    const total = useMemo(() => cart.totalPrice(), [cart]);

    const handlePay = async () => {
        if (!items.length) return;
        
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            
            // Use real auth ID, fallback to seeded demo user for hackathon stability
            const userId = authUser?.id ?? '11111111-1111-1111-1111-111111111111';
            
            console.log('Attempting checkout for user:', userId);
            const orderId = await cart.checkout(userId);
            
            setQrCode(createPaymentCode());
            setCollected(false);
            
            Alert.alert("Payment Successful", "Your order has been placed!", [
                { text: "Track Order", onPress: () => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    router.push({ pathname: '/order-tracking', params: { orderId } });
                }}
            ]);
        } catch (error: any) {
            console.error('Checkout failed:', error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert("Error", `Failed to process payment: ${error.message || 'Unknown error'}`);
        }
    };

    const handleCollected = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        cart.clearCart();
        setCollected(true);
        router.replace('/(tabs)/food');
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
                    <Ionicons name="chevron-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Pay & collect</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Cart summary</Text>
                {items.map((entry) => (
                    <View key={entry.item.id} style={styles.lineItem}>
                        <View>
                            <Text style={styles.lineTitle}>{entry.item.name}</Text>
                            <Text style={styles.lineMeta}>
                                {entry.quantity} × ₹{entry.item.price}
                            </Text>
                        </View>
                        <Text style={styles.lineTotal}>₹{entry.item.price * entry.quantity}</Text>
                    </View>
                ))}
                {!items.length && <Text style={styles.empty}>Your cart is empty.</Text>}
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>₹{total}</Text>
                </View>

                {qrCode ? (
                    <View style={styles.qrCard}>
                        <Text style={styles.qrLabel}>Show this QR at collection</Text>
                        <View style={styles.qrCode}>
                            <QRCode
                                value={qrCode}
                                size={180}
                                color={Colors.text}
                                backgroundColor="transparent"
                            />
                        </View>
                        {collected ? (
                            <Text style={styles.scannedText}>Collection confirmed.</Text>
                        ) : (
                            <TouchableOpacity style={styles.scannedBtn} onPress={handleCollected}>
                                <Text style={styles.scannedBtnText}>Mark as collected</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    <TouchableOpacity
                        style={[styles.payBtn, !items.length && styles.payBtnDisabled]}
                        disabled={!items.length}
                        onPress={handlePay}
                    >
                        <Text style={styles.payBtnText}>Pay ₹{total || 0}</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.section,
        paddingVertical: Spacing.sm,
    },
    backIcon: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    title: {
        ...Typography.h2,
        color: Colors.text,
    },
    content: {
        padding: Spacing.section,
    },
    sectionTitle: {
        ...Typography.h4,
        color: Colors.text,
        marginBottom: Spacing.md,
    },
    lineItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
    },
    lineTitle: {
        ...Typography.body1,
        color: Colors.text,
    },
    lineMeta: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    lineTotal: {
        ...Typography.body1,
        fontWeight: '700' as const,
        color: Colors.text,
    },
    empty: {
        ...Typography.body2,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginVertical: Spacing.lg,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Spacing.md,
        paddingVertical: Spacing.sm,
        borderTopWidth: 1,
        borderColor: Colors.divider,
    },
    totalLabel: {
        ...Typography.body2,
        color: Colors.textSecondary,
    },
    totalValue: {
        ...Typography.body1,
        fontWeight: '700' as const,
        color: Colors.text,
    },
    payBtn: {
        marginTop: Spacing.lg,
        backgroundColor: Colors.success,
        paddingVertical: Spacing.md,
        borderRadius: Radius.xl,
        alignItems: 'center',
    },
    payBtnDisabled: {
        backgroundColor: Colors.border,
        opacity: 0.5,
    },
    payBtnText: {
        ...Typography.body1,
        color: '#fff',
        fontWeight: '700' as const,
    },
    qrCard: {
        marginTop: Spacing.lg,
        borderRadius: Radius.xxl,
        padding: Spacing.md,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.divider,
        alignItems: 'center',
    },
    qrLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginBottom: Spacing.sm,
    },
    qrCode: {
        width: 220,
        height: 220,
        borderRadius: Radius.xxl,
        backgroundColor: '#FFF', // Changed to white for better QR contrast
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.divider,
    },
    scannedBtn: {
        backgroundColor: Colors.success,
        borderRadius: Radius.md,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
    },
    scannedBtnText: {
        ...Typography.body1,
        color: '#fff',
        fontWeight: '600' as const,
    },
    scannedText: {
        ...Typography.body2,
        color: Colors.success,
    },
});
