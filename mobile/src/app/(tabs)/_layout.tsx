// Tab navigator with a custom premium tab bar (SVG icons + i18n labels).

import { useEffect } from 'react';
import { View, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/Text';
import { TabIcon, type TabName } from '@/components/icons';
import { colors, spacing } from '@/theme';
import { useT } from '@/i18n';
import { useSession } from '@/store/session';
import { useDataStore } from '@/store/data';
import { haptic } from '@/lib/haptics';

const TABS: { name: string; icon: TabName }[] = [
  { name: 'index', icon: 'home' },
  { name: 'data', icon: 'data' },
  { name: 'plan', icon: 'plan' },
  { name: 'ai', icon: 'ai' },
  { name: 'profile', icon: 'profile' },
];

export default function TabsLayout() {
  const token = useSession((s) => s.token);
  const loaded = useDataStore((s) => s.loaded);
  const loadAll = useDataStore((s) => s.loadAll);

  useEffect(() => { if (!loaded) loadAll(token); }, [loaded, token, loadAll]);

  if (!loaded) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="data" />
      <Tabs.Screen name="plan" />
      <Tabs.Screen name="ai" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

// Minimal structural type for the bits of the tab-bar props we use — avoids a
// direct dependency on @react-navigation types (not a top-level package).
interface TabBarProps {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    emit: (e: { type: 'tabPress'; target: string; canPreventDefault: true }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
}

function CustomTabBar({ state, navigation }: TabBarProps) {
  const t = useT();
  const insets = useSafeAreaInsets();
  const labels: Record<TabName, string> = {
    home: t.tabs.home, data: t.tabs.data, plan: t.tabs.plan, ai: t.tabs.ai, profile: t.tabs.profile,
  };

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom || spacing.sm }]}>
      {state.routes.map((route, index) => {
        const cfg = TABS.find((x) => x.name === route.name);
        if (!cfg) return null;
        const focused = state.index === index;

        const onPress = () => {
          haptic.select();
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.item}
            accessibilityRole="button"
            accessibilityState={{ selected: focused }}
          >
            <TabIcon name={cfg.icon} focused={focused} size={24} />
            <Text variant="label" color={focused ? 'accent' : 'faint2'} style={{ fontSize: 10.5 }}>
              {labels[cfg.icon]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.bg2,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: spacing.sm,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 2 },
});
