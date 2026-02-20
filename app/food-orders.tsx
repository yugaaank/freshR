import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Radius, Shadows, Spacing, Typography } from '../src/theme';

const FOOD_ORDERS = [
  { id: 'o1', title: 'Pasta Alfredo + Garlic Bread', status: 'Collected', price: 329, time: 'Today · 12:15 PM' },
  { id: 'o2', title: 'Veg Thali', status: 'Delivered', price: 189, time: 'Yesterday · 07:20 PM' },
  { id: 'o3', title: 'Coffee & Sandwich', status: 'Collected', price: 149, time: '2025-02-17 · 08:30 AM' },
];

export default function FoodOrdersScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Food Orders</Text>
      </View>
      <FlatList
        data={FOOD_ORDERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Animated.View entering={FadeInDown.springify()} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={[styles.status, item.status === 'Collected' ? styles.statusSuccess : styles.statusNeutral]}>
                {item.status}
              </Text>
            </View>
            <Text style={styles.cardMeta}>{item.time}</Text>
            <Text style={styles.cardPrice}>₹{item.price}</Text>
          </Animated.View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No past food orders yet.</Text>}
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
  },
  list: {
    padding: Spacing.section,
  },
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between' },
  cardTitle: { ...Typography.h5 },
  status: { ...Typography.caption },
  statusSuccess: { color: Colors.success },
  statusNeutral: { color: Colors.textSecondary },
  cardMeta: { ...Typography.body2, color: Colors.textSecondary, marginTop: Spacing.xs },
  cardPrice: { ...Typography.h5, marginTop: Spacing.sm },
  empty: { padding: Spacing.section, textAlign: 'center', color: Colors.textSecondary },
});
