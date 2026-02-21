import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TagPill from '../../src/components/ui/TagPill';
import UrgencyTag from '../../src/components/ui/UrgencyTag';
import { useEvent, useEventSeats, useRegisterEvent } from '../../src/hooks/useEvents';
import { useUserStore } from '../../src/store/userStore';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../src/theme';

export default function EventDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    // Live data from Supabase
    const { data: event, isLoading } = useEvent(id);
    const authUser = useUserStore((s) => s.authUser);
    const registerMutation = useRegisterEvent(authUser?.id ?? null);

    const [localRegistered, setLocalRegistered] = React.useState(false);

    // Live seat count via Supabase Realtime
    const liveRegisteredCount = useEventSeats(id, event?.registered_count ?? 0);
    const seatsLeft = (event?.total_seats ?? 0) - liveRegisteredCount;

    if (isLoading || !event) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color={Colors.primary} />
            </View>
        );
    }

    const tickets = (event.tickets as any[]) ?? [];
    const selectedTicket = tickets[0] ?? { type: 'General', price: 0, available: seatsLeft };
    const registered = localRegistered;

    const handleRegister = () => {
        setLocalRegistered(true);
        if (authUser?.id) {
            registerMutation.mutate({ eventId: event.id, register: true });
        }
    };

    // Derived color for tags
    const getTagVariant = (tag: string) => {
        const lower = tag.toLowerCase();
        if (lower.includes('free')) return 'green';
        if (lower.includes('mobile')) return 'blue';
        if (lower.includes('laptop')) return 'orange';
        if (lower.includes('design') || lower.includes('ui')) return 'purple';
        return 'grey';
    };

    const ticketPriceLabel = selectedTicket.price === 0 ? 'Free' : `₹${selectedTicket.price}`;
    const actionDisabled = registered || seatsLeft <= 0;

    return (
        <View style={styles.flex}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Image source={{ uri: event.image ?? undefined }} style={styles.heroImage} />
                    <View style={styles.heroOverlay} />
                    <SafeAreaView edges={['top']} style={styles.heroHeader}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={20} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareBtn}>
                            <Ionicons name="share-outline" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </SafeAreaView>
                    <View style={styles.heroBadgeRow}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Open for registration</Text>
                        </View>
                        <TouchableOpacity style={styles.roundIcon}>
                            <Ionicons name="heart-outline" size={18} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.heroContent}>
                        <TagPill label={event.category} variant="orange" style={{ marginBottom: Spacing.xs }} />
                        <Text style={styles.heroTitle}>{event.title}</Text>
                        <Text style={styles.heroSubTitle}>{event.organizer} · {event.city ?? 'MIT Manipal'}</Text>
                        <View style={styles.priceRow}>
                            <Text style={styles.heroPrice}>{ticketPriceLabel}</Text>
                            <Text style={styles.heroDetails}>
                                {event.venue} · {event.date}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.detailsCard}>
                    <View style={styles.infoGrid}>
                        {[
                            { icon: 'calendar-outline', label: 'Date', value: event.date },
                            { icon: 'time-outline', label: 'Time', value: event.time },
                            { icon: 'location-outline', label: 'Venue', value: event.venue },
                            { icon: 'person-outline', label: 'Host', value: event.organizer ?? 'Campus' },
                        ].map((info) => (
                            <View key={info.label} style={styles.infoItem}>
                                <Ionicons name={info.icon as any} size={18} color={Colors.primary} />
                                <View>
                                    <Text style={styles.infoLabel}>{info.label}</Text>
                                    <Text style={styles.infoValue} numberOfLines={1}>{info.value}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {seatsLeft < 20 && (
                        <UrgencyTag
                            label={`Only ${seatsLeft} seats remaining!`}
                            variant="danger"
                            style={{ alignSelf: 'stretch', marginBottom: Spacing.lg }}
                        />
                    )}

                    <Text style={styles.sectionTitle}>About this event</Text>
                    <Text style={styles.description}>{event.description}</Text>

                    <View style={styles.tagsRow}>
                        <TagPill label={`${selectedTicket.type} Ticket`} variant="green" size="sm" />
                        {event.tags.slice(0, 3).map((tag) => (
                            <TagPill key={tag} label={tag} variant={getTagVariant(tag) as any} size="sm" />
                        ))}
                    </View>

                    <View style={styles.ctaRow}>
                        <TouchableOpacity style={styles.ctaGhost}>
                            <Text style={styles.ctaGhostText}>Explore in VR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.ctaPrimary, actionDisabled && styles.ctaDisabled]}
                            onPress={handleRegister}
                            disabled={actionDisabled}
                        >
                            <Text style={styles.ctaPrimaryText}>
                                {registered ? 'Registered ✓' : 'Book a Call'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: '#F8F8FA' },
    scroll: { paddingBottom: Spacing.xl },
    hero: {
        height: 360,
        position: 'relative',
        backgroundColor: '#000',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        borderBottomLeftRadius: Radius.xxl,
        borderBottomRightRadius: Radius.xxl,
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderBottomLeftRadius: Radius.xxl,
        borderBottomRightRadius: Radius.xxl,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    heroHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.sm,
    },
    backBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    shareBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroBadgeRow: {
        position: 'absolute',
        top: Spacing.lg * 2,
        left: Spacing.lg,
        right: Spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.md,
    },
    badgeText: {
        color: '#FFF',
        ...Typography.caption,
    },
    roundIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroContent: {
        position: 'absolute',
        bottom: Spacing.lg,
        left: Spacing.lg,
        right: Spacing.lg,
    },
    heroTitle: {
        ...Typography.h2,
        color: '#FFF',
        marginBottom: Spacing.xs,
    },
    heroSubTitle: {
        ...Typography.body2,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: Spacing.sm,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    heroPrice: {
        ...Typography.display,
        color: '#FFF',
    },
    heroDetails: {
        ...Typography.caption,
        color: 'rgba(255,255,255,0.6)',
    },
    detailsCard: {
        marginTop: -Spacing.xl,
        marginHorizontal: Spacing.md,
        backgroundColor: '#FFF',
        borderRadius: Radius.xxl,
        padding: Spacing.lg,
        ...Shadows.lg,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    infoItem: {
        width: '48%',
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    infoLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    infoValue: {
        ...Typography.body2,
        color: Colors.text,
        fontWeight: '600',
    },
    sectionTitle: {
        ...Typography.h4,
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    description: {
        ...Typography.body2,
        color: Colors.textSecondary,
        lineHeight: 22,
        marginBottom: Spacing.lg,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    ctaRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    ctaGhost: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Radius.xl,
        paddingVertical: Spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
    },
    ctaGhostText: {
        ...Typography.body2,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    ctaPrimary: {
        flex: 1,
        borderRadius: Radius.xl,
        paddingVertical: Spacing.sm,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaPrimaryText: {
        ...Typography.body2,
        color: '#FFF',
        fontWeight: '700',
    },
    ctaDisabled: {
        backgroundColor: Colors.border,
    },
});
