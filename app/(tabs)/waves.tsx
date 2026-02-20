import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useRef } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Platform,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHybridStore } from '../../src/store/hybridStore';
import { Radius, Spacing, Typography } from '../../src/theme';

const { width: SW, height: SH } = Dimensions.get('window');

// Top bottom tab bar is typically ~88px on iOS, remove it from SH for snapping height if tab bar isn't translucent,
// but since we want true full screen, we'll use SH - bottomTabHeight.
const BOTTOM_TAB_HEIGHT = Platform.OS === 'ios' ? 88 : 68;
const SNAP_HEIGHT = SH - BOTTOM_TAB_HEIGHT;

export default function WavesScreen() {
    const { getRankedFeed, registerEvent, updatePostEngagement, user } = useHybridStore();
    const insets = useSafeAreaInsets();
    // Get dynamically ranked feed
    const feed = getRankedFeed();
    // Viewability config for triggering "Going?" CTAs on Reels
    const viewabilityConfig = useRef({
        itemVisiblePercentThreshold: 80,
        minimumViewTime: 1500, // Show CTA after 1.5s of viewing
    }).current;

    const onViewableItemsChanged = useRef((_info: any) => {
        // Reserved for future viewability triggering
    }).current;

    const handleLike = useCallback((itemId: string) => {
        updatePostEngagement(itemId, 1);
    }, [updatePostEngagement]);

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

    const renderPost = useCallback(({ item, index }: { item: ReturnType<typeof getRankedFeed>[0], index: number }) => {
        const isRegistered = item.event ? user.registeredEvents.includes(item.event.id) : false;
        const isReel = item.type === 'reel';

        return (
            <View style={[styles.postContainer, { height: SNAP_HEIGHT }]}>
                {/* Full Screen Background Media */}
                <Image source={{ uri: item.mediaUrl }} style={styles.mediaImage} />

                {/* Dark gradient overlay for text legibility at bottom */}
                <View style={styles.mediaGradient} />

                {/* Right Side Action Column */}
                <View style={[styles.actionColumn, { paddingBottom: insets.bottom + 12 }]}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleLike(item.id)}>
                        <Ionicons name="heart" size={32} color="#FFF" />
                        <Text style={styles.actionCount}>{item.engagementScore}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={handleComment}>
                        <Ionicons name="chatbubble" size={30} color="#FFF" />
                        <Text style={styles.actionCount}>{Math.floor(item.engagementScore / 10)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleShare(item.caption)}>
                        <Ionicons name="paper-plane" size={30} color="#FFF" />
                        <Text style={styles.actionCount}>Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert('More options', 'Coming soon')}>
                        <Ionicons name="ellipsis-horizontal" size={30} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Bottom Left Info Wrapper */}
                <View style={[styles.infoColumn, { paddingBottom: insets.bottom + 8 }]}>
                    {/* Club Info */}
                    <TouchableOpacity
                        style={styles.clubRow}
                        activeOpacity={0.8}
                        onPress={() => router.push(`/club/${item.club.id}` as any)}
                    >
                        <Image source={{ uri: item.club.logo }} style={styles.clubLogo} />
                        <Text style={styles.clubName}>{item.club.name}</Text>
                        <View style={styles.followBadge}>
                            <Text style={styles.followBadgeText}>Follow</Text>
                        </View>
                    </TouchableOpacity>

                    {/* Caption */}
                    <Text style={styles.caption} numberOfLines={2}>
                        {item.caption}
                    </Text>

                    {/* Linked Event / Reel CTA */}
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
                                onPress={() => registerEvent(item.event!.id)}
                                disabled={isRegistered}
                            >
                                <Text style={[styles.inlineRegText, isRegistered && styles.inlineRegTextActive]}>
                                    {isRegistered ? 'Going' : 'RSVP'}
                                </Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Reel Indicator Overlay */}
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
    }, [user.registeredEvents, registerEvent, insets.bottom, insets.top]);

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
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                ListFooterComponent={<View style={{ height: insets.bottom + BOTTOM_TAB_HEIGHT + 48 }} />}
                contentContainerStyle={{ paddingBottom: insets.bottom + BOTTOM_TAB_HEIGHT + 48 }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#000' },

    // Waves Full-Screen Post Container
    postContainer: {
        width: SW,
        position: 'relative',
        backgroundColor: '#000',
    },
    mediaImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    mediaGradient: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '40%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        // A true linear gradient would be better, but semi-transparent dark block suffices for now
    },

    // Header Overlay
    headerOverlay: {
        position: 'absolute',
        left: Spacing.md,
        right: Spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
    },
    reelIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    reelIndicatorText: {
        ...Typography.h4,
        color: '#FFF',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    cameraBtn: {
        padding: 4,
    },

    // Right Action Column
    actionColumn: {
        position: 'absolute',
        right: Spacing.sm,
        bottom: 0,
        alignItems: 'center',
        gap: Spacing.xl,
        zIndex: 10,
    },
    actionBtn: {
        alignItems: 'center',
        gap: 4,
    },
    actionCount: {
        ...Typography.label,
        color: '#FFF',
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },

    // Bottom Left Info Column
    infoColumn: {
        position: 'absolute',
        bottom: 0,
        left: Spacing.md,
        right: 80, // Leave room for right column
        zIndex: 10,
    },
    clubRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    clubLogo: {
        width: 36, height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#FFF',
        marginRight: Spacing.sm,
    },
    clubName: {
        ...Typography.label,
        color: '#FFF',
        fontWeight: 'bold',
        marginRight: Spacing.sm,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    followBadge: {
        borderWidth: 1,
        borderColor: '#FFF',
        borderRadius: Radius.sm,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    followBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    caption: {
        ...Typography.body2,
        color: '#FFF',
        lineHeight: 20,
        marginBottom: Spacing.md,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },

    // Embedded Event Pill for Reels
    eventPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: Radius.pill,
        paddingLeft: 4,
        paddingRight: 4,
        paddingVertical: 4,
        alignSelf: 'flex-start',
    },
    eventPillIcon: {
        width: 24, height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6,
    },
    eventPillText: {
        ...Typography.label,
        color: '#FFF',
        marginRight: Spacing.sm,
        maxWidth: 150,
    },
    inlineRegBtn: {
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: Radius.pill,
    },
    inlineRegBtnActive: {
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    inlineRegText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#000',
    },
    inlineRegTextActive: {
        color: '#FFF',
    },
});
