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
    View,
    Alert,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import { useClub, useClubPosts } from '../../src/hooks/useClubs';
import { useEvents } from '../../src/hooks/useEvents';
import { useUserStore } from '../../src/store/userStore';
import { Colors, Radius, Spacing, Typography, Palette } from '../../src/theme';

const { width: SW } = Dimensions.get('window');

export default function ClubProfileScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    
    const { data: club, isLoading: clubLoading } = useClub(id);
    const { data: allEvents = [], isLoading: eventsLoading } = useEvents({ clubId: id });
    const { data: clubPosts = [], isLoading: postsLoading } = useClubPosts(id);
    const { followedClubs, followClub } = useUserStore();

    const isLoading = clubLoading || eventsLoading || postsLoading;

    const stats = useMemo(
        () => [
            { label: 'Posts', value: clubPosts.length },
            { label: 'Followers', value: club?.followers_count ?? 0 },
            { label: 'Events', value: allEvents.length },
        ],
        [clubPosts.length, club?.followers_count, allEvents.length]
    );

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
                <ActivityIndicator color={Colors.primary} size="large" />
            </View>
        );
    }

    if (!club) return null;

    const isFollowing = followedClubs.includes(club.id);
    const clubTypeLabel = club.vibe_tag === 'Tech' ? 'Department' : 'Club';
    const accountTone = `${club.vibe_tag} Community`;
    const heroStory = clubPosts[0];

    const gridPosts = clubPosts.slice(0, 6);

    return (
        <View style={styles.flex}>
            <StatusBar barStyle="light-content" />
            
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                <View style={styles.heroShell}>
                    <ImageBackground
                        source={{ uri: club.banner }}
                        style={styles.heroImage}
                        imageStyle={styles.heroImageStyle}
                    >
                        <LinearGradient
                            colors={['rgba(5,5,5,0.7)', 'rgba(5,5,5,0.2)', 'rgba(5,5,5,0.9)']}
                            style={styles.heroGradient}
                        />
                        <SafeAreaView edges={['top']} style={styles.topNav}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
                                <Ionicons name="arrow-back" size={22} color={Colors.textLight} />
                            </TouchableOpacity>
                        </SafeAreaView>
                        
                        <View style={styles.heroTextBlock}>
                            <View style={styles.heroBadgeSecondary}>
                                <Text style={styles.heroBadgeTextSecondary}>{clubTypeLabel.toUpperCase()}</Text>
                            </View>
                            <Text style={styles.heroName}>{club.name}</Text>
                            <Text style={styles.heroMeta}>{accountTone}</Text>
                        </View>
                    </ImageBackground>

                    <View style={styles.profileCard}>
                        <View style={styles.profileTopRow}>
                            <View style={styles.avatarRing}>
                                <Image source={{ uri: club.logo }} style={styles.avatar} />
                            </View>
                            <View style={styles.profileMeta}>
                                <Text style={styles.profileName}>{club.name}</Text>
                                <Text style={styles.profileTagline}>
                                    {club.tagline}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.statRow}>
                            {stats.map((item, idx) => {
                                const colorPair = Palette[idx % Palette.length];
                                return (
                                    <View key={item.label} style={styles.statCell}>
                                        <Text style={[styles.statValue, { color: colorPair.icon }]}>{item.value}</Text>
                                        <Text style={styles.statLabel}>{item.label}</Text>
                                    </View>
                                );
                            })}
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.followBtn, isFollowing && styles.followingBtn]}
                                onPress={() => followClub(club.id)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                                    {isFollowing ? 'Joined' : 'Join Club'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.8} onPress={() => Alert.alert('Coming Soon', 'Community chat features are arriving soon!')}>
                                <Text style={styles.outlineBtnText}>Community</Text>
                            </TouchableOpacity>
                        </View>

                        {allEvents.length > 0 && (
                            <View style={styles.section}>
                                <View style={styles.gridHeader}>
                                    <Text style={styles.gridTitle}>Upcoming Events</Text>
                                </View>
                                <View style={styles.eventList}>
                                    {allEvents.map((event, idx) => {
                                        const colorPair = Palette[(idx + 2) % Palette.length];
                                        return (
                                            <TouchableOpacity 
                                                key={event.id} 
                                                style={[styles.eventItem, { borderColor: colorPair.icon + '20' }]} 
                                                onPress={() => router.push(`/event/${event.id}` as any)}
                                            >
                                                <View style={[styles.eventDateBox, { backgroundColor: colorPair.bg }]}>
                                                    <Text style={[styles.eventDateMonth, { color: colorPair.icon }]}>{dayjs(event.date).format('MMM')}</Text>
                                                    <Text style={[styles.eventDateDay, { color: colorPair.icon }]}>{dayjs(event.date).format('DD')}</Text>
                                                </View>
                                                <View style={styles.eventInfo}>
                                                    <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
                                                    <Text style={styles.eventMeta}>{event.time} · {event.venue}</Text>
                                                </View>
                                                <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </View>
                        )}

                        <View style={styles.gridHeader}>
                            <Text style={styles.gridTitle}>Club Feed</Text>
                            <TouchableOpacity onPress={() => router.push('/(tabs)/waves')}>
                                <Text style={styles.gridAction}>View all</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.gridList}>
                            {gridPosts.map((post) => (
                                <TouchableOpacity 
                                    key={post.id} 
                                    style={styles.gridItemWrap}
                                    onPress={() => router.push('/(tabs)/waves')}
                                >
                                    <View style={styles.gridItem}>
                                        <Image source={{ uri: post.media_url }} style={styles.gridImage} />
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {heroStory && (
                            <View style={styles.featuredRow}>
                                <Text style={styles.featuredLabel}>Club Spotlight</Text>
                                <TouchableOpacity 
                                    style={styles.featuredCardWrap}
                                    onPress={() => {
                                        if (heroStory.linked_event_id) {
                                            router.push(`/event/${heroStory.linked_event_id}` as any);
                                        } else {
                                            router.push('/(tabs)/waves');
                                        }
                                    }}
                                >
                                    <View style={styles.featuredCard}>
                                        <Image source={{ uri: heroStory.media_url }} style={styles.featuredImage} />
                                        <View style={styles.featuredOverlay}>
                                            <Text style={styles.featuredCaption} numberOfLines={2}>
                                                {heroStory.caption}
                                            </Text>
                                            {heroStory.linked_event_id && (
                                                <View style={styles.spotlightBadge}>
                                                    <Text style={styles.spotlightBadgeText}>VIEW EVENT</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: Colors.background },
    topNav: { flexDirection: 'row', paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm },
    navBtn: { width: 40, height: 40, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.glassDark, borderWidth: 0.5, borderColor: Colors.highlight },
    scroll: { paddingBottom: 40 },
    heroShell: { paddingBottom: Spacing.lg },
    heroImage: { width: '100%', height: 280, justifyContent: 'space-between' },
    heroImageStyle: { opacity: 1 },
    heroGradient: { ...StyleSheet.absoluteFillObject },
    heroBadgeSecondary: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.sm, backgroundColor: Colors.primary, marginBottom: 8 },
    heroBadgeTextSecondary: { ...Typography.micro, color: Colors.textLight, fontFamily: 'Sora_700Bold' },
    heroTextBlock: { paddingHorizontal: Spacing.section, paddingBottom: 60 },
    heroName: { ...Typography.h1, color: Colors.textLight },
    heroMeta: { ...Typography.body2, color: Colors.textDimmed, fontFamily: 'Sora_600SemiBold' },
    profileCard: { backgroundColor: Colors.sectionBg, marginHorizontal: Spacing.section, marginTop: -40, borderRadius: Radius.xxl, padding: Spacing.lg, borderWidth: 0.5, borderColor: Colors.divider },
    profileTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg },
    avatarRing: { width: 84, height: 84, borderRadius: 42, borderWidth: 3, borderColor: Colors.surface, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.surface, marginRight: Spacing.md },
    avatar: { width: 74, height: 74, borderRadius: 37 },
    profileMeta: { flex: 1 },
    profileName: { ...Typography.h3, color: Colors.text },
    profileTagline: { ...Typography.body2, color: Colors.textSecondary, lineHeight: 20 },
    statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.xl, backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: Radius.xl, borderWidth: 0.5, borderColor: Colors.divider },
    statCell: { alignItems: 'center', flex: 1 },
    statValue: { ...Typography.h4, fontFamily: 'Sora_700Bold' },
    statLabel: { ...Typography.micro, color: Colors.textSecondary, textTransform: 'uppercase', marginTop: 2 },
    buttonRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.xl },
    followBtn: { flex: 1, backgroundColor: Colors.primary, paddingVertical: 14, borderRadius: Radius.lg, alignItems: 'center' },
    followingBtn: { backgroundColor: Colors.success },
    followBtnText: { ...Typography.h5, color: Colors.textLight, fontFamily: 'Sora_700Bold' },
    followingBtnText: { color: Colors.textLight },
    outlineBtn: { flex: 1, borderWidth: 1.5, borderColor: Colors.divider, borderRadius: Radius.lg, paddingVertical: 14, alignItems: 'center', backgroundColor: Colors.surface },
    outlineBtnText: { ...Typography.h5, color: Colors.text, fontFamily: 'Sora_600SemiBold' },
    gridHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
    gridTitle: { ...Typography.h4, color: Colors.text },
    gridAction: { ...Typography.micro, color: Colors.primary, fontFamily: 'Sora_700Bold' },
    section: { marginBottom: Spacing.xl },
    eventList: { gap: 12 },
    eventItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, padding: 10, borderRadius: Radius.lg, gap: 12, borderWidth: 0.5 },
    eventDateBox: { width: 44, height: 44, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
    eventDateMonth: { ...Typography.micro, fontFamily: 'Sora_700Bold', textTransform: 'uppercase' },
    eventDateDay: { ...Typography.h4, fontFamily: 'Sora_700Bold' },
    eventInfo: { flex: 1, gap: 2 },
    eventTitle: { ...Typography.body1, fontFamily: 'Sora_600SemiBold', color: Colors.text },
    eventMeta: { ...Typography.micro, color: Colors.textSecondary },
    gridList: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
    gridItemWrap: { width: (SW - Spacing.section * 2 - 40) / 3, aspectRatio: 1 },
    gridItem: { flex: 1, borderRadius: Radius.md, overflow: 'hidden', borderWidth: 0.5, borderColor: Colors.divider },
    gridImage: { width: '100%', height: '100%' },
    featuredRow: { marginTop: Spacing.xl },
    featuredLabel: { ...Typography.h4, color: Colors.text, marginBottom: Spacing.md },
    featuredCardWrap: { height: 200 },
    featuredCard: { flex: 1, borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 0.5, borderColor: Colors.divider },
    featuredImage: { width: '100%', height: '100%' },
    featuredOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', padding: Spacing.md, backgroundColor: 'rgba(5,5,5,0.4)' },
    featuredCaption: { ...Typography.body1, color: Colors.textLight, fontFamily: 'Sora_600SemiBold' },
    spotlightBadge: { position: 'absolute', top: Spacing.md, right: Spacing.md, backgroundColor: Colors.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.xs },
    spotlightBadgeText: { ...Typography.micro, fontFamily: 'Sora_800ExtraBold', color: Colors.textLight },
});
