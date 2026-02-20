import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useCartStore } from '../../src/store/cartStore';
import { Colors, Spacing, Typography } from '../../src/theme';

interface TabIconProps {
  name: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  focused: boolean;
  badge?: number;
}

function TabIcon({ name, label, focused, badge }: TabIconProps) {
  const bgOpacity = useSharedValue(focused ? 1 : 0);
  const scale = useSharedValue(focused ? 1 : 0.8);

  useEffect(() => {
    bgOpacity.value = withSpring(focused ? 1 : 0, { damping: 15, stiffness: 300 });
    scale.value = withSpring(focused ? 1 : 0.8, { damping: 15, stiffness: 300 });
  }, [focused, bgOpacity, scale]);

  const bgStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.iconWrap}>
      <Animated.View style={[styles.activeBg, bgStyle]} />
      <View style={styles.iconContainer}>
        <Ionicons name={name} size={22} color={focused ? Colors.primary : Colors.textTertiary} />
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]} numberOfLines={1}>{label}</Text>
    </View>
  );
}

export default function TabsLayout() {
  const cartCount = useCartStore((s) => s.totalItems());

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="events"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'ticket' : 'ticket-outline'} label="Events" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="food"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? 'bag' : 'bag-outline'}
              label="Food"
              focused={focused}
              badge={cartCount > 0 ? cartCount : undefined}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="academics"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'school' : 'school-outline'} label="Grades" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'calendar' : 'calendar-outline'} label="Cal" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.cardBg,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingTop: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.sm,
    elevation: 8,
    // Remove default shadow, use elevation only
    shadowOpacity: 0,
  },
  iconWrap: { alignItems: 'center', gap: 2, width: 58, position: 'relative' },
  iconContainer: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.error,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: Colors.cardBg,
  },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: '700' },
  tabLabel: { ...Typography.micro, color: Colors.textTertiary, marginTop: 2, zIndex: 1 },
  tabLabelFocused: { color: Colors.primary, fontWeight: '700' },
  activeBg: {
    position: 'absolute',
    backgroundColor: Colors.primaryLight,
    borderRadius: 16,
    top: -6,
    bottom: -6,
    left: -12,
    right: -12,
    zIndex: 0,
  },
});
