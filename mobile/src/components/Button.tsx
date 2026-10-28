// Button — primary (orange), secondary (paper), ghost (outline), bracket (mono
// "[ label ]" link). Haptic on press, pressed-state scale, optional icon/loading.

import { type ReactNode } from 'react';
import { Pressable, ActivityIndicator, View, StyleSheet, type ViewStyle } from 'react-native';
import { Text } from './Text';
import { colors, radius, spacing, fonts } from '@/theme';
import { haptic } from '@/lib/haptics';

type Variant = 'primary' | 'secondary' | 'ghost' | 'bracket';
type Size = 'lg' | 'md';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  full?: boolean;
  style?: ViewStyle;
}

export function Button({
  label, onPress, variant = 'primary', size = 'lg',
  disabled, loading, icon, full = true, style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  if (variant === 'bracket') {
    return (
      <Pressable
        onPress={() => { if (!isDisabled) { haptic.light(); onPress?.(); } }}
        disabled={isDisabled}
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.bracket,
          { opacity: isDisabled ? 0.5 : pressed ? 0.6 : 1, alignSelf: full ? 'stretch' : 'center' },
          style,
        ]}
      >
        <Text style={{ fontFamily: fonts.mono, fontSize: 12.5, letterSpacing: 0.4, color: colors.muted }}>
          {`[ ${label} ]`}
        </Text>
      </Pressable>
    );
  }

  const height = size === 'lg' ? 54 : 46;
  const bg =
    variant === 'primary' ? colors.accent :
    variant === 'secondary' ? colors.surface : 'transparent';
  const fg = variant === 'primary' ? 'onAccent' : variant === 'ghost' ? 'text' : 'text';
  const border = variant === 'secondary' ? colors.line2 : variant === 'ghost' ? colors.line2 : 'transparent';

  return (
    <Pressable
      onPress={() => { if (!isDisabled) { haptic.light(); onPress?.(); } }}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          height,
          backgroundColor: bg,
          borderColor: border,
          borderWidth: variant === 'secondary' || variant === 'ghost' ? 1 : 0,
          width: full ? '100%' : undefined,
          opacity: isDisabled ? 0.5 : 1,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.onAccent : colors.accent} />
      ) : (
        <View style={styles.row}>
          {icon}
          <Text variant="h3" color={fg as any} style={{ fontSize: 16 }}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bracket: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.md },
});
