// Sparkline (SVG) — a mini trend line for a biomarker's history. Optionally
// renders an area fill and the last-point dot. Colour reflects marker status.

import { useId } from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { colors } from '@/theme';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
  dot?: boolean;
  strokeWidth?: number;
}

export function Sparkline({
  data, width = 72, height = 32, color = colors.accent, fill = false, dot = true, strokeWidth = 2,
}: SparklineProps) {
  const gid = 'sk' + useId().replace(/[^a-zA-Z0-9]/g, '');
  if (data.length < 2) return <View style={{ width, height }} />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pad = strokeWidth + 1;
  const w = width - pad * 2;
  const h = height - pad * 2;

  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * w;
    const y = pad + (1 - (v - min) / span) * h;
    return { x, y };
  });

  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1].x.toFixed(1)},${height} L${pts[0].x.toFixed(1)},${height} Z`;
  const last = pts[pts.length - 1];

  return (
    <Svg width={width} height={height}>
      {fill && (
        <Defs>
          <LinearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity={0.24} />
            <Stop offset="1" stopColor={color} stopOpacity={0} />
          </LinearGradient>
        </Defs>
      )}
      {fill && <Path d={area} fill={`url(#${gid})`} />}
      <Path d={line} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {dot && <Circle cx={last.x} cy={last.y} r={strokeWidth + 1} fill={color} />}
    </Svg>
  );
}
