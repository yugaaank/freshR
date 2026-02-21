import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUserOrders } from '../src/hooks/useOrders';
import { useUserStore } from '../src/store/userStore';
import { Colors, Radius, Spacing, Typography } from '../src/theme';
import dayjs from 'dayjs';

export default function FoodOrdersScreen() {
  const { profile } = useUserStore();
  const { data: orders = [], isLoading, error } = useUserOrders(profile?.id ?? null);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load orders.</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={{color: '#FFF'}}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Food Orders</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>Order #{item.id.slice(0, 8)}</Text>
              <Text style={[styles.status, item.status === 'delivered' || item.status === 'ready' ? styles.statusSuccess : styles.statusNeutral]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.cardMeta}>{dayjs(item.created_at).format('MMM D, YYYY · h:mm A')}</Text>
            <Text style={styles.cardPrice}>₹{item.total_price}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="fast-food-outline" size={48} color={Colors.border} />
            <Text style={styles.empty}>No past food orders yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.section,
    borderBottomWidth: 1,
    borderColor: Colors.divider,
  },
  back: {
    marginRight: Spacing.md,
  },
  title: {
    ...Typography.h3,
  },
  list: {
    padding: Spacing.section,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 0.5,
    borderColor: Colors.divider,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  cardTitle: { ...Typography.h5, color: Colors.text },
  status: { ...Typography.caption, fontWeight: '700' },
  statusSuccess: { color: Colors.success },
  statusNeutral: { color: Colors.textSecondary },
  cardMeta: { ...Typography.body2, color: Colors.textSecondary, marginTop: Spacing.xs },
  cardPrice: { ...Typography.h5, marginTop: Spacing.sm, color: Colors.text },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100, opacity: 0.5 },
  empty: { marginTop: Spacing.sm, textAlign: 'center', color: Colors.textSecondary },
  errorText: { ...Typography.body1, color: Colors.error, marginBottom: 20 },
  backBtn: { backgroundColor: Colors.primary, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
});
