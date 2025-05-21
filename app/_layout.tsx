import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

// Keep fonts consistent across the app
const WINE_COLOR = '#722F37';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Stack screenOptions={{ 
        headerStyle: { backgroundColor: '#FFFFFF' },
        headerTitleStyle: { color: WINE_COLOR, fontWeight: '600' },
        headerTintColor: WINE_COLOR,
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="wine/[id]" options={{ title: 'Wine Details' }} />
        <Stack.Screen name="camera" options={{ title: 'Take Photo', headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}