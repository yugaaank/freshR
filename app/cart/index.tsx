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
            
            setQrCode(orderId);
            setCollected(false);
            
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (error: any) {
            console.error('Checkout failed:', error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert("Error", `Failed to process payment: ${error.message || 'Unknown error'}`);
        }
    };

    const handleCollected = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        cart.clearActiveOrder();
        setCollected(true);
        router.replace('/(tabs)/food');
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
                    <Ionicons name="chevron-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Cart summary</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {!qrCode && (
                    <>
                        <Text style={styles.sectionTitle}>Review your items</Text>
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
                        {!items.length && !qrCode && <Text style={styles.empty}>Your cart is empty.</Text>}
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total Payable</Text>
                            <Text style={styles.totalValue}>₹{total}</Text>
                        </View>
                    </>
                )}

                {qrCode ? (
                    <View style={styles.qrCard}>
                        <Ionicons name="checkmark-circle" size={48} color={Colors.success} style={{ marginBottom: 12 }} />
                        <Text style={styles.successTitle}>Payment Successful!</Text>
                        <Text style={styles.qrLabel}>Show this QR at the counter for collection</Text>
                        <View style={styles.qrCode}>
                            <QRCode
                                value={qrCode}
                                size={180}
                                color={Colors.text}
                                backgroundColor="transparent"
                            />
                        </View>
                        <Text style={styles.orderIdText}>Order ID: #{qrCode.slice(-6).toUpperCase()}</Text>
                        
                        <View style={styles.qrActions}>
                            <TouchableOpacity style={styles.scannedBtn} onPress={handleCollected}>
                                <Text style={styles.scannedBtnText}>I have collected my food</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.trackLink} 
                                onPress={() => router.push({ pathname: '/order-tracking', params: { orderId: qrCode } })}
                            >
                                <Text style={styles.trackLinkText}>View detailed tracking status</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={[styles.payBtn, !items.length && styles.payBtnDisabled]}
                        disabled={!items.length}
                        onPress={handlePay}
                    >
                        <Text style={styles.payBtnText}>Pay & Place Order · ₹{total || 0}</Text>
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
        marginTop: Spacing.sm,
        borderRadius: Radius.xxl,
        padding: Spacing.xl,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.divider,
        alignItems: 'center',
    },
    successTitle: {
        ...Typography.h3,
        color: Colors.text,
        marginBottom: 8,
    },
    qrLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginBottom: Spacing.lg,
        textAlign: 'center',
    },
    qrCode: {
        padding: Spacing.md,
        borderRadius: Radius.lg,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.divider,
    },
    orderIdText: {
        ...Typography.micro,
        color: Colors.textSecondary,
        fontFamily: 'Sora_700Bold',
        letterSpacing: 1,
        marginBottom: Spacing.xl,
    },
    qrActions: {
        width: '100%',
        gap: Spacing.md,
        alignItems: 'center',
    },
    scannedBtn: {
        backgroundColor: Colors.success,
        borderRadius: Radius.pill,
        paddingVertical: Spacing.md,
        width: '100%',
        alignItems: 'center',
    },
    scannedBtnText: {
        ...Typography.body1,
        color: '#fff',
        fontWeight: '700' as const,
    },
    trackLink: {
        paddingVertical: Spacing.sm,
    },
    trackLinkText: {
        ...Typography.caption,
        color: Colors.primary,
        fontFamily: 'Sora_600SemiBold',
        textDecorationLine: 'underline',
    },
});
