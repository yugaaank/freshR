import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../src/components/ui/Card';
import SectionHeader from '../../src/components/ui/SectionHeader';
import TagPill from '../../src/components/ui/TagPill';
import { events } from '../../src/data/events';
import { restaurants } from '../../src/data/food';
import { campusAlerts, quickActions } from '../../src/data/homeData';
import { Colors, Gradients, Radius, Shadows, Spacing, Typography } from '../../src/theme';

const { width: SW } = Dimensions.get('window');
const CARD_W = SW * 0.88;

const ACTION_GRADIENTS: Record<string, string[]> = {
  food: Gradients.food,
  events: Gradients.events,
  map: Gradients.map,
  academics: Gradients.academics,
  challenge: Gradients.accent,
  teachers: ['#FF6B6B', '#FF3B30'],
};

export default function HomeScreen() {
  const todayEvents = events.slice(0, 4);
  const nearbyRests = restaurants.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ═══ HEADER ═══ */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color={Colors.primary} />
              <Text style={styles.locationText}>Main Campus</Text>
              <Ionicons name="chevron-down" size={12} color={Colors.textSecondary} />
            </View>
            <Text style={styles.greeting}>Good evening, Yugan 👋</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn} activeOpacity={0.88}>
            <Ionicons name="notifications-outline" size={22} color={Colors.text} />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* ═══ CAMPUS ALERTS ═══ */}
        {campusAlerts.map((alert) => (
          <View key={alert.id} style={styles.alertBanner}>
            <Text style={styles.alertEmoji}>{alert.emoji}</Text>
            <View style={styles.alertBody}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertDesc} numberOfLines={1}>{alert.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
          </View>
        ))}

        {/* ═══ QUICK ACTIONS ═══ */}
        <View style={styles.actionsWrap}>
          {quickActions.map((action) => {
            const grad = ACTION_GRADIENTS[action.id] ?? Gradients.primary;
            return (
              <TouchableOpacity
                key={action.id}
                style={styles.actionItem}
                activeOpacity={0.88}
                onPress={() => action.route && router.push(action.route as any)}
              >
                {/* Gradient circle */}
                <View style={[styles.actionCircle, { backgroundColor: grad[0] }]}>
                  <Text style={styles.actionEmoji}>{action.emoji}</Text>
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ═══ FEATURED EVENTS ═══ */}
        <View style={styles.sectionSpacer} />
        <SectionHeader
          title="Events Near You"
          subtitle="This week"
          onSeeAll={() => router.push('/(tabs)/events')}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hScroll}
          decelerationRate="fast"
          snapToInterval={CARD_W + 12}
        >
          {todayEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              activeOpacity={0.92}
              style={[styles.eventCard, { width: CARD_W }]}
              onPress={() => router.push(`/event/${event.id}` as any)}
            >
              {/* Hero gradient bg */}
              <View style={[styles.eventHero, { backgroundColor: event.colorBg ?? '#1A1A2E' }]}>
                <View style={styles.eventOverlay} />
                {/* Floating chips */}
                <View style={styles.eventChipRow}>
                  <TagPill label={event.category} variant="dark" size="sm" />
                  {event.seatsLeft < 30 && (
                    <View style={styles.seatsChip}>
                      <Ionicons name="flash" size={10} color="#FFD60A" />
                      <Text style={styles.seatsChipText}>{event.seatsLeft} left</Text>
                    </View>
                  )}
                </View>
                {/* Bottom text */}
                <View style={styles.eventCardBottom}>
                  <Text style={styles.eventCardTitle} numberOfLines={2}>{event.title}</Text>
                  <View style={styles.eventCardMeta}>
                    <Ionicons name="calendar-outline" size={12} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.eventCardMetaText}>{event.date} · {event.time}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ═══ FOOD NEAR YOU ═══ */}
        <View style={styles.sectionSpacer} />
        <SectionHeader
          title="Food Near You"
          subtitle="Under 30 min"
          onSeeAll={() => router.push('/(tabs)/food')}
        />
        <View style={styles.foodList}>
          {nearbyRests.map((rest) => (
            <TouchableOpacity
              key={rest.id}
              activeOpacity={0.88}
              onPress={() => router.push('/(tabs)/food')}
            >
              <Card style={styles.restCard} shadow="sm" padding={0}>
                {/* Banner */}
                <View style={[styles.restBanner, { backgroundColor: rest.colorBg ?? '#FF6B35' }]}>
                  <Text style={styles.restEmoji}>{rest.emoji ?? '🍽️'}</Text>
                </View>
                <View style={styles.restInfo}>
                  <View style={styles.restTopRow}>
                    <Text style={styles.restName}>{rest.name}</Text>
                    <View style={styles.restRating}>
                      <Ionicons name="star" size={12} color={Colors.warning} />
                      <Text style={styles.ratingText}>{rest.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.restMeta}>{rest.cuisine} · {rest.deliveryTime}</Text>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* ═══ DAILY CHALLENGE BANNER ═══ */}
        <View style={styles.sectionSpacer} />
        <TouchableOpacity
          style={styles.challengeBanner}
          activeOpacity={0.88}
          onPress={() => router.push('/coding-challenge')}
        >
          <View style={styles.challengeLeft}>
            <Text style={styles.challengeLabel}>DAILY CHALLENGE</Text>
            <Text style={styles.challengeTitle}>Two Sum</Text>
            <View style={styles.challengeMeta}>
              <View style={styles.easyBadge}><Text style={styles.easyText}>Easy</Text></View>
              <Text style={styles.challengeDesc}>🔥 23-day streak</Text>
            </View>
          </View>
          <View style={styles.challengeRight}>
            <Text style={styles.challengeIcon}>💻</Text>
            <Text style={styles.challengeCta}>Solve →</Text>
          </View>
        </TouchableOpacity>

        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: Spacing.xl },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.section,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    backgroundColor: '#FFF8F3',
  },
  headerLeft: { flex: 1 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 5 },
  locationText: { ...Typography.label, color: Colors.textSecondary, fontSize: 12 },
  greeting: { ...Typography.h1, color: Colors.text },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.cardBg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: Colors.cardBg,
  },

  // Alert banner
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    marginHorizontal: Spacing.section,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(252,128,25,0.15)',
  },
  alertEmoji: { fontSize: 22 },
  alertBody: { flex: 1 },
  alertTitle: { ...Typography.h5, color: Colors.text },
  alertDesc: { ...Typography.caption, color: Colors.textSecondary, marginTop: 1 },

  // Quick Actions
  actionsWrap: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.section,
    paddingTop: Spacing.lg,
    justifyContent: 'space-between',
  },
  actionItem: { alignItems: 'center', gap: 8, flex: 1 },
  actionCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  actionEmoji: { fontSize: 24 },
  actionLabel: { ...Typography.micro, color: Colors.textSecondary, textAlign: 'center' },

  // Events carousel
  sectionSpacer: { height: Spacing.xl, backgroundColor: Colors.surface, marginVertical: Spacing.lg },
  hScroll: { paddingHorizontal: Spacing.section, gap: 12 },
  eventCard: { borderRadius: Radius.xl, overflow: 'hidden', ...Shadows.md },
  eventHero: { height: 180, justifyContent: 'space-between', padding: Spacing.md },
  eventOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  eventChipRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  seatsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.40)',
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  seatsChipText: { ...Typography.micro, color: '#FFD60A' },
  eventCardBottom: { gap: 5 },
  eventCardTitle: { ...Typography.h3, color: '#FFF', letterSpacing: -0.3 },
  eventCardMeta: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  eventCardMetaText: { ...Typography.caption, color: 'rgba(255,255,255,0.70)' },

  // Food cards
  foodList: { paddingHorizontal: Spacing.section, gap: 10 },
  restCard: { overflow: 'hidden' },
  restBanner: { height: 90, alignItems: 'center', justifyContent: 'center' },
  restEmoji: { fontSize: 44 },
  restInfo: { padding: Spacing.md, gap: 4 },
  restTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  restName: { ...Typography.h4, color: Colors.text },
  restRating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { ...Typography.label, color: Colors.text, fontSize: 12 },
  restMeta: { ...Typography.caption, color: Colors.textSecondary },

  // Challenge banner
  challengeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.darkBg,
    marginHorizontal: Spacing.section,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.highlight,
    ...Shadows.colored('#6C63FF'),
  },
  challengeLeft: { gap: 6, flex: 1 },
  challengeLabel: { ...Typography.micro, color: Colors.accent, letterSpacing: 1.5 },
  challengeTitle: { ...Typography.h2, color: '#FFF' },
  challengeMeta: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  easyBadge: {
    backgroundColor: Colors.successLight,
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  easyText: { ...Typography.micro, color: Colors.success, fontWeight: '700' as const },
  challengeDesc: { ...Typography.caption, color: Colors.textDimmed },
  challengeRight: { alignItems: 'center', gap: 8, marginLeft: Spacing.xl },
  challengeIcon: { fontSize: 36 },
  challengeCta: { ...Typography.label, color: Colors.accent, fontWeight: '700' as const, fontSize: 13 },
});
