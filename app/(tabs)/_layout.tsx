import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useCartStore } from '../../src/store/cartStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius } from '../../src/theme';

interface TabIconProps {
  name: React.ComponentProps<typeof Ionicons>['name'];
  focused: boolean;
  badge?: number;
}

function TabIcon({ name, focused }: TabIconProps) {
  return (
    <View style={[styles.navIconWrapper, focused && styles.navIconWrapperActive]}>
      <Ionicons
        name={name}
        size={22}
        color={focused ? Colors.text : Colors.textSecondary}
      />
    </View>
  );
}

export default function TabsLayout() {
  const cartCount = useCartStore((s) => s.totalItems());
  const insets = useSafeAreaInsets();
  const baseBottom = Platform.OS === 'ios' ? 16 : 10;

  return (
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
          tabBarItemStyle: {
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}
      >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="waves"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'play' : 'play-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'compass' : 'compass-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="food"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'fast-food' : 'fast-food-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'calendar' : 'calendar-outline'} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 72,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
  },
  navIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  navIconWrapperActive: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.primary + '20',
  },
});
