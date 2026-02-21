import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { Colors, Radius, Spacing, Typography } from '../../src/theme';

const PRINT_PRICE = 45;

const createPaymentCode = () =>
    `PRT-${Date.now().toString().slice(6)}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export default function PrintPaymentScreen() {
    const params = useLocalSearchParams<{ doc?: string; slot?: string }>();
    const doc = params.doc;
    const slot = params.slot;
    const documentName = doc ?? 'Print request';
    const slotWindow = slot ?? '—';
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [collected, setCollected] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const handlePay = () => {
        if (!doc || !slot) {
            setStatus('Please upload a PDF and pick a slot before paying.');
            return;
        }
        setQrCode(createPaymentCode());
        setCollected(false);
        setStatus('Present the QR at the stationery counter.');
    };

    const handleCollected = () => {
        setCollected(true);
        setStatus('Collection confirmed. Thanks!');
    };

    const total = useMemo(() => PRINT_PRICE, []);

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Print payment</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Pickup details</Text>
                <View style={styles.lineItem}>
                    <View>
                        <Text style={styles.lineTitle}>{documentName}</Text>
                        <Text style={styles.lineMeta}>Slot: {slotWindow}</Text>
                    </View>
                    <Text style={styles.lineTotal}>₹{PRINT_PRICE}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>₹{total}</Text>
                </View>
                {qrCode ? (
                    <View style={styles.qrCard}>
                        <Text style={styles.qrLabel}>Show QR at collection</Text>
                        <View style={styles.qrCode}>
                            <QRCode
                                value={qrCode}
                                size={180}
                                color={Colors.text}
                                backgroundColor="transparent"
                            />
                        </View>
                        <Text style={styles.qrSlot}>Slot: {slotWindow}</Text>
                        <Text style={styles.statusMessage}>{status}</Text>
                        {collected ? (
                            <Text style={styles.collectedText}>Collected</Text>
                        ) : (
                            <TouchableOpacity style={styles.scannedBtn} onPress={handleCollected}>
                                <Text style={styles.scannedBtnText}>Mark as collected</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ) : (
                    <TouchableOpacity style={styles.payBtn} onPress={handlePay}>
                        <Text style={styles.payBtnText}>Pay ₹{total}</Text>
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
        borderBottomWidth: 1,
        borderColor: Colors.divider,
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
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: Spacing.md,
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
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
    payBtnText: {
        ...Typography.body1,
        color: '#fff',
        fontWeight: '700' as const,
    },
    qrCard: {
        marginTop: Spacing.lg,
        padding: Spacing.lg,
        borderRadius: Radius.xxl,
        borderWidth: 1,
        borderColor: Colors.divider,
        backgroundColor: Colors.surface,
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
        backgroundColor: '#111',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    qrText: {
        ...Typography.body2,
        color: '#fff',
        letterSpacing: 1.4,
        textAlign: 'center',
    },
    qrSlot: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginBottom: Spacing.sm,
    },
    statusMessage: {
        ...Typography.body2,
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    collectedText: {
        ...Typography.body2,
        color: Colors.success,
        fontWeight: '600' as const,
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
});
