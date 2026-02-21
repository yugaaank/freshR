import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, {
    FadeInDown,
    Layout,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import TagPill from '../src/components/ui/TagPill';
import { Colors, Radius, Shadows, Spacing, Typography } from '../src/theme';

const { width: SW } = Dimensions.get('window');

const NOTIFICATIONS = [
    {
        id: 'n1',
        type: 'assignment',
        title: 'Pending Assignment',
        desc: 'Database Systems Lab 4 is due in 3 hours.',
        time: '2 hours ago',
        icon: 'document-text',
        color: Colors.errorLight,
        iconColor: Colors.error,
        tag: 'Urgent'
    },
    {
        id: 'n2',
        type: 'result',
        title: 'Results Announced',
        desc: 'Mid-term results for Compiler Design are out. Tap to view your score.',
        time: '5 hours ago',
        icon: 'school',
        color: Colors.successLight,
        iconColor: Colors.success,
        tag: 'Academic'
    },
    {
        id: 'n3',
        type: 'maintenance',
        title: 'Server Maintenance',
        desc: 'The campus WiFi will be under maintenance tonight from 2 AM to 4 AM.',
        time: 'Yesterday',
        icon: 'construct',
        color: '#FFF8F0',
        iconColor: '#FF6B35',
        tag: 'Campus'
    },
    {
        id: 'n4',
        type: 'event',
        title: 'Event Registration Closing',
        desc: 'Last chance to register for the Annual Hackathon. Only 5 slots left.',
        time: 'Yesterday',
        icon: 'calendar',
        color: '#F0FAFB',
        iconColor: '#0891B2',
        tag: 'Event'
    }
];

const AnimatedLayout = Animated.createAnimatedComponent(View);
const AnimatedContent = Animated.createAnimatedComponent(View);

function SpringCard({ children, style, onPress, delay = 0 }: any) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value
    }));

    const content = (
        <AnimatedContent style={[{ flex: 1 }, animatedStyle]}>
            {children}
        </AnimatedContent>
    );

    if (!onPress) {
        return (
            <AnimatedLayout layout={Layout.springify()} entering={FadeInDown.delay(delay).springify().damping(14)} style={style}>
                {content}
            </AnimatedLayout>
        );
    }

    return (
        <AnimatedLayout layout={Layout.springify()} entering={FadeInDown.delay(delay).springify().damping(14)} style={style}>
            <Pressable
                onPressIn={() => {
                    scale.value = withSpring(0.95, { damping: 12, stiffness: 250 });
                    opacity.value = withSpring(0.9, { damping: 12, stiffness: 250 });
                }}
                onPressOut={() => {
                    scale.value = withSpring(1, { damping: 14, stiffness: 200 });
                    opacity.value = withSpring(1, { damping: 14, stiffness: 200 });
                }}
                onPress={onPress}
                style={{ flex: 1 }}
            >
                {content}
            </Pressable>
        </AnimatedLayout>
    );
}

export default function NotificationsScreen() {
    return (
        <SafeAreaView style={styles.safe}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={styles.headerRight} />
            </View>

            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                {NOTIFICATIONS.map((notif, idx) => (
                    <SpringCard key={notif.id} delay={100 + idx * 50} style={styles.notifCardWrap} onPress={() => { }}>
                        <View style={styles.notifCard}>
                            <View style={[styles.iconWrap, { backgroundColor: notif.color }]}>
                                <Ionicons name={notif.icon as any} size={24} color={notif.iconColor} />
                            </View>
                            <View style={styles.notifContent}>
                                <View style={styles.titleRow}>
                                    <Text style={styles.title}>{notif.title}</Text>
                                    <Text style={styles.time}>{notif.time}</Text>
                                </View>
                                <Text style={styles.desc}>{notif.desc}</Text>

                                <View style={styles.tagRow}>
                                    <TagPill label={notif.tag} variant={notif.type === 'assignment' ? 'red' : notif.type === 'result' ? 'green' : notif.type === 'maintenance' ? 'orange' : 'teal'} size="sm" />
                                </View>
                            </View>
                        </View>
                    </SpringCard>
                ))}

                <View style={styles.emptyState}>
                    <Ionicons name="checkmark-done-circle-outline" size={48} color={Colors.border} />
                    <Text style={styles.emptyText}>You're all caught up!</Text>
                </View>
            </Animated.ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.section,
        paddingVertical: Spacing.md,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.surface,
        ...Shadows.sm,
        shadowOpacity: 0.05,
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
        backgroundColor: '#FFF',
        ...Shadows.sm,
        shadowOpacity: 0.04,
    },
    notifCard: {
        flexDirection: 'row',
        padding: Spacing.lg,
        gap: Spacing.md,
    },
    iconWrap: {
        width: 48,
        height: 48,
        borderRadius: 24,
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
