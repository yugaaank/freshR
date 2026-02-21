import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StatusBar,
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
import { Colors, Radius, Spacing, Typography, Palette, Gradients } from '../../src/theme';
import * as Haptics from 'expo-haptics';

export default function EventDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    // Live data from Supabase
    const { data: event, isLoading } = useEvent(id);
    const { authUser, registeredEvents, registerEvent: registerInStore, unregisterEvent } = useUserStore();
    const registerMutation = useRegisterEvent(authUser?.id ?? null);

    const isAlreadyRegistered = registeredEvents.includes(id);
    const [justRegistered, setJustRegistered] = React.useState(false);

    const registered = isAlreadyRegistered || justRegistered;

    // Live seat count via Supabase Realtime
    const liveRegisteredCount = useEventSeats(id, event?.registered_count ?? 0);
    const seatsLeft = (event?.total_seats ?? 0) - liveRegisteredCount;

    if (isLoading || !event) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.background }}>
                <ActivityIndicator color={Colors.primary} />
            </View>
        );
    }

    const tickets = (event.tickets as any[]) ?? [];
    const selectedTicket = tickets[0] ?? { type: 'General', price: 0, available: seatsLeft };

    const handleRegister = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (registered) {
            // Provide a way to unregister if already registered
            unregisterEvent(event.id);
            if (authUser?.id) {
                registerMutation.mutate({ eventId: event.id, register: false });
            }
            setJustRegistered(false);
            return;
        }
        
        setJustRegistered(true);
        registerInStore(event.id, event.category);
        
        if (authUser?.id) {
            registerMutation.mutate({ eventId: event.id, register: true });
        }
    };

    const getTagVariant = (tag: string) => {
        const lower = tag.toLowerCase();
        if (lower.includes('free')) return 'green';
        if (lower.includes('mobile')) return 'blue';
        if (lower.includes('laptop')) return 'orange';
        if (lower.includes('design') || lower.includes('ui')) return 'purple';
        return 'grey';
    };

    const ticketPriceLabel = selectedTicket.price === 0 ? 'Free' : `₹${selectedTicket.price}`;
    const actionDisabled = !registered && seatsLeft <= 0;

    return (
        <View style={styles.flex}>
            <StatusBar barStyle="light-content" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <View style={styles.hero}>
                    <Image source={{ uri: event.image ?? undefined }} style={styles.heroImage} />
                    <LinearGradient colors={['rgba(5,5,5,0.2)', 'rgba(5,5,5,0.9)']} style={styles.heroOverlay} />
                    <SafeAreaView edges={['top']} style={styles.heroHeader}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={20} color={Colors.textLight} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareBtn}>
                            <Ionicons name="share-outline" size={20} color={Colors.textLight} />
                        </TouchableOpacity>
                    </SafeAreaView>
                    <View style={styles.heroBadgeRow}>
                        <View style={[styles.badge, registered && { backgroundColor: Colors.success, borderColor: Colors.success }]}>
                            <Text style={[styles.badgeText, registered && { color: Colors.textLight }]}>
                                {registered ? 'RSVP Confirmed ✓' : 'Open for registration'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.heroContent}>
                        <TagPill label={event.category} variant="teal" style={{ marginBottom: Spacing.xs }} />
                        <Text style={styles.heroTitle}>{event.title}</Text>
                        <Text style={styles.heroSubTitle}>{event.organizer} · {event.city ?? 'Campus'}</Text>
                        <View style={styles.priceRow}>
                            <Text style={styles.heroPrice}>{ticketPriceLabel}</Text>
                            <Text style={styles.heroDetails}>
                                {event.venue}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.detailsCard}>
                    <View style={styles.infoGrid}>
                        {[
                            { icon: 'calendar-outline', label: 'Date', value: event.date, color: Palette[0].icon },
                            { icon: 'time-outline', label: 'Time', value: event.time, color: Palette[1].icon },
                            { icon: 'location-outline', label: 'Venue', value: event.venue, color: Palette[2].icon },
                            { icon: 'person-outline', label: 'Host', value: event.organizer ?? 'Campus', color: Palette[3].icon },
                        ].map((info) => (
                            <View key={info.label} style={styles.infoItem}>
                                <View style={[styles.infoIconWrap, { backgroundColor: info.color + '15' }]}>
                                    <Ionicons name={info.icon as any} size={18} color={info.color} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.infoLabel}>{info.label}</Text>
                                    <Text style={styles.infoValue} numberOfLines={1}>{info.value}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {seatsLeft < 20 && !registered && (
                        <UrgencyTag
                            label={`Only ${seatsLeft} seats remaining!`}
                            variant="danger"
                            style={{ alignSelf: 'stretch', marginBottom: Spacing.md }}
                        />
                    )}

                    <View style={styles.capacityContainer}>
                        <View style={styles.capacityHeader}>
                            <Text style={styles.capacityLabel}>Event Capacity</Text>
                            <Text style={styles.capacityValue}>{liveRegisteredCount} / {event.total_seats}</Text>
                        </View>
                        <View style={styles.progressBarBg}>
                            <View 
                                style={[
                                    styles.progressBarFill, 
                                    { 
                                        width: `${Math.min(100, (liveRegisteredCount / event.total_seats) * 100)}%`,
                                        backgroundColor: registered ? '#39d353' : '#26a641'
                                    }
                                ]} 
                            />
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>About this event</Text>
                    <Text style={styles.description}>{event.description}</Text>

                    <View style={styles.tagsRow}>
                        <TagPill label={`${selectedTicket.type} Ticket`} variant="green" size="sm" />
                        {event.tags.slice(0, 3).map((tag, idx) => (
                            <TagPill key={tag} label={tag} variant={getTagVariant(tag) as any} size="sm" />
                        ))}
                    </View>

                    <View style={styles.ctaRow}>
                        <TouchableOpacity
                            style={[
                                styles.ctaPrimary, 
                                actionDisabled && styles.ctaDisabled,
                                registered && { backgroundColor: Colors.error }
                            ]}
                            onPress={handleRegister}
                            disabled={actionDisabled}
                        >
                            <Text style={styles.ctaPrimaryText}>
                                {registered ? 'Cancel Registration' : 'Register Now'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ height: 60 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: Colors.background },
    scroll: { paddingBottom: Spacing.xl },
    hero: { height: 360, position: 'relative', backgroundColor: Colors.darkBg },
    heroImage: { width: '100%', height: '100%', borderBottomLeftRadius: Radius.xxl, borderBottomRightRadius: Radius.xxl },
    heroOverlay: { ...StyleSheet.absoluteFillObject, borderBottomLeftRadius: Radius.xxl, borderBottomRightRadius: Radius.xxl },
    heroHeader: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
    backBtn: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: Colors.glassDark, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.highlight },
    shareBtn: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: Colors.glassDark, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.highlight },
    heroBadgeRow: { position: 'absolute', top: Spacing.lg * 2, left: Spacing.lg, right: Spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    badge: { backgroundColor: Colors.glassDark, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.highlight },
    badgeText: { color: Colors.textLight, ...Typography.micro, fontFamily: 'Sora_700Bold' },
    heroContent: { position: 'absolute', bottom: Spacing.lg, left: Spacing.lg, right: Spacing.lg },
    heroTitle: { ...Typography.h2, color: Colors.textLight, marginBottom: Spacing.xs },
    heroSubTitle: { ...Typography.body2, color: Colors.textDimmed, marginBottom: Spacing.sm, fontFamily: 'Sora_600SemiBold' },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    heroPrice: { ...Typography.display, color: Colors.accent },
    heroDetails: { ...Typography.micro, color: Colors.textDimmed, fontFamily: 'Sora_600SemiBold' },
    detailsCard: { marginTop: -Spacing.xl, marginHorizontal: Spacing.section, backgroundColor: Colors.sectionBg, borderRadius: Radius.xxl, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.divider },
    infoGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: Spacing.lg, marginBottom: Spacing.lg },
    infoItem: { width: '48%', flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
    infoIconWrap: { width: 36, height: 36, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
    infoLabel: { ...Typography.micro, color: Colors.textSecondary, textTransform: 'uppercase' },
    infoValue: { ...Typography.body2, color: Colors.text, fontFamily: 'Sora_600SemiBold' },
    sectionTitle: { ...Typography.h4, color: Colors.text, marginBottom: Spacing.sm },
    description: { ...Typography.body2, color: Colors.textSecondary, lineHeight: 22, marginBottom: Spacing.lg },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
    ctaRow: { flexDirection: 'row', marginTop: Spacing.sm },
    ctaPrimary: { flex: 1, borderRadius: Radius.xl, paddingVertical: Spacing.md, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
    ctaPrimaryText: { ...Typography.h5, color: Colors.textLight, fontFamily: 'Sora_700Bold' },
    ctaDisabled: { backgroundColor: Colors.border },
    capacityContainer: { marginBottom: Spacing.lg, gap: 8 },
    capacityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
    capacityLabel: { ...Typography.caption, color: Colors.textSecondary, fontFamily: 'Sora_600SemiBold' },
    capacityValue: { ...Typography.caption, color: Colors.text, fontFamily: 'Sora_700Bold' },
    progressBarBg: { height: 8, backgroundColor: Colors.surface, borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: Colors.divider },
    progressBarFill: { height: '100%', borderRadius: 4 },
});
