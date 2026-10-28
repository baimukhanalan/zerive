// Lightweight top bar: back / close button, optional centered title, optional
// right slot. Sits inside a Screen (which already applies the top inset).

import { type ReactNode } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from './Text';
import { ChevronLeft, Close } from './icons';
import { colors, spacing, radius } from '@/theme';
import { haptic } from '@/lib/haptics';

interface TopBarProps {
  title?: string;
  right?: ReactNode;
  variant?: 'back' | 'close';
  onBack?: () => void;
}

export function TopBar({ title, right, variant = 'back', onBack }: TopBarProps) {
  const router = useRouter();
  const handle = () => {
    haptic.light();
    if (onBack) return onBack();
    if (router.canGoBack()) router.back();
  };

  return (
    <View style={styles.bar}>
      <Pressable onPress={handle} style={styles.btn} hitSlop={8} accessibilityRole="button">
        {variant === 'close' ? <Close size={20} color={colors.text} /> : <ChevronLeft size={22} color={colors.text} />}
      </Pressable>
      {title ? <Text variant="h3" numberOfLines={1} style={styles.title}>{title}</Text> : <View style={styles.title} />}
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', height: 44, marginBottom: spacing.md },
  btn: {
    width: 40, height: 40, borderRadius: radius.pill,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { flex: 1, textAlign: 'center', marginHorizontal: spacing.sm },
  right: { width: 40, alignItems: 'flex-end' },
});
