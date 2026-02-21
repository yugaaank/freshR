import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserPrintRequests } from '../src/hooks/usePrint';
import { useUserStore } from '../src/store/userStore';
import { Colors, Radius, Spacing, Typography } from '../src/theme';
import dayjs from 'dayjs';

export default function StationeryOrders() {
  const { profile } = useUserStore();
  const { data: requests = [], isLoading, error } = useUserPrintRequests(profile?.id ?? null);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Stationery Requests</Text>
      </View>
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{item.file_name}</Text>
              <Text style={[styles.status, item.status === 'ready' ? styles.statusReady : item.status === 'collected' ? styles.statusCollected : styles.statusPending]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
            <View style={styles.cardRow}>
               <Text style={styles.cardMeta}>Pickup: {dayjs(item.scheduled_time).format('h:mm A')}</Text>
               <Text style={styles.cardMeta}>{item.pages} pgs · {item.copies} copies</Text>
            </View>
            <Text style={styles.cardMeta}>{item.pickup_code ? `Code: ${item.pickup_code}` : 'Awaiting code...'}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="print-outline" size={48} color={Colors.border} />
            <Text style={styles.empty}>No stationery requests found.</Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: 120 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.section,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  back: {
    marginRight: Spacing.md,
  },
  title: {
    ...Typography.h3,
    color: Colors.text,
  },
  list: {
    padding: Spacing.section,
    gap: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 0.5,
    borderColor: Colors.divider,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardTitle: { ...Typography.h5, color: Colors.text },
  cardMeta: { ...Typography.body2, color: Colors.textSecondary },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  status: { ...Typography.caption, paddingVertical: 2, paddingHorizontal: Spacing.sm, borderRadius: Radius.pill, fontSize: 10, fontWeight: '700' },
  statusPending: { backgroundColor: Colors.warningLight, color: Colors.warning },
  statusReady: { backgroundColor: Colors.successLight, color: Colors.success },
  statusCollected: { backgroundColor: Colors.divider, color: Colors.textSecondary },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100, opacity: 0.5 },
  empty: { marginTop: Spacing.sm, textAlign: 'center', color: Colors.textSecondary },
});
