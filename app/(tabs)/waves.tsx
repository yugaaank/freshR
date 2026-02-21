import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import React, { useCallback, useRef } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Platform,
    RefreshControl,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRankedFeed, RankedPost } from '../../src/hooks/useRankedFeed';
import { useUserStore } from '../../src/store/userStore';
import { useLikePost } from '../../src/hooks/useClubs';
import { Radius, Spacing, Typography, Colors } from '../../src/theme';
import * as Haptics from 'expo-haptics';

const { width: SW, height: SH } = Dimensions.get('window');

const BOTTOM_TAB_HEIGHT = Platform.OS === 'ios' ? 88 : 68;
const SNAP_HEIGHT = SH - BOTTOM_TAB_HEIGHT;

const BLUR_HASH = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function WavesScreen() {
    const feed = useRankedFeed();
    const { registerEvent, registeredEvents, followedClubs, followClub } = useUserStore();
    const likeMutation = useLikePost();
    const insets = useSafeAreaInsets();
    
    const [refreshing, setRefreshing] = React.useState(false);

    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 80,
        minimumViewTime: 1500,
    }).current;

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRefreshing(false);
    }, []);

    const handleLike = useCallback((itemId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        likeMutation.mutate({ postId: itemId });
    }, [likeMutation]);

    const handleComment = useCallback(() => {
        Alert.alert('Feature coming soon', 'Comment threads will arrive in waves.');
    }, []);

    const handleShare = useCallback(async (caption: string) => {
        try {
            await Share.share({ message: `Check out this club update: ${caption}` });
        } catch (error) {
            Alert.alert('Share failed', 'Unable to share right now.');
        }
    }, []);

    const handleRegister = useCallback((eventId: string, category: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        registerEvent(eventId, category);
    }, [registerEvent]);

    const handleFollow = useCallback((clubId: string) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        followClub(clubId);
    }, [followClub]);

    const renderPost = useCallback(({ item }: { item: RankedPost }) => {
        const isRegistered = item.event ? registeredEvents.includes(item.event.id) : false;
        const isFollowing = followedClubs.includes(item.club_id);
        const isReel = item.type === 'reel';

        return (
            <View style={[styles.postContainer, { height: SNAP_HEIGHT }]}>
                <Image 
                    source={{ uri: item.media_url }} 
                    style={styles.mediaImage}
                    placeholder={BLUR_HASH}
                    transition={500}
                    contentFit="cover"
                />
                <View style={styles.mediaGradient} />

                <View style={[styles.actionColumn, { paddingBottom: insets.bottom + 12 }]}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleLike(item.id)}>
                        <Ionicons name="heart" size={32} color="#FFF" />
                        <Text style={styles.actionCount}>{item.engagement_score}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleComment}>
                        <Ionicons name="chatbubble" size={30} color="#FFF" />
                        <Text style={styles.actionCount}>{Math.floor(item.engagement_score / 10)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleShare(item.caption)}>
                        <Ionicons name="paper-plane" size={30} color="#FFF" />
                        <Text style={styles.actionCount}>Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('More options', 'Coming soon')}>
                        <Ionicons name="ellipsis-horizontal" size={30} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <View style={[styles.infoColumn, { paddingBottom: insets.bottom + 8 }]}>
                    <View style={styles.clubRow}>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center' }}
                            activeOpacity={0.8}
                            onPress={() => router.push(`/club/${item.club_id}` as any)}
                        >
                            <Image source={{ uri: item.club.logo }} style={styles.clubLogo} />
                            <Text style={styles.clubName}>{item.club.name}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.followBadge, isFollowing && styles.followBadgeActive]}
                            onPress={() => handleFollow(item.club_id)}
                        >
                            <Text style={styles.followBadgeText}>{isFollowing ? 'Joined' : 'Follow'}</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.caption} numberOfLines={2}>
                        {item.caption}
                    </Text>

                    {item.event && (
                        <TouchableOpacity
                            style={styles.eventPill}
                            activeOpacity={0.9}
                            onPress={() => router.push(`/event/${item.event!.id}` as any)}
                        >
                            <View style={styles.eventPillIcon}>
                                <Ionicons name="calendar" size={12} color="#FFF" />
                            </View>
                            <Text style={styles.eventPillText} numberOfLines={1}>{item.event.title}</Text>

                            <TouchableOpacity
                                style={[styles.inlineRegBtn, isRegistered && styles.inlineRegBtnActive]}
                                onPress={() => handleRegister(item.event!.id, item.event!.category)}
                                disabled={isRegistered}
                            >
                                <Text style={[styles.inlineRegText, isRegistered && styles.inlineRegTextActive]}>
                                    {isRegistered ? 'Going' : 'RSVP'}
                                </Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )}
                </View>

                {isReel && (
                    <View style={[styles.headerOverlay, { top: insets.top + Spacing.md }]}>
                        <View style={styles.reelIndicator}>
                            <Ionicons name="play" size={14} color="#FFF" />
                            <Text style={styles.reelIndicatorText}>Reels</Text>
                        </View>
                        <TouchableOpacity style={styles.cameraBtn}>
                            <Ionicons name="camera-outline" size={26} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }, [registeredEvents, followedClubs, handleRegister, handleFollow, insets.bottom, insets.top, handleLike, handleComment, handleShare]);

    if (feed.length === 0 && !refreshing) {
        return (
            <View style={[styles.safe, { justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.darkBg }]}>
                <ActivityIndicator color={Colors.textLight} size="large" />
                <Text style={{ color: Colors.textLight, marginTop: 12 }}>Loading your feed...</Text>
            </View>
        );
    }

    return (
        <View style={styles.safe}>
            <FlatList
                data={feed}
                keyExtractor={item => item.id}
                renderItem={renderPost}
                showsVerticalScrollIndicator={false}
                pagingEnabled
                snapToInterval={SNAP_HEIGHT}
                snapToAlignment="start"
                decelerationRate="fast"
                viewabilityConfig={viewabilityConfig}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFF" />
                }
                ListFooterComponent={<View style={{ height: insets.bottom + BOTTOM_TAB_HEIGHT + 48 }} />}
                contentContainerStyle={{ paddingBottom: insets.bottom + BOTTOM_TAB_HEIGHT + 48 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.darkBg },
    postContainer: { width: SW, position: 'relative', backgroundColor: Colors.darkBg },
    mediaImage: { width: '100%', height: '100%' },
    mediaGradient: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', backgroundColor: 'rgba(0,0,0,0.5)' },
    headerOverlay: { position: 'absolute', left: Spacing.md, right: Spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 },
    reelIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    reelIndicatorText: { ...Typography.h4, color: '#FFF', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
    cameraBtn: { padding: 4 },
    actionColumn: { position: 'absolute', right: Spacing.sm, bottom: 0, alignItems: 'center', gap: Spacing.xl, zIndex: 10 },
    actionBtn: { alignItems: 'center', gap: 4 },
    actionCount: { ...Typography.micro, color: '#FFF', fontFamily: 'Sora_700Bold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
    infoColumn: { position: 'absolute', bottom: 0, left: Spacing.md, right: 80, zIndex: 10 },
    clubRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm, gap: 10 },
    clubLogo: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#FFF' },
    clubName: { ...Typography.label, color: '#FFF', fontFamily: 'Sora_700Bold', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
    followBadge: { borderWidth: 1, borderColor: '#FFF', borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 4 },
    followBadgeActive: { backgroundColor: Colors.success, borderColor: Colors.success },
    followBadgeText: { color: '#FFF', ...Typography.micro, fontFamily: 'Sora_700Bold' },
    caption: { ...Typography.body2, color: '#FFF', lineHeight: 20, marginBottom: Spacing.md, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
    eventPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: Radius.pill, paddingLeft: 4, paddingRight: 4, paddingVertical: 4, alignSelf: 'flex-start' },
    eventPillIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', marginRight: 6 },
    eventPillText: { ...Typography.label, color: '#FFF', marginRight: Spacing.sm, maxWidth: 150 },
    inlineRegBtn: { backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.pill },
    inlineRegBtnActive: { backgroundColor: 'rgba(255,255,255,0.4)' },
    inlineRegText: { ...Typography.micro, fontFamily: 'Sora_700Bold', color: '#000' },
    inlineRegTextActive: { color: '#FFF' },
});
