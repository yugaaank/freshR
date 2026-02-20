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
import Animated, { FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHybridStore } from '../../src/store/hybridStore';
import { Colors, Radius, Spacing, Typography } from '../../src/theme';

export default function ClubProfileScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { getClubDetails, user, followClub } = useHybridStore();
    const { club, events, posts } = useMemo(() => getClubDetails(id), [id, getClubDetails]);

    const stats = useMemo(
        () => [
            { label: 'Posts', value: posts.length },
            { label: 'Followers', value: club?.followersCount ?? 0 },
            { label: 'Events', value: events.length },
        ],
        [posts.length, club?.followersCount, events.length]
    );

    if (!club) return null;

    const isFollowing = user.followedClubs.includes(club.id);
    const clubTypeLabel = club.vibeTag === 'Tech' ? 'Department' : 'Club';
    const accountTone = `${clubTypeLabel} • ${club.vibeTag} Focus`;
    const heroStory = posts[0];

    const gridPosts = posts.slice(0, 6);

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
                <Animated.View style={styles.heroShell} entering={FadeInUp.springify()}>
                    <ImageBackground
                        source={{ uri: club.banner }}
                        style={styles.heroImage}
                        imageStyle={styles.heroImageStyle}
                    >
                        <LinearGradient
                            colors={['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.3)', 'rgba(250,250,250,0.0)']}
                            locations={[0, 0.45, 1]}
                            style={styles.heroGradient}
                        />
                        <View style={styles.heroTopBanners}>
                            <View style={styles.heroBadge}>
                                <Text style={styles.heroBadgeText}>Instagram</Text>
                            </View>
                            <View style={styles.heroBadgeSecondary}>
                                <Text style={styles.heroBadgeTextSecondary}>{clubTypeLabel}</Text>
                            </View>
                        </View>
                        <View style={styles.heroTextBlock}>
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
                                <Text style={styles.profileTagline} numberOfLines={2}>
                                    {club.tagline}
                                </Text>
                                <Text style={styles.profileTone}>{accountTone}</Text>
                            </View>
                        </View>

                        <View style={styles.statRow}>
                            {stats.map((item) => (
                                <View key={item.label} style={styles.statCell}>
                                    <Text style={styles.statValue}>{item.value}</Text>
                                    <Text style={styles.statLabel}>{item.label}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={[styles.followBtn, isFollowing && styles.followingBtn]}
                                onPress={() => followClub(club.id)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                                    {isFollowing ? 'Following' : 'Follow'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.outlineBtn} activeOpacity={0.8}>
                                <Text style={styles.outlineBtnText}>Message</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.8}>
                                <Ionicons name="share-social" size={18} color={Colors.textSecondary} />
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.bioCard} activeOpacity={0.8}>
                            <Text style={styles.bioLabel}>Bio</Text>
                            <Text style={styles.bioText}>{club.tagline} • {club.vibeTag} Stories & Events.</Text>
                        </TouchableOpacity>

                        <View style={styles.gridHeader}>
                            <Text style={styles.gridTitle}>Recent Posts</Text>
                            <Text style={styles.gridAction}>View all</Text>
                        </View>

                        <View style={styles.gridList}>
                            {gridPosts.map((post) => (
                                <TouchableOpacity key={post.id} style={styles.gridItem} activeOpacity={0.8}>
                                    <Image source={{ uri: post.mediaUrl }} style={styles.gridImage} />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {heroStory && (
                            <View style={styles.featuredRow}>
                                <Text style={styles.featuredLabel}>Featured Reel</Text>
                                <View style={styles.featuredCard}>
                                    <Image source={{ uri: heroStory.mediaUrl }} style={styles.featuredImage} />
                                    <View style={styles.featuredOverlay}>
                                        <Text style={styles.featuredCaption} numberOfLines={2}>
                                            {heroStory.caption}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: '#FBFBFD' },
    safe: { backgroundColor: Colors.background },
    topNav: {
        height: 60,
        justifyContent: 'center',
        paddingHorizontal: Spacing.section,
    },
    navBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 3,
    },
    scroll: {
        paddingBottom: 40,
    },
    heroShell: {
        paddingBottom: Spacing.lg,
    },
    heroImage: {
        width: '100%',
        height: 220,
        justifyContent: 'space-between',
    },
    heroImageStyle: {
        opacity: 0.9,
    },
    heroGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    heroTopBanners: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.section,
        paddingTop: Spacing.md,
    },
    heroBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: Radius.xxl,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    heroBadgeText: {
        ...Typography.mono,
        color: '#FFF',
        fontWeight: '600',
    },
    heroBadgeSecondary: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: Radius.xxl,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    heroBadgeTextSecondary: {
        ...Typography.caption,
        color: '#FFF',
    },
    heroTextBlock: {
        paddingHorizontal: Spacing.section,
        paddingBottom: Spacing.md,
    },
    heroName: {
        ...Typography.h2,
        color: '#FFF',
    },
    heroMeta: {
        ...Typography.body2,
        color: 'rgba(255,255,255,0.85)',
    },
    profileCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: Spacing.section,
        marginTop: -40,
        borderRadius: Radius.xxl,
        padding: Spacing.section,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 20,
        elevation: 6,
    },
    profileTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    avatarRing: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: '#FFE7CB',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        marginRight: Spacing.lg,
    },
    avatar: {
        width: 74,
        height: 74,
        borderRadius: 37,
    },
    profileMeta: {
        flex: 1,
    },
    profileName: {
        ...Typography.h3,
        fontWeight: '700',
        marginBottom: 2,
    },
    profileTagline: {
        ...Typography.body2,
        color: Colors.textSecondary,
    },
    profileTone: {
        ...Typography.caption,
        marginTop: Spacing.xs,
        color: Colors.textSecondary,
        letterSpacing: 0.5,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
    },
    statCell: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        ...Typography.h4,
        fontWeight: '700',
    },
    statLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
    },
    followBtn: {
        flex: 1,
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.md,
        borderRadius: Radius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.sm,
    },
    followingBtn: {
        backgroundColor: '#1E1E1F',
    },
    followBtnText: {
        ...Typography.label,
        color: '#FFF',
    },
    followingBtnText: {
        color: '#FFF',
    },
    outlineBtn: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.borderStrong,
        borderRadius: Radius.lg,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Spacing.xs,
    },
    outlineBtnText: {
        ...Typography.label,
        color: Colors.textSecondary,
    },
    iconBtn: {
        width: 48,
        height: 48,
        borderRadius: Radius.xl,
        borderWidth: 1,
        borderColor: Colors.borderStrong,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bioCard: {
        backgroundColor: Colors.surface,
        borderRadius: Radius.md,
        padding: Spacing.md,
        marginBottom: Spacing.md,
    },
    bioLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginBottom: Spacing.xs,
    },
    bioText: {
        ...Typography.body2,
        color: Colors.text,
    },
    gridHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    gridTitle: {
        ...Typography.h4,
    },
    gridAction: {
        ...Typography.caption,
        color: Colors.primary,
    },
    gridList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '32%',
        height: 100,
        marginBottom: Spacing.sm,
        borderRadius: Radius.md,
        overflow: 'hidden',
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
    featuredRow: {
        marginTop: Spacing.md,
    },
    featuredLabel: {
        ...Typography.caption,
        color: Colors.textSecondary,
        marginBottom: Spacing.xs,
    },
    featuredCard: {
        borderRadius: Radius.xxl,
        overflow: 'hidden',
        height: 180,
    },
    featuredImage: {
        width: '100%',
        height: '100%',
    },
    featuredOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        padding: Spacing.md,
        backgroundColor: 'rgba(0,0,0,0.25)',
    },
    featuredCaption: {
        ...Typography.body1,
        color: '#FFF',
        fontWeight: '600',
    },
});
