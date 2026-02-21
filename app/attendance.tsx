import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubjects } from '../src/hooks/useAcademics';
import { useUserStore } from '../src/store/userStore';
import { Colors, Radius, Spacing, Typography } from '../src/theme';

export default function AttendanceScreen() {
  const { profile } = useUserStore();
  const { data: subjects = [], isLoading } = useSubjects(profile?.id ?? null);

  const renderItem = ({ item }: { item: any }) => {
    const status = item.attendance >= 85 ? 'Excellent' : item.attendance >= 75 ? 'Good' : 'At Risk';
    const statusColor = item.attendance >= 85 ? '#39d353' : item.attendance >= 75 ? '#26a641' : '#006d21';
    const statusBg = statusColor + '20';
    const isHighAttendance = item.attendance >= 85;

    return (
      <View 
        style={[
          styles.card, 
          { backgroundColor: Colors.card, borderColor: Colors.border, borderWidth: 0.5 },
          isHighAttendance && { borderColor: '#26a641' }
        ]}
      >
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <View style={[styles.badge, { backgroundColor: statusBg }]}>
            <Text style={[styles.badgeText, { color: statusColor }]}>{status}</Text>
          </View>
        </View>
        <View style={styles.metaRow}>
          <Text style={[styles.cardMeta, { color: Colors.foreground }]}>{item.attendance}% attendance</Text>
          <Text style={styles.nextClass}>Next: {item.next_class || 'TBD'}</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${item.attendance}%`, backgroundColor: statusColor }]} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Attendance</Text>
      </View>
      
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={subjects}
          keyExtractor={(item) => item.subject_id}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.empty}>No attendance records found.</Text>
          }
          ListFooterComponent={() => <View style={{ height: 100 }} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.section,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderColor: Colors.divider,
  },
  back: {
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
  title: {
    ...Typography.h3,
    color: Colors.text,
  },
  list: {
    padding: Spacing.section,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 0.5,
    borderColor: Colors.divider,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
    gap: 10,
  },
  cardTitle: {
    ...Typography.h5,
    color: Colors.text,
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  badgeText: {
    ...Typography.micro,
    fontFamily: 'Sora_700Bold',
    textTransform: 'uppercase',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardMeta: {
    ...Typography.caption,
    fontFamily: 'Sora_600SemiBold',
  },
  nextClass: {
    ...Typography.micro,
    color: Colors.textTertiary,
  },
  progressBar: {
    height: 8,
    borderRadius: Radius.pill,
    backgroundColor: Colors.divider,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: Radius.pill,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    ...Typography.body1,
    color: Colors.textSecondary,
  },
});
