import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TagPill from '../src/components/ui/TagPill';
import { useCampusAlerts } from '../src/hooks/useCampusAlerts';
import { Colors, Radius, Spacing, Typography } from '../src/theme';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { width: SW } = Dimensions.get('window');

export default function NotificationsScreen() {
    const { data: alerts = [], isLoading } = useCampusAlerts();

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                {alerts.map((notif) => {
                    return (
                        <TouchableOpacity key={notif.id} style={[styles.notifCardWrap, { backgroundColor: Colors.card, borderColor: Colors.border, borderWidth: 0.5 }]} onPress={() => { }}>
                            <View style={styles.notifCard}>
                                <View style={[styles.iconWrap, { backgroundColor: Colors.secondary }]}>
                                    <Text style={{fontSize: 24}}>{notif.emoji}</Text>
                                </View>
                                <View style={styles.notifContent}>
                                    <View style={styles.titleRow}>
                                        <Text style={[styles.title, { color: Colors.foreground }]}>{notif.title}</Text>
                                        <Text style={[styles.time, { color: Colors.mutedForeground }]}>{dayjs(notif.created_at).fromNow()}</Text>
                                    </View>
                                    <Text style={[styles.desc, { color: Colors.mutedForeground }]}>{notif.description}</Text>

                                    <View style={styles.tagRow}>
                                        <TagPill label={notif.type.toUpperCase()} variant="grey" size="sm" />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}

                <View style={styles.emptyState}>
                    <Ionicons name="checkmark-done-circle-outline" size={48} color={Colors.border} />
                    <Text style={styles.emptyText}>You're all caught up!</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.section,
        paddingVertical: Spacing.md,
        backgroundColor: Colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Colors.divider,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.surface,
        borderWidth: 0.5,
        borderColor: Colors.divider,
    },
    headerTitle: {
        ...Typography.h3,
        color: Colors.text,
    },
    headerRight: {
        width: 40,
    },
    scroll: {
        padding: Spacing.section,
        gap: Spacing.md,
        paddingBottom: 100,
    },
    notifCardWrap: {
        borderRadius: Radius.xl,
        backgroundColor: Colors.cardBg,
    },
    notifCard: {
        flexDirection: 'row',
        padding: Spacing.lg,
        gap: Spacing.md,
    },
    iconWrap: {
        width: 48,
        height: 48,
        borderRadius: Radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notifContent: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    title: {
        ...Typography.h5,
        color: Colors.text,
        flex: 1,
        marginRight: Spacing.sm,
    },
    time: {
        ...Typography.micro,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    desc: {
        ...Typography.body2,
        color: Colors.textSecondary,
        lineHeight: 20,
        marginBottom: Spacing.sm,
    },
    tagRow: {
        flexDirection: 'row',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.xxl,
        opacity: 0.5,
    },
    emptyText: {
        ...Typography.body2,
        color: Colors.textSecondary,
        marginTop: Spacing.sm,
    }
});
