// Navigation gate. Reads the persisted session and redirects to the right entry
// point. Renders nothing until the store has hydrated, so we never flash the
// wrong screen on cold start.

import { Redirect } from 'expo-router';
import { View } from 'react-native';
import { useSession } from '@/store/session';
import { colors } from '@/theme';

export default function Index() {
  const { hydrated, signedIn, onboarded } = useSession();

  if (!hydrated) return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  if (!signedIn) return <Redirect href="/welcome" />;
  if (!onboarded) return <Redirect href="/onboarding" />;
  return <Redirect href="/(tabs)" />;
}
