import { Sora_400Regular, Sora_600SemiBold, Sora_700Bold, Sora_800ExtraBold, useFonts } from '@expo-google-fonts/sora';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, router, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import SupabaseDataBridge from '../src/components/SupabaseDataBridge';
import { useUserStore } from '../src/store/userStore';
import { Colors } from '../src/theme';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isLoggedIn, isLoading } = useUserStore();
  const segments = useSegments();

  useEffect(() => {
    console.log('[Auth Debug] isLoggedIn:', isLoggedIn, 'isLoading:', isLoading, 'segments:', segments);
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

    if (!isLoggedIn && !inAuthGroup) {
      console.log('[Auth Debug] Redirecting to /login');
      router.replace('/login');
    } else if (isLoggedIn && inAuthGroup) {
      console.log('[Auth Debug] Redirecting to /(tabs)');
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ animation: 'fade' }} />
      <Stack.Screen name="register" options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="event/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="order-tracking" options={{ headerShown: false }} />
      <Stack.Screen name="coding-challenge" options={{ headerShown: false }} />
      <Stack.Screen name="teachers" options={{ headerShown: false }} />
      <Stack.Screen name="campus-map" options={{ headerShown: false }} />
      <Stack.Screen name="print" options={{ headerShown: false }} />
      <Stack.Screen name="print/payment" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Sora_400Regular,
    Sora_600SemiBold,
    Sora_700Bold,
    Sora_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SupabaseDataBridge />
      <ThemeProvider value={DefaultTheme}>
        <RootLayoutNav />
        <StatusBar style="light" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
