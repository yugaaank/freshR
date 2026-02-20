import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { events } from '../../src/data/events';
import { campusAlerts } from '../../src/data/homeData';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../src/theme';

const { width: SW } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_SIZE = (SW - Spacing.section * 2 - CARD_GAP) / 2;

// ─── Service cards (Swiggy-style 2×2 grid) ───────────────────────────────────
const SERVICE_CARDS = [
  {
    id: 'food',
    title: 'FOOD',
    subtitle: 'ORDER FROM CAMPUS',
    badge: '3 counters',
    emoji: '🍱',
    colors: ['#FFE8CC', '#FFF3E8'],
    badgeBg: '#FF6B35',
    route: '/(tabs)/food',
  },
  {
    id: 'events',
    title: 'EVENTS',
    subtitle: 'WHAT\'S HAPPENING',
    badge: '5 this week',
    emoji: '🎟️',
    colors: ['#DDE3FF', '#EEF2FF'],
    badgeBg: '#6C63FF',
    route: '/(tabs)/explore',
  },
  {
    id: 'academics',
    title: 'ACADEMICS',
    subtitle: 'YOUR GRADES & CGPA',
    badge: 'CGPA: 8.4',
    emoji: '📚',
    colors: ['#D1F5D3', '#EDFBF3'],
    badgeBg: '#22C55E',
    route: '/(tabs)/academics',
  },
  {
    id: 'coding',
    title: 'CODING',
    subtitle: 'DAILY CHALLENGE',
    badge: '🔥 14-day streak',
    emoji: '💻',
    colors: ['#D9D3FF', '#F0EEFF'],
    badgeBg: '#7C3AED',
    route: '/coding-challenge',
  },
  {
    id: 'faculty',
    title: 'FACULTY',
    subtitle: 'CONNECT WITH TEACHERS',
    badge: 'Quick access',
    emoji: '👩‍🏫',
    colors: ['#FFD1DE', '#FFF0F5'],
    badgeBg: '#F43F5E',
    route: '/teachers',
  },
  {
    id: 'map',
    title: 'CAMPUS MAP',
    subtitle: 'FIND YOUR WAY',
    badge: 'Navigate',
    emoji: '🗺️',
    colors: ['#D3F1F5', '#F0FAFB'],
    badgeBg: '#0891B2',
    route: '/campus-map',
  },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function SpringCard({ children, style, onPress, delay = 0, ...props }: any) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPressIn={() => { scale.value = withSpring(0.96, { damping: 15, stiffness: 200 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 200 }); }}
      onPress={onPress}
      style={[style, animatedStyle]}
      entering={FadeInDown.delay(delay).springify()}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const [search, setSearch] = useState('');

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      marginTop: interpolate(scrollOffset.value, [0, 80], [0, -80], Extrapolation.CLAMP),
      transform: [{ translateY: interpolate(scrollOffset.value, [0, 80], [0, -80], Extrapolation.CLAMP) }],
      opacity: interpolate(scrollOffset.value, [0, 40], [1, 0], Extrapolation.CLAMP),
    };
  });

  const searchLower = search.trim().toLowerCase();

  const filteredEvents = events.filter((e) =>
    searchLower === '' || e.title.toLowerCase().includes(searchLower) || e.category.toLowerCase().includes(searchLower)
  ).slice(0, 5);

  const filteredCards = SERVICE_CARDS.filter((c) =>
    searchLower === '' || c.title.toLowerCase().includes(searchLower) || c.subtitle.toLowerCase().includes(searchLower)
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ═══ BLINKIT-STYLE HEADER ═══ */}
      <Animated.View style={[{ overflow: 'hidden' }, headerAnimatedStyle]}>
        <LinearGradient
          colors={['#FFF3E8', '#FFFFFF']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={Colors.primary} />
              <Text style={styles.locationText}>Main Campus</Text>
              <Ionicons name="chevron-down" size={14} color={Colors.text} />
            </View>
            <Text style={styles.greeting}>{greeting()}, Yugan 👋</Text>
          </View>
          <View style={styles.avatarBtn}>
            <Ionicons name="person" size={22} color={Colors.textSecondary} />
          </View>
        </View>
      </Animated.View>

      {/* ═══ BLINKIT-STYLE SEARCH BAR ═══ */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for food, events, faculty…"
            placeholderTextColor={Colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
          <Ionicons name="mic" size={18} color={Colors.primary} />
        </View>
      </View>

      <Animated.ScrollView
        ref={scrollRef as any}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scroll}
      >
        {/* ═══ PROMO BANNER (Blinkit ₹50 OFF style) ═══ */}
        <SpringCard style={styles.promoBannerWrap} delay={100} onPress={() => router.push('/(tabs)/explore')}>
          <LinearGradient
            colors={['#1A5C3A', '#0D3D27']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.promoBanner}
          >
            <View style={styles.promoLeft}>
              <Text style={styles.promoSmall}>TODAY&apos;S HIGHLIGHT</Text>
              <Text style={styles.promoTitle}>HackMIT{'\n'}This Weekend 🚀</Text>
              <View style={styles.promoCta}>
                <Text style={styles.promoCtaText}>EXPLORE EVENTS</Text>
              </View>
            </View>
            <Text style={styles.promoEmoji}>🏆</Text>
          </LinearGradient>
        </SpringCard>

        {/* ═══ CAMPUS ALERTS ═══ */}
        {campusAlerts.map((alert, idx) => {
          let alertBg = '#FFF8F0';
          let alertBorder = '#FFE8CC';
          const titleLower = alert.title.toLowerCase();

          if (titleLower.includes('close') || titleLower.includes('urgent') || titleLower.includes('library')) {
            alertBg = Colors.errorLight;
            alertBorder = '#FFDCD9';
          } else if (titleLower.includes('new') || titleLower.includes('menu') || titleLower.includes('available')) {
            alertBg = Colors.successLight;
            alertBorder = '#C3F2D6';
          }

          return (
            <SpringCard key={alert.id} delay={150 + idx * 50} style={[styles.alertRow, { backgroundColor: alertBg, borderColor: alertBorder }]}>
              <Text style={styles.alertEmoji}>{alert.emoji}</Text>
              <View style={styles.alertText}>
                <Text style={styles.alertTitle}>{alert.title}</Text>
                <Text style={styles.alertDesc}>{alert.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
            </SpringCard>
          );
        })}

        {/* ═══ SWIGGY-STYLE SERVICES GRID ═══ */}
        {filteredCards.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>What would you like?</Text>
            <View style={styles.grid}>
              {filteredCards.map((card, idx) => (
                <SpringCard
                  key={card.id}
                  delay={200 + idx * 50}
                  onPress={() => router.push(card.route as any)}
                  style={styles.cardWrap}
                >
                  <LinearGradient
                    colors={card.colors as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                  >
                    <View>
                      <Text style={styles.cardTitle}>{card.title}</Text>
                      <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                      <View style={[styles.cardBadge, { backgroundColor: card.badgeBg }]}>
                        <Text style={styles.cardBadgeText}>{card.badge}</Text>
                      </View>
                    </View>
                    <Text style={styles.cardEmoji}>{card.emoji}</Text>
                  </LinearGradient>
                </SpringCard>
              ))}
            </View>
          </>
        )}

        {/* ═══ UPCOMING EVENTS (horizontal strip) ═══ */}
        {filteredEvents.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Events Near You</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
                <Text style={styles.seeAll}>See all →</Text>
              </TouchableOpacity>
            </View>
            <Animated.ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.eventStrip}
            >
              {filteredEvents.map((ev, idx) => (
                <SpringCard
                  key={ev.id}
                  delay={250 + idx * 50}
                  style={styles.eventCardWrap}
                  onPress={() => router.push(`/event/${ev.id}` as any)}
                >
                  <ImageBackground
                    source={{ uri: ev.image }}
                    style={[StyleSheet.absoluteFill, { backgroundColor: ev.colorBg ?? '#1C1C1E' }]}
                    imageStyle={{ borderRadius: Radius.xl }}
                  >
                    <LinearGradient
                      colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.85)']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={styles.eventCard}
                    >
                      <View style={styles.eventTop}>
                        <View style={styles.eventCatPill}>
                          <Text style={styles.eventCatText}>{ev.category}</Text>
                        </View>
                        {ev.seatsLeft <= 15 && (
                          <View style={styles.urgencyPill}>
                            <Text style={styles.urgencyText}>⚡ {ev.seatsLeft} left</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.eventBottom}>
                        <Text style={styles.eventTitle} numberOfLines={2}>{ev.title}</Text>
                        <Text style={styles.eventMeta}>📅 {ev.date} · {ev.time}</Text>
                      </View>
                    </LinearGradient>
                  </ImageBackground>
                </SpringCard>
              ))}
            </Animated.ScrollView>
          </>
        )}

        {/* ═══ CODING STREAK BANNER ═══ */}
        <SpringCard
          delay={400}
          onPress={() => router.push('/coding-challenge')}
          style={styles.challengeBannerWrap}
        >
          <LinearGradient
            colors={['#8B7FFF', '#4C46D6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.challengeBanner}
          >
            <View>
              <Text style={styles.challengeLabel}>DAILY CHALLENGE ACTIVE</Text>
              <Text style={styles.challengeTitle}>🔥 14-Day Streak!</Text>
              <Text style={styles.challengeSub}>Keep it going — solve today&apos;s problem</Text>
            </View>
            <View style={styles.challengeArrow}>
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </View>
          </LinearGradient>
        </SpringCard>
      </Animated.ScrollView>

      {/* ═══ BOTTOM FADE OVERLAY ═══ */}
      <View style={styles.bottomFade} pointerEvents="none">
        <LinearGradient
          colors={['rgba(255,255,255,0)', '#FFFFFF']}
          style={StyleSheet.absoluteFill}
        />
      </View>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },

  // ── Blinkit Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.section,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  headerLeft: { flex: 1 },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  locationText: {
    ...Typography.label,
    color: Colors.text,
    fontWeight: '700' as const,
    fontSize: 15,
  },
  greeting: {
    ...Typography.h2,
    color: Colors.text,
    fontSize: 22,
  },
  avatarBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },

  // ── Blinkit Search ──
  searchWrap: {
    paddingHorizontal: Spacing.section,
    paddingBottom: Spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    ...Typography.body2,
    color: Colors.text,
    padding: 0,
  },

  // ── Scroll content ──
  scroll: { paddingBottom: 110 },

  // ── Promo banner (Blinkit ₹50 OFF style) ──
  promoBannerWrap: {
    marginHorizontal: Spacing.section,
    marginBottom: Spacing.md,
    borderRadius: 24,
    overflow: 'hidden',
  },
  promoBanner: {
    padding: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  promoLeft: { flex: 1 },
  promoSmall: { ...Typography.micro, color: 'rgba(255,255,255,0.65)', letterSpacing: 1.5, marginBottom: 4 },
  promoTitle: { ...Typography.h3, color: '#FFF', lineHeight: 28, marginBottom: Spacing.md },
  promoCta: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    borderRadius: Radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  promoCtaText: { ...Typography.label, color: '#FFF', fontWeight: '700' as const, fontSize: 12 },
  promoEmoji: { fontSize: 72, marginLeft: Spacing.md },

  // ── Campus Alerts ──
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing.section,
    marginBottom: Spacing.sm,
    backgroundColor: '#FFF8F0',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: '#FFE8CC',
  },
  alertEmoji: { fontSize: 22 },
  alertText: { flex: 1 },
  alertTitle: { ...Typography.h5, color: Colors.text },
  alertDesc: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },

  // ── Section header ──
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.section,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginHorizontal: Spacing.section,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  seeAll: { ...Typography.label, color: Colors.primary, fontWeight: '600' as const },

  // ── Swiggy 2×2 Service Grid ──
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.section,
    gap: CARD_GAP,
  },
  cardWrap: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800' as const,
    color: Colors.text,
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    ...Typography.micro,
    color: Colors.textSecondary,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  cardBadgeText: {
    ...Typography.micro,
    color: '#FFF',
    fontWeight: '700' as const,
  },
  cardEmoji: {
    fontSize: 52,
    alignSelf: 'flex-end',
    marginBottom: -6,
    marginRight: -4,
  },

  // ── Event horizontal strip ──
  eventStrip: {
    paddingHorizontal: Spacing.section,
    gap: 12,
  },
  eventCardWrap: {
    width: 200,
    height: 160,
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  eventCard: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  eventTop: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  eventCatPill: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  eventCatText: { ...Typography.micro, color: '#FFF', fontWeight: '700' as const },
  urgencyPill: {
    backgroundColor: '#FF6B35',
    borderRadius: Radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  urgencyText: { ...Typography.micro, color: '#FFF', fontWeight: '700' as const },
  eventBottom: { gap: 4 },
  eventEmoji: { fontSize: 28, marginBottom: 2 },
  eventTitle: { ...Typography.h5, color: '#FFF', lineHeight: 18 },
  eventMeta: { ...Typography.micro, color: 'rgba(255,255,255,0.7)' },

  // ── Coding challenge streak banner ──
  challengeBannerWrap: {
    marginHorizontal: Spacing.section,
    marginTop: Spacing.xl,
    borderRadius: Radius.xl,
    ...Shadows.colored('#6C63FF'),
    overflow: 'hidden',
  },
  challengeBanner: {
    padding: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  challengeLabel: { ...Typography.micro, color: '#6C63FF', letterSpacing: 1.5, marginBottom: 4 },
  challengeTitle: { ...Typography.h3, color: '#FFF' },
  challengeSub: { ...Typography.caption, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  challengeArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Bottom fade ──
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 10,
  },
});
