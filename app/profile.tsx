import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Radius, Shadows, Spacing, Typography } from '../src/theme';

const QUICK_ACCESS = [
  { id: 'grades', label: 'Grades', meta: 'View GPA & transcripts', icon: 'school' },
  { id: 'attendance', label: 'Attendance', meta: 'See lecture presence', icon: 'checkmark-done' },
  { id: 'orders', label: 'Food Orders', meta: 'Past & upcoming pickups', icon: 'fast-food' },
  { id: 'stationery', label: 'Stationery Requests', meta: 'Track print & copy jobs', icon: 'print' },
  { id: 'events', label: 'Campus Events', meta: "Browse what's running", icon: 'megaphone' },
  { id: 'support', label: 'Student Support', meta: 'Raise a ticket or chat', icon: 'chatbox-ellipses' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Hub</Text>
      </View>
      <Animated.View entering={FadeInDown.springify()} style={styles.hero}>
        <Text style={styles.heroTitle}>Hey Yugan</Text>
        <Text style={styles.heroSubtitle}>Everything you need to stay on top of campus life.</Text>
      </Animated.View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Quick Access</Text>
        <View style={styles.grid}>
          {QUICK_ACCESS.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => {
              if (card.id === 'grades') router.push('/grades');
                else if (card.id === 'attendance') router.push('/attendance');
                else if (card.id === 'orders') router.push('/food-orders');
                else if (card.id === 'stationery') router.push('/stationery-orders');
                else if (card.id === 'events') router.push('/(tabs)/explore');
                else if (card.id === 'support') router.push('/teachers');
              }}
            >
              <View style={styles.iconWrap}>
                <Ionicons name={card.icon as any} size={20} color={Colors.primary} />
              </View>
              <Text style={styles.cardTitle}>{card.label}</Text>
              <Text style={styles.cardMeta}>{card.meta}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.section,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    padding: Spacing.xs,
    marginRight: Spacing.md,
  },
  headerTitle: {
    ...Typography.h3,
  },
  hero: {
    margin: Spacing.section,
    borderRadius: Radius.xxl,
    padding: Spacing.lg,
    backgroundColor: Colors.primary,
    ...Shadows.lg,
  },
  heroTitle: {
    ...Typography.h2,
    color: '#FFF',
  },
  heroSubtitle: {
    marginTop: Spacing.xs,
    ...Typography.body2,
    color: 'rgba(255,255,255,0.9)',
  },
  scroll: {
    paddingHorizontal: Spacing.section,
    paddingBottom: Spacing.xxxl,
  },
  sectionTitle: {
    ...Typography.h4,
    marginBottom: Spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  card: {
    width: '48%',
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    ...Typography.h5,
  },
  cardMeta: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
