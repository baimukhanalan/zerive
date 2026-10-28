// Icon set (react-native-svg). Stroke icons take `size` + `color`. Tab icons
// take a `focused` flag (filled dot accent when active).

import Svg, { Path, Circle, Rect, G, Line } from 'react-native-svg';
import { colors } from '@/theme';

export interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

const S = (p: IconProps) => ({
  width: p.size ?? 24,
  height: p.size ?? 24,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
});
const stroke = (p: IconProps) => ({
  stroke: p.color ?? colors.text,
  strokeWidth: p.strokeWidth ?? 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

/* ── UI icons ──────────────────────────────────────────────────────────────── */

export const ChevronRight = (p: IconProps) => (
  <Svg {...S(p)}><Path d="M9 6l6 6-6 6" {...stroke(p)} /></Svg>
);
export const ChevronLeft = (p: IconProps) => (
  <Svg {...S(p)}><Path d="M15 6l-6 6 6 6" {...stroke(p)} /></Svg>
);
export const ArrowRight = (p: IconProps) => (
  <Svg {...S(p)}><Path d="M5 12h14M13 6l6 6-6 6" {...stroke(p)} /></Svg>
);
export const ArrowLeft = (p: IconProps) => (
  <Svg {...S(p)}><Path d="M19 12H5M11 6l-6 6 6 6" {...stroke(p)} /></Svg>
);
export const Plus = (p: IconProps) => (
  <Svg {...S(p)}><Path d="M12 5v14M5 12h14" {...stroke(p)} /></Svg>
);
export const Check = (p: IconProps) => (
  <Svg {...S(p)}><Path d="M5 13l4 4L19 7" {...stroke(p)} /></Svg>
);
export const Close = (p: IconProps) => (
  <Svg {...S(p)}><Path d="M6 6l12 12M18 6L6 18" {...stroke(p)} /></Svg>
);
export const Search = (p: IconProps) => (
  <Svg {...S(p)}><Circle cx={11} cy={11} r={7} {...stroke(p)} /><Path d="M21 21l-4-4" {...stroke(p)} /></Svg>
);
export const Upload = (p: IconProps) => (
  <Svg {...S(p)}><Path d="M12 16V4M7 9l5-5 5 5M4 20h16" {...stroke(p)} /></Svg>
);
export const Camera = (p: IconProps) => (
  <Svg {...S(p)}><Path d="M3 8a2 2 0 012-2h1.5l1.2-2h6.6l1.2 2H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" {...stroke(p)} /><Circle cx={12} cy={13} r={3.4} {...stroke(p)} /></Svg>
);
export const Doc = (p: IconProps) => (
  <Svg {...S(p)}><Path d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" {...stroke(p)} /><Path d="M14 3v5h5" {...stroke(p)} /></Svg>
);
export const Globe = (p: IconProps) => (
  <Svg {...S(p)}><Circle cx={12} cy={12} r={9} {...stroke(p)} /><Path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" {...stroke(p)} /></Svg>
);
export const Bell = (p: IconProps) => (
  <Svg {...S(p)}><Path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0" {...stroke(p)} /></Svg>
);
export const Lock = (p: IconProps) => (
  <Svg {...S(p)}><Rect x={5} y={11} width={14} height={9} rx={2} {...stroke(p)} /><Path d="M8 11V8a4 4 0 018 0v3" {...stroke(p)} /></Svg>
);
export const Logout = (p: IconProps) => (
  <Svg {...S(p)}><Path d="M15 12H4M11 8l-4 4 4 4M9 4h9a1 1 0 011 1v14a1 1 0 01-1 1H9" {...stroke(p)} /></Svg>
);
export const Vault = (p: IconProps) => (
  <Svg {...S(p)}><Rect x={3} y={4} width={18} height={16} rx={2} {...stroke(p)} /><Circle cx={13} cy={12} r={3.2} {...stroke(p)} /><Path d="M13 4v3M13 17v3" {...stroke(p)} /></Svg>
);
export const QR = (p: IconProps) => (
  <Svg {...S(p)}>
    <Rect x={4} y={4} width={6} height={6} rx={1} {...stroke(p)} />
    <Rect x={14} y={4} width={6} height={6} rx={1} {...stroke(p)} />
    <Rect x={4} y={14} width={6} height={6} rx={1} {...stroke(p)} />
    <Path d="M14 14h3v3M20 14v6M17 20h3" {...stroke(p)} />
  </Svg>
);
export const Card = (p: IconProps) => (
  <Svg {...S(p)}><Rect x={3} y={5} width={18} height={14} rx={2} {...stroke(p)} /><Path d="M3 10h18" {...stroke(p)} /></Svg>
);
export const Beaker = (p: IconProps) => (
  <Svg {...S(p)}><Path d="M9 3v6l-4.5 8A2 2 0 006.3 20h11.4a2 2 0 001.8-3L15 9V3M8 3h8M6.5 15h11" {...stroke(p)} /></Svg>
);

/* ── brand marks ───────────────────────────────────────────────────────────── */

export const AppleMark = ({ size = 18, color = colors.text }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <Path d="M16.4 12.9c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.9-3-.85C8.5 7.75 7 8.6 6.2 10c-1.7 2.9-.4 7.2 1.2 9.6.8 1.2 1.7 2.5 2.9 2.45 1.2-.05 1.6-.75 3-.75s1.8.75 3 .72c1.25-.02 2.03-1.2 2.8-2.4.87-1.38 1.23-2.72 1.25-2.79-.03-.01-2.4-.92-2.42-3.63M14.2 6.3c.65-.8 1.1-1.9.97-3-.94.04-2.07.63-2.74 1.42-.6.7-1.13 1.82-.99 2.9 1.05.08 2.11-.53 2.76-1.32" />
  </Svg>
);

export const GoogleMark = ({ size = 18 }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21.35 12.2c0-.63-.06-1.25-.16-1.84H12v3.49h5.25a4.5 4.5 0 01-1.95 2.95v2.45h3.15c1.84-1.7 2.9-4.2 2.9-7.05z" fill="#4285F4" />
    <Path d="M12 21.5c2.63 0 4.84-.87 6.45-2.35l-3.15-2.45c-.87.6-2 .95-3.3.95-2.54 0-4.7-1.72-5.47-4.02H3.28v2.53A9.5 9.5 0 0012 21.5z" fill="#34A853" />
    <Path d="M6.53 13.63a5.7 5.7 0 010-3.63V7.47H3.28a9.5 9.5 0 000 8.53l3.25-2.37z" fill="#FBBC05" />
    <Path d="M12 6.35c1.43 0 2.72.49 3.73 1.46l2.8-2.8A9.14 9.14 0 0012 2.5a9.5 9.5 0 00-8.72 5.5l3.25 2.53C7.3 8.07 9.46 6.35 12 6.35z" fill="#EA4335" />
  </Svg>
);

/* ── tab-bar icons ─────────────────────────────────────────────────────────── */

export type TabName = 'home' | 'data' | 'plan' | 'ai' | 'profile';

export function TabIcon({ name, focused, size = 24 }: { name: TabName; focused: boolean; size?: number }) {
  const color = focused ? colors.accent : colors.faint2;
  const sp = { stroke: color, strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const svg = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' as const };

  switch (name) {
    case 'home': // gauge / speedometer
      return (
        <Svg {...svg}>
          <Path d="M4.5 17a7.5 7.5 0 1 1 15 0" {...sp} />
          <Path d="M12 17l3.6-4.2" {...sp} />
          <Circle cx={12} cy={17} r={1.4} fill={color} />
        </Svg>
      );
    case 'data': // pulse / ECG
      return <Svg {...svg}><Path d="M3 12h3.5l2-6 3.5 12 2.5-8 1.5 2H21" {...sp} /></Svg>;
    case 'plan': // checklist card
      return <Svg {...svg}><Rect x={4} y={4} width={16} height={16} rx={4} {...sp} /><Path d="M8.5 12l2.4 2.4 4.6-5" {...sp} /></Svg>;
    case 'ai':
      return (
        <Svg {...svg}>
          <Path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" {...sp} />
          <Path d="M18.5 15l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9z" {...sp} />
        </Svg>
      );
    case 'profile':
      return <Svg {...svg}><Circle cx={12} cy={8} r={4} {...sp} /><Path d="M4 21a8 8 0 0116 0" {...sp} /></Svg>;
  }
}
