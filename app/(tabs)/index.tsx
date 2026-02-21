import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useMemo, useState, useEffect } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  BackHandler,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../src/components/ui/Card';
import StreakGrid from '../../src/components/ui/StreakGrid';
import SearchBar from '../../src/components/ui/SearchBar';
import { useCampusAlerts } from '../../src/hooks/useCampusAlerts';
import { useChallengeStore } from '../../src/store/challengeStore';
import { useUserStore } from '../../src/store/userStore';
import { useTeachers } from '../../src/hooks/useTeachers';
import { useAssignments } from '../../src/hooks/useAcademics';
import { useEvents } from '../../src/hooks/useEvents';
import { useCartStore } from '../../src/store/cartStore';
import { useCalendarStore } from '../../src/store/calendarStore';
import { useRestaurants, useMenuItems } from '../../src/hooks/useFood';
import { Colors, Radius, Spacing, Typography, Gradients, Palette } from '../../src/theme';
import dayjs from 'dayjs';

const { width: SW, height: SH } = Dimensions.get('window');

const SHORTCUTS = [
  { id: 'coding', title: 'Coding Challenge', icon: 'code-slash' as const, route: '/coding-challenge', keywords: ['daily', 'problem', 'solve', 'javascript', 'typescript'] },
  { id: 'faculty', title: 'Faculty Directory', icon: 'people' as const, route: '/teachers', keywords: ['teachers', 'professors', 'staff', 'office', 'cabin'] },
  { id: 'map', title: 'Campus Map', icon: 'map' as const, route: '/campus-map', keywords: ['navigation', 'location', 'where', 'building', 'library'] },
  { id: 'print', title: 'Print & Stationery', icon: 'print' as const, route: '/print', keywords: ['copy', 'stationery', 'paper', 'request', 'pickup'] },
  { id: 'grades', title: 'Grades & GPA', icon: 'school' as const, route: '/grades', keywords: ['results', 'sgpa', 'cgpa', 'marks', 'academic'] },
  { id: 'attendance', title: 'Attendance', icon: 'checkmark-done' as const, route: '/attendance', keywords: ['presence', 'classes', 'history'] },
  { id: 'food', title: 'Food Ordering', icon: 'fast-food' as const, route: '/(tabs)/food', keywords: ['canteen', 'menu', 'lunch', 'dinner', 'snacks', 'eat'] },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { data: liveAlerts = [] } = useCampusAlerts();
  const { data: teachers = [] } = useTeachers();
  const { data: storeEvents = [] } = useEvents();
  const { data: restaurants = [] } = useRestaurants();
  const { data: menuItems = [] } = useMenuItems();
  
  const activeOrderId = useCartStore(s => s.activeOrderId);
  const { registeredEvents, profile } = useUserStore();
  const streakData = useChallengeStore(s => s.streakData);
  const { data: assignments = [] } = useAssignments(profile?.id ?? null);
  const customEvents = useCalendarStore(s => s.customEvents);

  const filteredAlerts = useMemo(() => {
    return liveAlerts.filter((alert: any) => !alert.title.toLowerCase().includes('mess menu'));
  }, [liveAlerts]);
  
  const featuredEvent = storeEvents.find((ev: any) => ev.is_featured || ev.isFeatured) ?? storeEvents[0];
  const alertCarouselRef = React.useRef<any>(null);
  const [activeAlertIndex, setActiveAlertIndex] = useState(0);

  const recentlyRegistered = useMemo(() => {
    return storeEvents.filter(e => registeredEvents.includes(e.id)).slice(0, 2);
  }, [storeEvents, registeredEvents]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 150);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Back button handler
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (searchQuery.length > 0) {
        setSearchQuery('');
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [searchQuery]);

  const searchResults = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return null;

    const filteredShortcuts = SHORTCUTS.filter(s => 
      s.title.toLowerCase().includes(q) || 
      s.keywords.some(k => k.toLowerCase().includes(q))
    );

    const filteredEvents = storeEvents.filter(e => 
      e.title.toLowerCase().includes(q) || 
      e.category.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q)
    );

    const filteredFood = menuItems.filter(m => {
      const rest = restaurants.find(r => r.id === m.restaurant_id);
      return m.name.toLowerCase().includes(q) || 
             m.description.toLowerCase().includes(q) ||
             rest?.name.toLowerCase().includes(q);
    });

    const filteredTeachers = (teachers as any[]).filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.subject.toLowerCase().includes(q) ||
      t.department.toLowerCase().includes(q)
    );

    return {
      shortcuts: filteredShortcuts,
      events: filteredEvents,
      food: filteredFood.slice(0, 5),
      teachers: filteredTeachers.slice(0, 5),
    };
  }, [debouncedQuery, storeEvents, teachers]);

  const hasResults = searchResults && (
    searchResults.shortcuts.length > 0 || 
    searchResults.events.length > 0 || 
    searchResults.food.length > 0 ||
    searchResults.teachers.length > 0
  );

  const pendingAssignmentsCount = useMemo(() => 
    assignments.filter(a => a.status === 'pending').length
  , [assignments]);

  const todayCustomEventsCount = useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD');
    return customEvents.filter(e => e.date === today).length;
  }, [customEvents]);

  const todayClubEventsCount = useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD');
    return storeEvents.filter((e: any) => e.date === today).length;
  }, [storeEvents]);

  const totalTodayEvents = todayClubEventsCount + todayCustomEventsCount;

  const navigateToResult = (route: string) => {
    Keyboard.dismiss();
    setSearchQuery('');
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/profile')}>
            <Image source={{ uri: profile?.avatar_url ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop' }} style={styles.avatar} />
            <View style={styles.profileBadge}>
              <Ionicons name="notifications" size={8} color="#FFF" />
            </View>
          </TouchableOpacity>
          <View>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.nameText}>{profile?.name ?? 'Yugank Rathore'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bellBtn} onPress={() => router.push('/notifications')}>
          <Ionicons name="notifications-outline" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="always"
        stickyHeaderIndices={[1]}
      >
        <View style={styles.summaryWrap}>
          <View style={styles.summaryIconWrap}>
            <Ionicons name="sparkles" size={14} color={Colors.accent} />
          </View>
          <Text style={styles.summaryText}>
            You have <Text style={styles.summaryHighlight}>{totalTodayEvents} event{totalTodayEvents !== 1 ? 's' : ''}</Text> and <Text style={styles.summaryHighlight}>{pendingAssignmentsCount} assignment{pendingAssignmentsCount !== 1 ? 's' : ''}</Text> pending today.
          </Text>
        </View>

        <View style={styles.searchContainerSticky}>
          <SearchBar
            placeholder="Search apps, food, faculty..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
          />
        </View>

        <View style={{ flex: 1 }}>
          {searchQuery.length > 0 ? (
            <View style={styles.searchResultsContainer}>
              <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
                {!hasResults ? (
                  <View style={styles.noResults}>
                    <Ionicons name="search-outline" size={48} color={Colors.textTertiary} />
                    <Text style={styles.noResultsText}>No results for "{searchQuery}"</Text>
                  </View>
                ) : (
                  <View style={styles.searchResultsContent}>
                    {searchResults.shortcuts.length > 0 && (
                      <View style={styles.resultSection}>
                        <Text style={styles.resultSectionTitle}>APPS</Text>
                        {searchResults.shortcuts.map(s => (
                          <TouchableOpacity key={s.id} style={styles.resultItem} onPress={() => navigateToResult(s.route)}>
                            <Ionicons name={s.icon} size={18} color={Colors.primary} />
                            <Text style={styles.resultText}>{s.title}</Text>
                            <Ionicons name="chevron-forward" size={14} color={Colors.textTertiary} />
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                    {searchResults.teachers.length > 0 && (
                      <View style={styles.resultSection}>
                        <Text style={styles.resultSectionTitle}>FACULTY</Text>
                        {searchResults.teachers.map(t => (
                          <TouchableOpacity key={t.id} style={styles.resultItem} onPress={() => navigateToResult('/teachers')}>
                            <View style={[styles.resultIconWrap, { backgroundColor: Colors.infoLight }]}>
                              <Ionicons name="person" size={18} color={Colors.info} />
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.resultText}>{t.name}</Text>
                              <Text style={styles.resultSubtext}>{t.subject} · {t.department}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={14} color={Colors.textTertiary} />
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                    {searchResults.events.length > 0 && (
                      <View style={styles.resultSection}>
                        <Text style={styles.resultSectionTitle}>EVENTS</Text>
                        {searchResults.events.map(e => (
                          <TouchableOpacity key={e.id} style={styles.resultItem} onPress={() => navigateToResult(`/event/${e.id}`)}>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.resultText}>{e.title}</Text>
                              <Text style={styles.resultSubtext}>{e.venue}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={14} color={Colors.textTertiary} />
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                    {searchResults.food.length > 0 && (
                      <View style={styles.resultSection}>
                        <Text style={styles.resultSectionTitle}>FOOD</Text>
                        {searchResults.food.map(f => (
                          <TouchableOpacity key={f.id} style={styles.resultItem} onPress={() => navigateToResult('/(tabs)/food')}>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.resultText}>{f.name}</Text>
                              <Text style={styles.resultSubtext} numberOfLines={1}>{f.description}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={14} color={Colors.textTertiary} />
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </ScrollView>
            </View>
          ) : (
            <View>
              {activeOrderId && (
                <TouchableOpacity 
                  style={styles.activeOrderBanner}
                  onPress={() => router.push({ pathname: '/order-tracking', params: { orderId: activeOrderId } })}
                >
                  <View style={styles.activeOrderLeft}>
                    <View style={styles.activeOrderIconWrap}>
                      <Ionicons name="restaurant" size={16} color="#FFF" />
                    </View>
                    <View>
                      <Text style={styles.activeOrderTitle}>Food is being prepared</Text>
                      <Text style={styles.activeOrderSub}>Track your live order status</Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.spotlightWrap} onPress={() => featuredEvent && router.push(`/event/${(featuredEvent as any).id}` as any)}>
                <View style={[styles.spotlightCard, { backgroundColor: Colors.primary }]}>
                  <View style={styles.spotlightContent}>
                    <Text style={styles.spotlightLabel}>SPOTLIGHT</Text>
                    <Text style={styles.spotlightTitle}>{featuredEvent ? (featuredEvent as any).title : 'Upcoming Event'}</Text>
                    <Text style={styles.spotlightSubtitle}>{featuredEvent ? `${(featuredEvent as any).date} · ${(featuredEvent as any).time}` : ''}</Text>
                  </View>
                  <View style={styles.spotlightArrowWrap}>
                    <Ionicons name="arrow-forward" size={16} color={Colors.primary} />
                  </View>
                </View>
              </TouchableOpacity>

              {filteredAlerts.length > 0 && (
                <View style={styles.carouselContainer}>
                  <ScrollView
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
                  >
                    {filteredAlerts.map((alert: any, idx: number) => {
                      let alertBg = Colors.tagOrange;
                      let alertBorder = Colors.border;
                      const titleLower = alert.title.toLowerCase();
                      if (titleLower.includes('close') || titleLower.includes('urgent')) { alertBg = Colors.errorLight; alertBorder = Colors.error; }
                      else if (titleLower.includes('new') || titleLower.includes('menu')) { alertBg = Colors.successLight; alertBorder = Colors.success; }

                      return (
                        <View key={alert.id} style={[styles.alertCard, { backgroundColor: alertBg, borderColor: alertBorder }]}>
                          <Text style={styles.alertEmoji}>{alert.emoji}</Text>
                          <View style={styles.alertText}>
                            <Text style={styles.alertTitle} numberOfLines={1}>{alert.title}</Text>
                            <Text style={styles.alertDesc} numberOfLines={2}>{alert.description}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              )}

              <View style={styles.shortcutsSection}>
                <Text style={styles.shortcutsTitle}>Shortcuts</Text>
                <View style={styles.shortcutsGrid}>
                  {SHORTCUTS.slice(0, 4).map((shortcut, idx) => {
                    return (
                      <TouchableOpacity key={shortcut.id} style={styles.shortcutItem} onPress={() => router.push(shortcut.route as any)}>
                        <View style={styles.shortcutIconWrap}>
                          <Ionicons name={shortcut.icon} size={22} color={Colors.primary} />
                        </View>
                        <Text style={styles.shortcutText}>{shortcut.title.split(' ')[0]}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {recentlyRegistered.length > 0 && (
                <View style={styles.recentSection}>
                  <Text style={styles.shortcutsTitle}>Recent Activity</Text>
                  <View style={styles.recentList}>
                    {recentlyRegistered.map((event, idx) => {
                      return (
                        <TouchableOpacity 
                          key={event.id} 
                          style={styles.recentItem}
                          onPress={() => router.push(`/event/${event.id}` as any)}
                        >
                          <View style={styles.recentIconWrap}>
                            <Ionicons name="calendar" size={18} color={Colors.primary} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.recentTitle}>Registered for {event.title}</Text>
                            <Text style={styles.recentMeta}>{dayjs(event.date).format('MMM D')} · {event.venue}</Text>
                          </View>
                          <Ionicons name="chevron-forward" size={14} color={Colors.mutedForeground} />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              <View style={styles.streakSection}>
                <View style={styles.streakHeader}>
                  <Text style={styles.streakTitle}>Coding Activity</Text>
                  <Text style={styles.streakCount}>14 Day Streak 🔥</Text>
                </View>
                <Card style={styles.streakCard}>
                  <StreakGrid data={streakData} />
                </Card>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomFade} pointerEvents="none">
        <LinearGradient colors={Gradients.white} style={StyleSheet.absoluteFill} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 110 },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: Spacing.section, 
    paddingTop: Spacing.md, 
    paddingBottom: Spacing.md, 
    backgroundColor: Colors.background 
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    padding: 2,
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  profileBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.error,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeText: { ...Typography.caption, color: Colors.textSecondary },
  nameText: { ...Typography.h2, color: Colors.text },
  bellBtn: { 
    width: 40, 
    height: 40, 
    borderRadius: Radius.md, 
    backgroundColor: Colors.surface, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: Colors.divider,
  },
  summaryWrap: { 
    paddingHorizontal: Spacing.section, 
    marginBottom: Spacing.sm, 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 10 
  },
  summaryIconWrap: { 
    width: 24, 
    height: 24, 
    borderRadius: Radius.pill, 
    backgroundColor: Colors.accentLight, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  summaryText: { flex: 1, ...Typography.caption, color: Colors.textSecondary },
  summaryHighlight: { color: Colors.text, fontFamily: 'Sora_700Bold' },
  searchContainerSticky: { 
    paddingHorizontal: Spacing.section, 
    paddingVertical: Spacing.sm, 
    backgroundColor: Colors.background, 
    zIndex: 10 
  },
  searchResultsContainer: { minHeight: 400, backgroundColor: Colors.background },
  searchResultsContent: { paddingHorizontal: Spacing.section, paddingTop: 10 },
  noResults: { paddingVertical: 40, alignItems: 'center', justifyContent: 'center' },
  noResultsText: { ...Typography.body1, color: Colors.textSecondary, marginTop: 10 },
  resultSection: { marginBottom: 24 },
  resultSectionTitle: { ...Typography.micro, color: Colors.textTertiary, letterSpacing: 1, marginBottom: 12 },
  resultItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12, 
    gap: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: Colors.divider 
  },
  resultText: { ...Typography.h5, color: Colors.text, flex: 1 },
  resultSubtext: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  resultIconWrap: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  activeOrderBanner: { 
    marginHorizontal: Spacing.section, 
    marginVertical: Spacing.sm,
    backgroundColor: Colors.primaryLight,
    padding: 12,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(252,128,25,0.15)',
  },
  activeOrderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  activeOrderIconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  activeOrderTitle: { ...Typography.h5, color: Colors.text },
  activeOrderSub: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  spotlightWrap: { 
    marginHorizontal: Spacing.section, 
    marginVertical: Spacing.md, 
    borderRadius: Radius.xxl, 
  },
  spotlightCard: { padding: 20, minHeight: 140, borderRadius: Radius.xxl, overflow: 'hidden' },
  spotlightContent: { flex: 1 },
  spotlightLabel: { ...Typography.micro, color: '#D1FAE5', letterSpacing: 1 },
  spotlightTitle: { ...Typography.h2, color: '#FFF', marginTop: 4 },
  spotlightSubtitle: { ...Typography.body2, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  spotlightArrowWrap: { 
    position: 'absolute', 
    bottom: 20, 
    right: 20, 
    width: 32, 
    height: 32, 
    borderRadius: Radius.pill, 
    backgroundColor: Colors.textLight, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  carouselContainer: { marginBottom: Spacing.lg },
  alertsCarousel: { paddingHorizontal: Spacing.section, gap: 12 },
  alertCard: { 
    width: SW - Spacing.section * 2, 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: Radius.xl, 
    padding: 16, 
    gap: 12, 
    borderWidth: 1,
  },
  alertEmoji: { fontSize: 24 },
  alertText: { flex: 1 },
  alertTitle: { ...Typography.h5, color: Colors.text },
  alertDesc: { ...Typography.body2, color: Colors.textSecondary, marginTop: 2 },
  shortcutsSection: { paddingHorizontal: Spacing.section, marginBottom: Spacing.lg },
  shortcutsTitle: { ...Typography.h4, color: Colors.text, marginBottom: 16 },
  shortcutsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  shortcutItem: { alignItems: 'center', width: (SW - Spacing.section * 2) / 4.5 },
  shortcutIconWrap: { 
    width: 50, 
    height: 50, 
    borderRadius: Radius.lg, 
    backgroundColor: Colors.surface, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 8, 
    borderWidth: 0.5, 
    borderColor: Colors.divider,
  },
  shortcutText: { ...Typography.micro, color: Colors.textSecondary },
  recentSection: { paddingHorizontal: Spacing.section, marginBottom: Spacing.xl },
  recentList: { gap: 12 },
  recentItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    padding: 12, 
    borderRadius: Radius.lg, 
    backgroundColor: Colors.surface, 
    borderWidth: 0.5, 
    borderColor: Colors.divider,
  },
  recentIconWrap: { 
    width: 36, 
    height: 36, 
    borderRadius: Radius.md, 
    backgroundColor: Colors.background, 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  recentTitle: { ...Typography.h5, fontSize: 13, color: Colors.text },
  recentMeta: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  streakSection: { paddingHorizontal: Spacing.section, marginBottom: 40 },
  streakHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 },
  streakTitle: { ...Typography.h4, color: Colors.text },
  streakCount: { ...Typography.caption, color: Colors.primary, fontFamily: 'Sora_700Bold' },
  streakCard: { padding: 12, borderRadius: Radius.xl, backgroundColor: Colors.background, borderWidth: 0.5, borderColor: Colors.divider },
  bottomFade: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60, zIndex: 10 },
});
