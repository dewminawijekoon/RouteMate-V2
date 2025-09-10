import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';  // Add this
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/contexts/AuthContext';

SplashScreen.preventAutoHideAsync();  // Prevent splash from hiding automatically

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [appIsReady, setAppIsReady] = useState(false);  // Track full readiness

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for fonts + auth (AuthProvider will handle token check)
        if (loaded) {
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

    if (loaded) {
      prepare();
    }
  }, [loaded]);

  if (!appIsReady || !loaded) {
    return null;  // Keep splash visible
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}