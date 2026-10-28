// Screen container — paper background, safe-area aware, optional scroll. Centers
// content to a phone width on wide viewports (tablet / web).

import { type ReactNode } from 'react';
import { View, ScrollView, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, layout } from '@/theme';

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;              // apply default horizontal padding
  topInset?: boolean;            // pad for the status bar
  bottomInset?: boolean;         // pad for the home indicator / tab bar
  contentStyle?: StyleProp<ViewStyle>;
  bg?: keyof typeof colors;
}

export function Screen({
  children,
  scroll = false,
  padded = true,
  topInset = true,
  bottomInset = true,
  contentStyle,
  bg = 'bg',
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const pad: ViewStyle = {
    paddingTop: topInset ? insets.top + spacing.sm : 0,
    paddingBottom: bottomInset ? insets.bottom + spacing.xl : 0,
    paddingHorizontal: padded ? layout.screenX : 0,
  };

  const inner = (
    <View style={[styles.center, padded && { maxWidth: layout.maxContentWidth, width: '100%' }]}>
      {children}
    </View>
  );

  if (scroll) {
    return (
      <ScrollView
        style={[styles.flex, { backgroundColor: colors[bg] }]}
        contentContainerStyle={[styles.grow, pad, contentStyle]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {inner}
      </ScrollView>
    );
  }
  return (
    <View style={[styles.flex, { backgroundColor: colors[bg] }, pad, contentStyle]}>
      {inner}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  grow: { flexGrow: 1, alignItems: 'center' },
  center: { alignSelf: 'center' },
});
