import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useCartStore } from '../../src/store/cartStore';
import { Colors, Shadows, Spacing, Typography } from '../../src/theme';

interface TabIconProps {
  name: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  focused: boolean;
  badge?: number;
}

function TabIcon({ name, label, focused, badge }: TabIconProps) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapFocused]}>
      <View style={styles.iconRow}>
        <Ionicons name={name} size={22} color={focused ? Colors.primary : Colors.textSecondary} />
        {badge ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 99 ? '99+' : badge}</Text>
          </View>
        ) : null}
      </View>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
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
            <TabIcon name={focused ? 'calendar' : 'calendar-outline'} label="Calendar" focused={focused} />
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
    borderTopColor: Colors.border,
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingTop: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? Spacing.xl : Spacing.sm,
    ...Shadows.floating,
  },
  iconWrap: { alignItems: 'center', gap: 3, paddingHorizontal: Spacing.xs },
  iconWrapFocused: {},
  iconRow: { position: 'relative' },
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
  },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: '700' },
  tabLabel: { ...Typography.label, fontSize: 10, color: Colors.textSecondary },
  tabLabelFocused: { color: Colors.primary, fontWeight: '700' },
});
