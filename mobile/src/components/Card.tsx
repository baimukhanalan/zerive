// Card + Eyebrow + StatusPill + StatusDot + Divider — small shared building
// blocks used across every screen.

import { type ReactNode } from 'react';
import { View, Pressable, StyleSheet, type ViewStyle, type StyleProp } from 'react-native';
import { Text } from './Text';
import { colors, radius, spacing, type, shadow } from '@/theme';
import { statusColors } from '@/theme';
import { haptic } from '@/lib/haptics';
import type { Status } from '@/data/types';

export function Card({
  children, style, onPress, padded = true,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  padded?: boolean;
}) {
  const inner = <View style={[styles.card, padded && styles.cardPad, style]}>{children}</View>;
  if (onPress) {
    return (
      <Pressable
        onPress={() => { haptic.light(); onPress(); }}
        style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
      >
        {inner}
      </Pressable>
    );
  }
  return inner;
}

/** Mono, tracked, uppercase label — the "nutrition-label" eyebrow. */
export function Eyebrow({ children, color = 'text3' }: { children: string; color?: keyof typeof colors }) {
  return (
    <Text style={[type.eyebrow, { textTransform: 'uppercase' }]} color={color as any}>
      {children}
    </Text>
  );
}

const STATUS_KEY: Record<Status, 'optimal' | 'normal' | 'attention' | 'high'> = {
  optimal: 'optimal', normal: 'normal', attention: 'attention', high: 'high',
};

export function StatusDot({ status, size = 8 }: { status: Status; size?: number }) {
  const { fg } = statusColors(STATUS_KEY[status]);
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: fg }} />;
}

export function StatusPill({ status, label }: { status: Status; label: string }) {
  const { fg, bg } = statusColors(STATUS_KEY[status]);
  return (
    <View style={[styles.pill, { backgroundColor: bg }]}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: fg }} />
      <Text variant="label" style={{ color: fg }}>{label}</Text>
    </View>
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.divider, style]} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.x2,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow.sm,
  },
  cardPad: { padding: spacing.xl },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  divider: { height: 1, backgroundColor: colors.line },
});
