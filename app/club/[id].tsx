import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import {
    Image,
    ImageBackground,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInUp, SlideInRight } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHybridStore } from '../../src/store/hybridStore';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../src/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function ClubProfileScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { getClubDetails, user, followClub } = useHybridStore();

    const { club, events } = useMemo(() => getClubDetails(id), [id, getClubDetails]);
    const isFollowing = user.followedClubs.includes(id);

    if (!club) return null;

    // Sort events by date natively (dummy sort for tracklist feel)
    const sortedEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Fallback to determine type visually
    const isTech = club.vibeTag.toLowerCase().includes('tech');
    const clubType = isTech ? 'Department' : 'Club';

    return (
        <View style={styles.flex}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView edges={['top']} style={styles.safe}>
                <View style={styles.topNav}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
                        <Ionicons name="arrow-back" size={24} color={Colors.text} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <Animated.View style={styles.albumHeaderContainer} entering={FadeInUp.springify()}>
                    {/* Full Bleed Banner */}
                    <ImageBackground source={{ uri: club.banner }} style={styles.headerBanner}>
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.85)', Colors.background]}
                            locations={[0, 0.6, 1]}
                            style={styles.headerGradient}
                        />
                    </ImageBackground>

                    {/* Content overlapping banner */}
                    <View style={styles.albumInfoWrap}>
                        <View style={styles.logoTitleRow}>
                            <Image source={{ uri: club.logo }} style={styles.floatingLogo} />
                            <View style={styles.albumInfoText}>
                                <Text style={styles.albumTitle} numberOfLines={2}>{club.name}</Text>
                                <Text style={styles.albumMeta}>{clubType} • {club.followersCount} Followers</Text>
                            </View>
                        </View>

                        <View style={styles.actionRow}>
                            <TouchableOpacity
                                style={[styles.followBtn, isFollowing && styles.followBtnActive]}
                                onPress={() => followClub(club.id)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.followBtnText, isFollowing && styles.followBtnTextActive]}>
                                    {isFollowing ? 'Following' : 'Follow'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>

                {/* Section Header for Events */}
                <View style={styles.eventsHeader}>
                    <Text style={styles.eventsSectionTitle}>Upcoming Events</Text>
                </View>

                <View style={styles.tracklist}>
                    {sortedEvents.map((ev, index) => {
                        const isRegistered = user.registeredEvents.includes(ev.id);

                        return (
                            <AnimatedTouchable
                                key={ev.id}
                                entering={SlideInRight.delay(index * 50).springify()}
                                style={styles.premiumEventCard}
                                onPress={() => router.push(`/event/${ev.id}` as any)}
                                activeOpacity={0.7}
                            >
                                {ev.mediaAssets && ev.mediaAssets.length > 0 && (
                                    <View style={styles.eventImageBannerWrap}>
                                        <Image source={{ uri: ev.mediaAssets[0] }} style={styles.eventImageBanner} />
                                        <View style={styles.eventDateBadgeOverlay}>
                                            <Text style={styles.eventDateMonthOverlay}>
                                                {new Date(ev.date).toLocaleString('default', { month: 'short' }).toUpperCase()}
                                            </Text>
                                            <Text style={styles.eventDateDayOverlay}>
                                                {new Date(ev.date).getDate()}
                                            </Text>
                                        </View>
                                    </View>
                                )}

                                <View style={styles.eventRowContent}>
                                    {(!ev.mediaAssets || ev.mediaAssets.length === 0) && (
                                        <View style={styles.eventDateBadgeTextOnly}>
                                            <Text style={styles.eventDateMonthTextOnly}>
                                                {new Date(ev.date).toLocaleString('default', { month: 'short' }).toUpperCase()}
                                            </Text>
                                            <Text style={styles.eventDateDayTextOnly}>
                                                {new Date(ev.date).getDate()}
                                            </Text>
                                        </View>
                                    )}
                                    <View style={styles.eventTextWrap}>
                                        <Text style={[styles.eventTitle, isRegistered && { color: Colors.primary }]} numberOfLines={2}>
                                            {ev.title}
                                        </Text>

                                        <View style={styles.eventMetaRow}>
                                            {isRegistered ? (
                                                <View style={styles.registeredBadge}>
                                                    <Text style={styles.registeredText}>REGISTERED</Text>
                                                </View>
                                            ) : null}
                                            <Text style={styles.eventSubtitle} numberOfLines={1}>
                                                {ev.time} • {ev.location}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </AnimatedTouchable>
                        );
                    })}
                </View>

                {/* Footer Padding */}
                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: Colors.background },
    safe: { backgroundColor: Colors.background },
    topNav: {
        height: 50,
        justifyContent: 'center',
        paddingHorizontal: Spacing.section,
    },
    navBtn: { width: 40, height: 40, justifyContent: 'center' },
    scroll: { paddingBottom: 40 },

    // Album Header Redesign
    albumHeaderContainer: {
        position: 'relative',
        width: '100%',
    },
    headerBanner: {
        width: '100%',
        height: 250,
        backgroundColor: Colors.surface,
    },
    headerGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    albumInfoWrap: {
        paddingHorizontal: Spacing.section,
        marginTop: -60, // Overlap the banner slightly
    },
    logoTitleRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: Spacing.lg,
    },
    floatingLogo: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.surface,
        borderWidth: 3,
        borderColor: Colors.background,
        ...Shadows.md,
        marginRight: Spacing.md,
    },
    albumInfoText: {
        flex: 1,
        paddingBottom: 4, // Align text neatly next to the circular logo
    },
    albumTitle: {
        ...Typography.h2,
        color: '#FFF',
        marginBottom: 4,
    },
    albumMeta: {
        ...Typography.caption,
        color: 'rgba(255,255,255,0.7)',
    },

    // Action Row
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginBottom: Spacing.sm,
    },
    followBtn: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderRadius: Radius.pill,
        paddingHorizontal: 24,
        paddingVertical: 10,
    },
    followBtnActive: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary,
    },
    followBtnText: {
        ...Typography.label,
        color: '#FFF',
        fontWeight: 'bold',
    },
    followBtnTextActive: {
        color: '#FFF',
    },

    eventsHeader: {
        paddingHorizontal: Spacing.section,
        marginTop: Spacing.xl,
        marginBottom: Spacing.md,
    },
    eventsSectionTitle: {
        ...Typography.h3,
        color: Colors.text,
    },

    // Tracklist (Premium Event Cards)
    tracklist: {
        paddingHorizontal: Spacing.section,
    },
    premiumEventCard: {
        marginBottom: Spacing.lg,
        backgroundColor: Colors.surface,
        borderRadius: Radius.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
    },
    eventImageBannerWrap: {
        width: '100%',
        height: 140,
        position: 'relative',
    },
    eventImageBanner: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.borderStrong,
    },
    eventDateBadgeOverlay: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        width: 46,
        height: 52,
        backgroundColor: '#FFF',
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    eventDateMonthOverlay: {
        ...Typography.micro,
        color: Colors.primary,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    eventDateDayOverlay: {
        ...Typography.h4,
        color: '#000',
        lineHeight: 20,
    },
    eventRowContent: {
        flexDirection: 'row',
        padding: Spacing.md,
        alignItems: 'center',
    },
    eventTextWrap: {
        flex: 1,
    },
    eventDateBadgeTextOnly: {
        width: 50,
        height: 56,
        backgroundColor: 'rgba(255,107,53,0.1)',
        borderRadius: Radius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(255,107,53,0.2)',
    },
    eventDateMonthTextOnly: {
        ...Typography.micro,
        color: Colors.primary,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    eventDateDayTextOnly: {
        ...Typography.h4,
        color: Colors.primary,
        lineHeight: 20,
    },
    eventTitle: {
        ...Typography.h5,
        color: Colors.text,
        marginBottom: 4,
    },
    eventMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    registeredBadge: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 6,
    },
    registeredText: {
        fontSize: 9,
        color: '#FFF',
        fontWeight: 'bold',
    },
    eventSubtitle: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
});
