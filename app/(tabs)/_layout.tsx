import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { useCartStore } from '../../src/store/cartStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../src/theme';

interface TabIconProps {
  name: React.ComponentProps<typeof Ionicons>['name'];
  focused: boolean;
  badge?: number;
}

function TabIcon({ name, focused }: TabIconProps) {
  return (
    <Animated.View style={[styles.navIconWrapper, focused && styles.navIconWrapperActive]}>
      <Ionicons
        name={name}
        size={22}
        color={focused ? '#0A0B10' : '#B7BDC6'}
      />
    </Animated.View>
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
          tabBarStyle: [styles.tabBar, { paddingBottom: insets.bottom || 8 }],
          tabBarShowLabel: false,
          tabBarItemStyle: {
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
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
    height: 90,
    borderTopWidth: 0,
    backgroundColor: '#111216',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingTop: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#020202',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 16,
  },
  navIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  navIconWrapperActive: {
    backgroundColor: '#F7F7F7',
  },
});
