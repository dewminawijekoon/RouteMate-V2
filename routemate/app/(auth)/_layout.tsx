import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup_screen" />
    </Stack>
  );
}