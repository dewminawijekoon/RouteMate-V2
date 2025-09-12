import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/contexts/AuthContext';
import { initI18n } from '@/src/i18n';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [i18nReady, setI18nReady] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  // Initialize i18n
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await initI18n();
      } finally {
        if (mounted) setI18nReady(true);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for fonts + auth + i18n
        if (fontsLoaded && i18nReady) {
          // Additional pre-load if needed (e.g., API prefetch for buses)
          await new Promise(resolve => setTimeout(resolve, 1000));  // Min load time for smooth feel
        }
      } catch (e) {
        console.warn('Prepare error:', e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();  // Hide splash once ready
      }
    }

    if (fontsLoaded && i18nReady) {
      prepare();
    }
  }, [fontsLoaded, i18nReady]);

  if (!appIsReady || !fontsLoaded || !i18nReady) {
    return null;  // Keep splash visible
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}