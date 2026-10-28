// The `zerive` wordmark — geometric lowercase Manrope ExtraBold with an orange
// `i`. `color` sets the base ink (ink on paper, cream on a photo).

import { Text as RNText } from 'react-native';
import { colors } from '@/theme';

export function Wordmark({ size = 24, color = colors.text }: { size?: number; color?: string }) {
  const base = { fontFamily: 'Manrope_800ExtraBold', fontSize: size, letterSpacing: -size * 0.05 };
  return (
    <RNText style={base} allowFontScaling={false}>
      <RNText style={{ color }}>zer</RNText>
      <RNText style={{ color: colors.accent }}>i</RNText>
      <RNText style={{ color }}>ve</RNText>
    </RNText>
  );
}
