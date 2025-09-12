import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect root to the tabs home route so web deep links work.
  return <Redirect href="/(tabs)/home" />;
}

