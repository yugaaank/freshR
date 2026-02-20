import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomActionBar from '../../src/components/ui/BottomActionBar';
import TagPill from '../../src/components/ui/TagPill';
import UrgencyTag from '../../src/components/ui/UrgencyTag';
import { events } from '../../src/data/events';
import { Colors, Radius, Spacing, Typography } from '../../src/theme';

export default function EventDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const event = events.find((e) => e.id === id) ?? events[0];
    const [selectedTicket, setSelectedTicket] = useState(0);
    const [registered, setRegistered] = useState(event.isRegistered);

    const ticket = event.tickets[selectedTicket];

    // Derived color for tags
    const getTagVariant = (tag: string) => {
        const lower = tag.toLowerCase();
        if (lower.includes('free')) return 'green';
        if (lower.includes('mobile')) return 'blue';
        if (lower.includes('laptop')) return 'orange';
        if (lower.includes('design') || lower.includes('ui')) return 'purple';
        return 'grey';
    };

    return (
        <View style={styles.flex}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {/* Hero */}
                <View style={styles.hero}>
                    <Image source={{ uri: event.image }} style={styles.heroImage} />
                    <View style={styles.heroOverlay} />
                    <SafeAreaView edges={['top']} style={styles.heroHeader}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={20} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.shareBtn}>
                            <Ionicons name="share-outline" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </SafeAreaView>
                    <View style={styles.heroContent}>
                        <TagPill
                            label={event.category}
                            variant="orange"
                            style={{ marginBottom: Spacing.sm }}
                        />
                        <Text style={styles.heroTitle}>{event.title}</Text>
                        <View style={styles.heroMetaSpacing}>
                            <View style={styles.heroMeta}>
                                <Ionicons name="people-outline" size={13} color="rgba(255,255,255,0.8)" />
                                <Text style={styles.heroMetaText}>{event.attendees} attending</Text>
                            </View>

                            {/* Who's Attending Avatar Snippet */}
                            <View style={styles.attendeesSnippet}>
                                <Image source={{ uri: 'https://i.pravatar.cc/100?img=1' }} style={[styles.avatarStack, { marginLeft: 0 }]} />
                                <Image source={{ uri: 'https://i.pravatar.cc/100?img=2' }} style={styles.avatarStack} />
                                <Image source={{ uri: 'https://i.pravatar.cc/100?img=3' }} style={styles.avatarStack} />
                                <View style={styles.avatarMore}>
                                    <Text style={styles.avatarMoreText}>+{(event.attendees ?? 42) - 3}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Details Card */}
                <View style={styles.detailsCard}>
                    {/* Date/Time/Venue */}
                    <View style={styles.infoGrid}>
                        {[
                            { icon: 'calendar-outline', label: 'Date', value: event.date },
                            { icon: 'time-outline', label: 'Time', value: event.time },
                            { icon: 'location-outline', label: 'Venue', value: event.venue },
                            { icon: 'person-outline', label: 'By', value: event.organizer },
                        ].map((info) => (
                            <View key={info.label} style={styles.infoItem}>
                                <Ionicons name={info.icon as any} size={16} color={Colors.primary} />
                                <View>
                                    <Text style={styles.infoLabel}>{info.label}</Text>
                                    <Text style={styles.infoValue} numberOfLines={1}>{info.value}</Text>
                                </View>
                            </View>
                        ))}
                    </View>

                    {event.seatsLeft < 20 && (
                        <UrgencyTag
                            label={`Only ${event.seatsLeft} seats remaining!`}
                            variant="danger"
                            style={{ alignSelf: 'stretch', marginBottom: Spacing.lg }}
                        />
                    )}

                    {/* Description */}
                    <Text style={styles.sectionTitle}>About this event</Text>
                    <Text style={styles.description}>{event.description}</Text>

                    {/* Tags */}
                    <View style={styles.tagsRow}>
                        {event.tags.map((tag) => (
                            <TagPill key={tag} label={tag} variant={getTagVariant(tag) as any} size="sm" />
                        ))}
                    </View>

                    {/* Ticket Selection */}
                    <Text style={[styles.sectionTitle, { marginTop: Spacing.lg }]}>Select Ticket</Text>
                    {event.tickets.map((t, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={[styles.ticketRow, selectedTicket === idx && styles.ticketRowActive]}
                            onPress={() => setSelectedTicket(idx)}
                        >
                            <View style={styles.ticketLeft}>
                                <View style={[styles.radio, selectedTicket === idx && styles.radioActive]}>
                                    {selectedTicket === idx && <View style={styles.radioDot} />}
                                </View>
                                <View>
                                    <Text style={styles.ticketType}>{t.type}</Text>
                                    <Text style={styles.ticketAvail}>{t.available} available</Text>
                                </View>
                            </View>
                            <Text style={styles.ticketPrice}>
                                {t.price === 0 ? 'Free' : `₹${t.price}`}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ height: 90 }} />
            </ScrollView>

            {/* Sticky Gradient CTA Overlay */}
            <View style={styles.bottomOverlayWrap} pointerEvents="box-none">
                <LinearGradient
                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)', '#FFFFFF']}
                    style={StyleSheet.absoluteFill}
                    pointerEvents="none"
                />
                <BottomActionBar
                    leftLabel={ticket.price === 0 ? 'Free Entry' : `₹${ticket.price}`}
                    leftSubLabel={registered ? '✅ Registered' : `${ticket.available} spots left`}
                    buttonLabel={registered ? 'Registered ✓' : 'Register Now'}
                    onPress={() => setRegistered(true)}
                    disabled={registered}
                    style={{ backgroundColor: 'transparent', borderTopWidth: 0, shadowOpacity: 0, elevation: 0 }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: Colors.background },
    scroll: { paddingBottom: Spacing.xl },
    hero: { height: 280, position: 'relative' },
    heroImage: { width: '100%', height: '100%' },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
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
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    shareBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroContent: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Spacing.lg,
        paddingBottom: Spacing.xl,
    },
    heroTitle: { ...Typography.h2, color: '#FFF', marginBottom: 6 },
    heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    heroMetaText: { ...Typography.caption, color: 'rgba(255,255,255,0.8)' },
    detailsCard: {
        backgroundColor: Colors.cardBg,
        borderTopLeftRadius: Radius.xl,
        borderTopRightRadius: Radius.xl,
        marginTop: -Spacing.xl,
        padding: Spacing.lg,
    },
    infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.lg },
    infoItem: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, width: '48%' },
    infoLabel: { ...Typography.caption, color: Colors.textSecondary },
    infoValue: { ...Typography.body2, color: Colors.text, fontWeight: '500' },
    sectionTitle: { ...Typography.h4, color: Colors.text, marginBottom: Spacing.sm },
    description: { ...Typography.body2, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.md },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
    ticketRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
        borderRadius: Radius.md,
        borderWidth: 1.5,
        borderColor: Colors.border,
        marginBottom: Spacing.sm,
    },
    ticketRowActive: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
    ticketLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioActive: { borderColor: Colors.primary },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
    ticketType: { ...Typography.body2, color: Colors.text, fontWeight: '600' },
    ticketAvail: { ...Typography.caption, color: Colors.textSecondary },
    ticketPrice: { ...Typography.price, color: Colors.primary },
    heroMetaSpacing: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
    attendeesSnippet: { flexDirection: 'row', alignItems: 'center' },
    avatarStack: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: '#1A1A2E', marginLeft: -8 },
    avatarMore: { width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: '#1A1A2E', marginLeft: -8, alignItems: 'center', justifyContent: 'center' },
    avatarMoreText: { ...Typography.micro, fontSize: 8, color: Colors.text },
    bottomOverlayWrap: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: 40,
        zIndex: 100,
    }
});
