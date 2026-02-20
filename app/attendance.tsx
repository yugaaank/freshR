import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Colors, Radius, Shadows, Spacing, Typography } from '../src/theme';

const ATTENDANCE_DATA = [
  { id: 'a1', course: 'Advanced React Native', attendance: 92, status: 'Good' },
  { id: 'a2', course: 'AI Lab', attendance: 88, status: 'Good' },
  { id: 'a3', course: 'Data Structures', attendance: 84, status: 'Fair' },
  { id: 'a4', course: 'Web Systems', attendance: 73, status: 'Needs attention' },
];

export default function AttendanceScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Attendance</Text>
      </View>
      <FlatList
        data={ATTENDANCE_DATA}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Animated.View entering={FadeInDown.delay(50)} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.cardTitle}>{item.course}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.status}</Text>
              </View>
            </View>
            <Text style={styles.cardMeta}>{item.attendance}% attendance</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${item.attendance}%` }]} />
            </View>
          </Animated.View>
        )}
        ListFooterComponent={() => <View style={{ height: 100 }} />}
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
  cardTitle: {
    ...Typography.h5,
    color: Colors.text,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    backgroundColor: Colors.accentLight,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.accent,
  },
  cardMeta: {
    ...Typography.body2,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: 6,
    borderRadius: Radius.md,
    backgroundColor: Colors.sectionBg,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
});
