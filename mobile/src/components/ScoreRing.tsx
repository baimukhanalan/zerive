// Circular score ring (SVG). Shows a 0–100 value as an orange arc with the
// number centered inside. Used on Home (large) and system cards (small).

import { useId } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Text } from './Text';
import { colors } from '@/theme';

interface ScoreRingProps {
  value: number;          // 0–100
  size?: number;
  stroke?: number;
  label?: string;
  color?: string;
  trackColor?: string;
}

export function ScoreRing({
  value, size = 168, stroke = 12, label, color = colors.accent, trackColor = colors.surfaceHi,
}: ScoreRingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = c * (1 - clamped / 100);
  const cx = size / 2;
  const gradId = 'ring' + useId().replace(/[^a-zA-Z0-9]/g, '');

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.accent} />
            <Stop offset="1" stopColor={colors.accentDeep} />
          </LinearGradient>
        </Defs>
        <Circle cx={cx} cy={cx} r={r} stroke={trackColor} strokeWidth={stroke} fill="none" />
        <Circle
          cx={cx}
          cy={cx}
          r={r}
          stroke={`url(#${gradId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cx})`}
        />
      </Svg>
      <View style={{ position: 'absolute', alignItems: 'center' }}>
        <Text variant="display" style={{ fontSize: size * 0.34, lineHeight: size * 0.36 }}>
          {Math.round(clamped)}
        </Text>
        {label ? <Text variant="label" color="text3">{label}</Text> : null}
      </View>
    </View>
  );
}
