import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../../src/components/ui/SearchBar';
import SectionHeader from '../../src/components/ui/SectionHeader';
import UrgencyTag from '../../src/components/ui/UrgencyTag';
import { events } from '../../src/data/events';
import { restaurants } from '../../src/data/food';
import { homeData } from '../../src/data/homeData';
import { useUserStore } from '../../src/store/userStore';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../src/theme';

const { width } = Dimensions.get('window');
const BANNER_W = width - Spacing.lg * 2;

export default function HomeScreen() {
  const profile = useUserStore((s) => s.profile);
  const featuredEvents = events.filter((e) => e.isFeatured);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={14} color={Colors.primary} />
              <Text style={styles.locationText}>{profile.college}</Text>
              <Ionicons name="chevron-down" size={12} color={Colors.textSecondary} />
            </View>
            <Text style={styles.greeting}>Good afternoon, {profile.name.split(' ')[0]} 👋</Text>
          </View>
          <TouchableOpacity style={styles.avatarBtn}>
            <Image source={{ uri: profile.avatar }} style={styles.avatar} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchWrap}>
          <SearchBar
            placeholder="Search events, food, courses..."
            editable={false}
            onPress={() => { }}
          />
        </View>

        {/* Campus Alerts */}
        {homeData.campusAlerts.map((alert) => (
          <View
            key={alert.id}
            style={[
              styles.alertBanner,
              {
                backgroundColor:
                  alert.type === 'danger'
                    ? Colors.errorLight
                    : alert.type === 'warning'
                      ? Colors.warningLight
                      : Colors.infoLight,
              },
            ]}
          >
            <Text style={styles.alertText}>{alert.text}</Text>
          </View>
        ))}

        {/* Quick Actions */}
        <SectionHeader title="Quick Actions" style={{ marginTop: Spacing.lg }} />
        <FlatList
          horizontal
          data={homeData.quickActions}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickActionsRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push(item.route as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: item.color }]}>
                <Text style={styles.quickActionEmoji}>{item.icon}</Text>
              </View>
              <Text style={styles.quickActionLabel}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />

        {/* Featured Events */}
        <SectionHeader
          title="Happening Soon 🔥"
          subtitle="Events not to miss"
          onSeeAll={() => router.push('/(tabs)/events')}
          style={{ marginTop: Spacing.xl }}
        />
        <FlatList
          horizontal
          data={featuredEvents}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.eventCard}
              onPress={() => router.push(`/event/${item.id}` as any)}
              activeOpacity={0.92}
            >
              <Image source={{ uri: item.image }} style={styles.eventImage} />
              <View style={styles.eventOverlay} />
              <View style={styles.eventContent}>
                {item.seatsLeft < 15 && (
                  <UrgencyTag label={`${item.seatsLeft} seats left`} variant="danger" style={{ marginBottom: 4 }} />
                )}
                <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.eventMeta}>{item.date} · {item.venue}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Food Near You */}
        <SectionHeader
          title="Food Near You 🍔"
          subtitle="Order in 15 min"
          onSeeAll={() => router.push('/(tabs)/food')}
          style={{ marginTop: Spacing.xl }}
        />
        <FlatList
          horizontal
          data={restaurants}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.restaurantCard}
              onPress={() => router.push('/(tabs)/food')}
              activeOpacity={0.92}
            >
              <Image source={{ uri: item.image }} style={styles.restaurantImage} />
              {item.tag && (
                <View style={styles.restaurantTag}>
                  <Text style={styles.restaurantTagText}>{item.tag}</Text>
                </View>
              )}
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{item.name}</Text>
                <Text style={styles.restaurantMeta}>{item.cuisine}</Text>
                <View style={styles.restaurantRow}>
                  <Text style={styles.restaurantRating}>⭐ {item.rating}</Text>
                  <Text style={styles.restaurantDot}>·</Text>
                  <Text style={styles.restaurantMeta}>{item.deliveryTime}</Text>
                  {item.deliveryFee === 0 && (
                    <>
                      <Text style={styles.restaurantDot}>·</Text>
                      <Text style={styles.freeDelivery}>Free delivery</Text>
                    </>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Today's Challenge Banner */}
        <View style={styles.challengeBanner}>
          <View style={styles.challengeLeft}>
            <Text style={styles.challengeLabel}>DAILY CHALLENGE</Text>
            <Text style={styles.challengeTitle}>Minimum Path Sum in Grid</Text>
            <View style={styles.challengeMeta}>
              <View style={styles.diffBadge}>
                <Text style={styles.diffText}>Medium</Text>
              </View>
              <Text style={styles.streakText}>🔥 14-day streak</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.challengeBtn}
            onPress={() => router.push('/coding-challenge')}
            activeOpacity={0.85}
          >
            <Text style={styles.challengeBtnText}>Solve →</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: Spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  headerLeft: { flex: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 3 },
  locationText: { ...Typography.label, color: Colors.textSecondary, fontWeight: '600' },
  greeting: { ...Typography.h3, color: Colors.text },
  avatarBtn: {},
  avatar: { width: 40, height: 40, borderRadius: 20 },
  searchWrap: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.sm },
  alertBanner: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xs,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
  },
  alertText: { ...Typography.caption, color: Colors.text, fontWeight: '500' },
  quickActionsRow: { paddingHorizontal: Spacing.lg, gap: Spacing.xl },
  quickAction: { alignItems: 'center', gap: 6 },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionEmoji: { fontSize: 24 },
  quickActionLabel: { ...Typography.caption, color: Colors.text, fontWeight: '600' },
  horizontalList: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
  eventCard: {
    width: 220,
    height: 160,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  eventImage: { width: '100%', height: '100%', position: 'absolute' },
  eventOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  eventContent: { flex: 1, justifyContent: 'flex-end', padding: Spacing.md },
  eventTitle: { ...Typography.h5, color: '#FFF', marginBottom: 3 },
  eventMeta: { ...Typography.caption, color: 'rgba(255,255,255,0.75)' },
  restaurantCard: {
    width: 200,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.cardBg,
    ...Shadows.sm,
  },
  restaurantImage: { width: '100%', height: 110 },
  restaurantTag: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  restaurantTagText: { ...Typography.label, color: '#FFF', fontSize: 10 },
  restaurantInfo: { padding: Spacing.md },
  restaurantName: { ...Typography.h5, color: Colors.text, marginBottom: 2 },
  restaurantMeta: { ...Typography.caption, color: Colors.textSecondary },
  restaurantRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  restaurantRating: { ...Typography.caption, color: Colors.text, fontWeight: '600' },
  restaurantDot: { color: Colors.textTertiary },
  freeDelivery: { ...Typography.caption, color: Colors.success, fontWeight: '600' },
  challengeBanner: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.xl,
    backgroundColor: Colors.text,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  challengeLeft: { flex: 1 },
  challengeLabel: { ...Typography.label, color: Colors.textTertiary, marginBottom: 4 },
  challengeTitle: { ...Typography.h5, color: '#FFF', marginBottom: Spacing.sm },
  challengeMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  diffBadge: {
    backgroundColor: '#FC8019',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  diffText: { ...Typography.label, color: '#FFF', fontSize: 10 },
  streakText: { ...Typography.caption, color: 'rgba(255,255,255,0.7)' },
  challengeBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  challengeBtnText: { ...Typography.h5, color: '#FFF', fontWeight: '700' },
});
