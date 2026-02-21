import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../src/store/userStore';
import { Colors, Radius, Spacing, Typography, Palette } from '../src/theme';

const QUICK_ACCESS = [
  { id: 'grades', label: 'Grades', meta: 'GPA & transcripts', icon: 'school' },
  { id: 'attendance', label: 'Attendance', meta: 'Lecture presence', icon: 'checkmark-done' },
  { id: 'orders', label: 'Food Orders', meta: 'Previous & active', icon: 'fast-food' },
  { id: 'stationery', label: 'PDF & Print', meta: 'History & requests', icon: 'print' },
  { id: 'id-card', label: 'Digital ID', meta: 'Official campus QR', icon: 'card' },
  { id: 'library', label: 'Library', meta: 'Issued books & fines', icon: 'library' },
];

export default function ProfileScreen() {
  const { profile } = useUserStore();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Student Hub</Text>
      </View>
      <View style={styles.hero}>
        <View style={styles.heroRow}>
          <View style={styles.heroInfo}>
            <Text style={styles.heroTitle}>Hey {profile?.name?.split(' ')[0] ?? 'Yugank'}</Text>
            <Text style={styles.heroSubtitle}>{profile?.branch} · Year {profile?.year}</Text>
          </View>
          <View style={styles.heroAvatarWrap}>
            <Image source={{ uri: profile?.avatar_url ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop' }} style={styles.heroAvatar} />
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Essential Services</Text>
        <View style={styles.grid}>
          {QUICK_ACCESS.map((card, idx) => {
            return (
              <TouchableOpacity
                key={card.id}
                style={[styles.card, { backgroundColor: Colors.card }]}
                activeOpacity={0.85}
                onPress={() => {
                  if (card.id === 'grades') router.push('/grades');
                  else if (card.id === 'attendance') router.push('/attendance');
                  else if (card.id === 'orders') router.push('/food-orders');
                  else if (card.id === 'stationery') router.push('/stationery-orders');
                  else if (card.id === 'events') router.push('/(tabs)/explore');
                  else Alert.alert('Coming Soon', `${card.label} feature is arriving in the next update!`);
                }}
              >
                <View style={[styles.iconWrap, { backgroundColor: Colors.secondary }]}>
                  <Ionicons name={card.icon as any} size={20} color={Colors.primary} />
                </View>
                <Text style={[styles.cardTitle, { color: Colors.foreground }]}>{card.label}</Text>
                <Text style={[styles.cardMeta, { color: Colors.mutedForeground }]}>{card.meta}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => {
          Alert.alert('Logout', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: () => useUserStore.getState().signOut() }
          ]);
        }}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
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
    borderBottomColor: Colors.divider,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 0.5,
    borderColor: Colors.divider,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  hero: {
    margin: Spacing.section,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.secondary,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroInfo: {
    flex: 1,
  },
  heroAvatarWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    padding: 2,
    backgroundColor: Colors.background,
  },
  heroAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  heroTitle: {
    ...Typography.h2,
    color: Colors.foreground,
  },
  heroSubtitle: {
    marginTop: Spacing.xs,
    ...Typography.body2,
    color: Colors.textSecondary,
  },
  scroll: {
    paddingHorizontal: Spacing.section,
    paddingBottom: Spacing.xxxl,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  card: {
    width: '48%',
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.card,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    ...Typography.h5,
    fontFamily: 'Sora_600SemiBold',
  },
  cardMeta: {
    ...Typography.caption,
    marginTop: 4,
  },
  footer: {
    padding: Spacing.section,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: Radius.lg,
    backgroundColor: Colors.error + '10',
  },
  logoutText: {
    ...Typography.h5,
    color: Colors.error,
    fontFamily: 'Sora_700Bold',
  },
});
