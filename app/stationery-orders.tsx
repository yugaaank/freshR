import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows, Spacing, Typography } from '../src/theme';

const PRINT_ORDERS = [
  { id: 'p1', title: 'LabReport.pdf', status: 'Pending', slot: '09:40 AM', eta: 'Collect near stationery' },
  { id: 'p2', title: 'Poster.pdf', status: 'Ready', slot: '12:20 PM', eta: 'Awaiting pickup' },
  { id: 'p3', title: 'Resume.pdf', status: 'Collected', slot: 'Yesterday · 04:10 PM', eta: 'Thank you!' },
];

export default function StationeryOrders() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Stationery Requests</Text>
      </View>
      <FlatList
        data={PRINT_ORDERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Animated.View entering={FadeInDown.delay(60)} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={[styles.status, item.status === 'Ready' ? styles.statusReady : item.status === 'Collected' ? styles.statusCollected : styles.statusPending]}> {item.status}</Text>
            </View>
            <Text style={styles.cardMeta}>Slot: {item.slot}</Text>
            <Text style={styles.cardMeta}>{item.eta}</Text>
          </Animated.View>
        )}
        ListFooterComponent={<View style={{ height: 120 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
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
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    ...Shadows.sm,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardTitle: { ...Typography.h5, color: Colors.text },
  cardMeta: { ...Typography.body2, color: Colors.textSecondary },
  status: { ...Typography.caption, paddingVertical: 2, paddingHorizontal: Spacing.sm, borderRadius: Radius.pill, fontSize: 11 },
  statusPending: { backgroundColor: Colors.warningLight, color: Colors.warning },
  statusReady: { backgroundColor: Colors.successLight, color: Colors.success },
  statusCollected: { backgroundColor: Colors.surface, color: Colors.textSecondary },
});
