import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { initI18n } from '@/src/i18n';

// If your project uses Expo Router (main: "expo-router/entry"), this App.tsx
// is not used by default. It is provided to satisfy the requirement and can
// be enabled by setting package.json main to "./App". It awaits i18n init
// before rendering the navigation tree.

function RootNavigator() {
  // In an Expo Router project, you would typically render <Slot /> here
  // after switching the "main" entry to "./App" and importing from 'expo-router'.
  return <View style={{ flex: 1 }} />;
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await initI18n();
      } finally {
        if (mounted) setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <>
      <RootNavigator />
      <StatusBar style="auto" />
    </>
  );
}

