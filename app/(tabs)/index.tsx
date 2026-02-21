import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, {
  FadeInDown,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../src/components/ui/Card';
import StreakGrid from '../../src/components/ui/StreakGrid';
import { StreakDay } from '../../src/data/challenges';
import { useCampusAlerts } from '../../src/hooks/useCampusAlerts';
import { useHybridStore } from '../../src/store/hybridStore';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../src/theme';

const { width: SW } = Dimensions.get('window');

/** Build a 52-week streak grid from past challenge dates (stub: random for now) */
function buildStreakData(): StreakDay[] {
  const days: StreakDay[] = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().split('T')[0],
      solved: Math.random() > 0.65 ? Math.floor(Math.random() * 4) + 1 : 0,
      isToday: i === 0,
    });
  }
  return days;
}
const streakData = buildStreakData();

const SHORTCUTS = [
  { id: 'coding', title: 'Coding', icon: 'code-slash' as const, route: '/coding-challenge' },
  { id: 'faculty', title: 'Faculty', icon: 'people' as const, route: '/teachers' },
  { id: 'map', title: 'Map', icon: 'map' as const, route: '/campus-map' },
  { id: 'print', title: 'Print', icon: 'print' as const, route: '/print' },
];

const AnimatedLayout = Animated.createAnimatedComponent(View);
const AnimatedContent = Animated.createAnimatedComponent(View);

