// Lightweight toast. `useToast.getState().show(msg)` (or the hook) surfaces a
// brief message — used so demo-only affordances give honest feedback instead of
// silently doing nothing. Rendered once at the app root.

import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { create } from 'zustand';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './Text';
import { colors, radius, spacing } from '@/theme';

interface ToastState {
  msg: string | null;
  show: (m: string) => void;
}

export const useToast = create<ToastState>((set) => ({
  msg: null,
  show: (m) => set({ msg: m }),
}));

export function Toast() {
  const msg = useToast((s) => s.msg);
  const insets = useSafeAreaInsets();
  const opacity = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!msg) return;
    Animated.timing(opacity, { toValue: 1, duration: 160, useNativeDriver: false }).start();
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: false })
        .start(() => useToast.setState({ msg: null }));
    }, 1900);
    return () => clearTimeout(timer.current);
  }, [msg, opacity]);

  if (!msg) return null;
  return (
    <Animated.View pointerEvents="none" style={[styles.container, { bottom: insets.bottom + 96, opacity }]}>
      <Animated.View style={styles.bubble}>
        <Text variant="sm" style={{ color: colors.cream }}>{msg}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0, right: 0,
    alignItems: 'center',
  },
  bubble: {
    maxWidth: 320,
    backgroundColor: colors.text,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 8,
  },
});