function SpringCard({ children, style, onPress, delay = 0, ...props }: any) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value
  }));

  return (
    <AnimatedLayout layout={Layout.springify()} entering={FadeInDown.delay(delay).springify().damping(14)} style={style}>
      <Pressable
        onPressIn={() => {
          scale.value = withSpring(0.95, { damping: 12, stiffness: 250 });
          opacity.value = withSpring(0.9, { damping: 12, stiffness: 250 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 14, stiffness: 200 });
          opacity.value = withSpring(1, { damping: 14, stiffness: 200 });
        }}
        onPress={onPress}
        style={{ flex: 1 }}
        {...props}
      >
        <AnimatedContent style={[{ flex: 1 }, animatedStyle]}>
          {children}
        </AnimatedContent>
      </Pressable>
    </AnimatedLayout>
  );
}

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { data: liveAlerts = [] } = useCampusAlerts();
  const campusAlerts = liveAlerts;
  const storeEvents = useHybridStore((s) => s.events);
  const featuredEvent = storeEvents.find((ev: any) => ev.is_featured || ev.isFeatured) ?? storeEvents[0];

  const alertCarouselRef = React.useRef<any>(null);
  const [activeAlertIndex, setActiveAlertIndex] = React.useState(0);

  React.useEffect(() => {
    if (campusAlerts.length <= 1) return;
    const interval = setInterval(() => {
      setActiveAlertIndex((prev) => {
        const next = (prev + 1) % campusAlerts.length;
        alertCarouselRef.current?.scrollTo({
          x: next * (SW - Spacing.section * 2 + Spacing.md),
          animated: true,
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [campusAlerts.length]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.nameText}>Yugan</Text>
          </View>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* DAILY SUMMARY */}
        <View style={styles.summaryWrap}>
          <View style={styles.summaryIconWrap}>
            <Ionicons name="sparkles" size={14} color="#8B5CF6" />
          </View>
          <Text style={styles.summaryText}>
            You have <Text style={styles.summaryHighlight}>{storeEvents.length} events</Text> and <Text style={styles.summaryHighlight}>1 assignment</Text> pending today.
          </Text>
        </View>

        {/* GLOBAL SEARCH */}
        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search apps, events, food..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Ionicons name="mic" size={20} color="#0CAE74" />
          </View>
        </View>

        {/* SPOTLIGHT GREEN CARD */}
        <SpringCard style={styles.spotlightWrap} delay={100} onPress={() => featuredEvent && router.push(`/event/${(featuredEvent as any).id}` as any)}>
          <LinearGradient
            colors={['#0CAE74', '#089260']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.spotlightCard}
          >
            <View style={styles.spotlightContent}>
              <Text style={styles.spotlightLabel}>SPOTLIGHT</Text>
              <Text style={styles.spotlightTitle}>{featuredEvent ? (featuredEvent as any).title : 'Upcoming Event'}</Text>
              <Text style={styles.spotlightSubtitle}>{featuredEvent ? `${(featuredEvent as any).date} · ${(featuredEvent as any).time}` : ''}</Text>
            </View>
            <View style={styles.spotlightArrowWrap}>
              <Ionicons name="arrow-forward" size={16} color="#0CAE74" />
            </View>
          </LinearGradient>
        </SpringCard>

        {/* CAMPUS ALERTS CAROUSEL */}
        {campusAlerts.length > 0 && (
          <View style={styles.carouselContainer}>
            <Animated.ScrollView
              ref={alertCarouselRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.alertsCarousel}
              snapToInterval={SW - Spacing.section * 2 + Spacing.md}
              decelerationRate="fast"
              onMomentumScrollEnd={(e: any) => {
                const offsetX = e.nativeEvent.contentOffset.x;
                const index = Math.round(offsetX / (SW - Spacing.section * 2 + Spacing.md));
                setActiveAlertIndex(index);
              }}
              scrollEventThrottle={16}
            >
              {campusAlerts.map((alert: any, idx: number) => {
                // Determine styling based on alert type
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
                  <SpringCard key={alert.id} delay={200 + idx * 50} style={[styles.alertCard, { backgroundColor: alertBg, borderColor: alertBorder }]}>
                    <Text style={styles.alertEmoji}>{alert.emoji}</Text>
                    <View style={styles.alertText}>
                      <Text style={styles.alertTitle} numberOfLines={1}>{alert.title}</Text>
                      <Text style={styles.alertDesc} numberOfLines={2}>{alert.description}</Text>
                    </View>
                  </SpringCard>
                );
              })}
            </Animated.ScrollView>

            {/* Pagination Dots */}
            {campusAlerts.length > 1 && (
              <View style={styles.paginationRow}>
                {campusAlerts.map((_: any, i: number) => (
                  <View
                    key={i}
                    style={[
                      styles.paginationDot,
                      i === activeAlertIndex && styles.paginationDotActive
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* SHORTCUTS */}
        <View style={styles.shortcutsSection}>
          <Text style={styles.shortcutsTitle}>Shortcuts</Text>
          <View style={styles.shortcutsGrid}>
            {SHORTCUTS.map((shortcut, idx) => (
              <SpringCard key={shortcut.id} delay={300 + idx * 50} style={styles.shortcutItem} onPress={() => router.push(shortcut.route as any)}>
                <View style={styles.shortcutIconWrap}>
                  <Ionicons name={shortcut.icon} size={22} color="#4A4A4A" />
                </View>
                <Text style={styles.shortcutText}>{shortcut.title}</Text>
              </SpringCard>
            ))}
          </View>
        </View>

        {/* CODING STREAK GRAPH */}
        <View style={styles.streakSection}>
          <View style={styles.streakHeader}>
            <Text style={styles.streakTitle}>Coding Activity</Text>
            <Text style={styles.streakCount}>14 Day Streak 🔥</Text>
          </View>
          <Card style={styles.streakCard} shadow="xs">
            <StreakGrid data={streakData} />
            <View style={styles.legendRow}>
              <Text style={styles.legendText}>Less</Text>
              {['#F2F2F7', '#C6EFCE', '#70C97A', '#0C9B52'].map((c) => (
                <View key={c} style={[styles.legendDot, { backgroundColor: c }]} />
              ))}
              <Text style={styles.legendText}>More</Text>
            </View>
          </Card>
        </View>

      </Animated.ScrollView>

      {/* BOTTOM FADE OVERLAY */}
      <View style={styles.bottomFade} pointerEvents="none">
        <LinearGradient
          colors={['rgba(255,255,255,0)', '#FFFFFF']}
          style={StyleSheet.absoluteFill}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { paddingBottom: 110 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.section,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  welcomeText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  nameText: {
    fontSize: 24,
    color: '#111827',
    fontWeight: '700',
  },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Summary
  summaryWrap: {
    paddingHorizontal: Spacing.section,
    marginBottom: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryText: {
    flex: 1,
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
    fontWeight: '500',
  },
  summaryHighlight: {
    color: '#111827',
    fontWeight: '700',
  },

  // Search
  searchWrap: {
    paddingHorizontal: Spacing.section,
    marginBottom: Spacing.xl,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    padding: 0,
  },

  // Spotlight Green Card
  spotlightWrap: {
    marginHorizontal: Spacing.section,
    marginBottom: Spacing.lg,
    borderRadius: 24,
    ...Shadows.md,
    shadowColor: '#0CAE74',
    shadowOpacity: 0.25,
    overflow: 'hidden',
  },
  spotlightCard: {
    padding: 24,
    minHeight: 150,
  },
  spotlightContent: {
    flex: 1,
    paddingRight: 20,
  },
  spotlightLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#D1FAE5',
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  spotlightTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 30,
    marginBottom: 6,
  },
  spotlightSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  spotlightArrowWrap: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Carousel
  carouselContainer: {
    marginBottom: Spacing.xl,
  },
  alertsCarousel: {
    paddingHorizontal: Spacing.section,
    gap: Spacing.md,
  },
  alertCard: {
    width: SW - Spacing.section * 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    ...Shadows.sm,
    shadowOpacity: 0.05,
  },
  alertEmoji: { fontSize: 28 },
  alertText: { flex: 1 },
  alertTitle: { fontSize: 16, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  alertDesc: { fontSize: 13, color: Colors.textSecondary, lineHeight: 18 },

  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.md,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  paginationDotActive: {
    backgroundColor: Colors.primary,
    width: 16,
  },

  // Coding Streak Graph
  streakSection: {
    paddingHorizontal: Spacing.section,
    marginBottom: Spacing.xl,
  },
  streakHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.md,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  streakCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F97316',
  },
  streakCard: {
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: '#FFFFFF',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: Spacing.md,
    gap: 4,
  },
  legendText: {
    ...Typography.micro,
    color: Colors.textSecondary,
    marginHorizontal: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },

  // Shortcuts
  shortcutsSection: {
    paddingHorizontal: Spacing.section,
    marginBottom: Spacing.xxl + Spacing.lg,
  },
  shortcutsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  shortcutItem: {
    alignItems: 'center',
    width: (SW - Spacing.section * 2) / 4,
  },
  shortcutIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  shortcutText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },

  // Fade
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    zIndex: 10,
  },
});
