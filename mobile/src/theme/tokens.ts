// ZERIVE design tokens — warm-paper editorial system (Superpower aesthetic).
//
// Single source of truth for colour, type, spacing, elevation. Screens NEVER
// hard-code hex — they read from here — so the whole app is themed from this
// file. Values mirror the approved app design (warm paper + orange, Manrope +
// IBM Plex Mono).

export const palette = {
  // ── surfaces (warm paper) ──────────────────────────────────────────────────
  bg:        '#EFECE6', // app background
  bg2:       '#F3F1ED', // alt background band
  surface:   '#FBFAF8', // cards
  surfaceHi: '#F0EDE5', // inner tint / pressed rows / tracks
  surfaceAlt:'#EDE9E1', // muted chip / doc icon bg

  // photo overlay ink (for text-on-image scrims)
  ink0:      '#100B06',

  // ── hairlines & strokes (non-text only) ────────────────────────────────────
  line:     '#E4E0D8', // default hairline
  lineSoft: '#F0EDE5', // faint row divider
  line2:    '#D8D3C8', // stronger stroke
  line3:    '#C9C4B9', // checkbox / input border

  // ── text ramp (on paper) ───────────────────────────────────────────────────
  // All five are real text colours and clear WCAG AA (≥4.5:1) on `bg`/`surface`
  // — never reach for a lighter grey to imply hierarchy (use size/weight).
  text:   '#17161A', // primary ink
  text2:  '#33312E', // secondary
  text3:  '#6C675F', // supporting / captions — alias of `muted`
  muted:  '#6C675F', // supporting / captions
  faint:  '#6E6960', // least-emphasis / placeholders
  faint2: '#6E6960', // inactive tab / meta

  // text on photos / dark surfaces
  cream:  '#F6F1E9',

  // ── brand accent — orange (blood-vial) ─────────────────────────────────────
  accent:      '#E1521B',
  accentPress: '#CF4816',
  accentDeep:  '#B4451A',
  accentSoft:  '#F6E6DC',
  onAccent:    '#FFFFFF', // text/icon on an accent fill

  // ── health semantics (4 tiers: optimal / normal / attention / priority) ─────
  optimal:      '#2E7D53',
  optimalSoft:  'rgba(46,125,83,0.13)',
  normal:       '#5B7A4E',
  normalSoft:   'rgba(91,122,78,0.12)',
  normalDot:    '#8FA96B',
  attention:    '#B0761A',
  attentionSoft:'rgba(176,118,26,0.14)',
  high:         '#C4432B',
  highSoft:     'rgba(196,67,43,0.12)',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export type Palette = typeof palette;
export type ColorToken = keyof Palette;

export const fonts = {
  regular:   'Manrope_400Regular',
  medium:    'Manrope_500Medium',
  semibold:  'Manrope_600SemiBold',
  bold:      'Manrope_700Bold',
  extrabold: 'Manrope_800ExtraBold',
  mono:      'IBMPlexMono_400Regular',
  monoMd:    'IBMPlexMono_500Medium',
  monoSb:    'IBMPlexMono_600SemiBold',
} as const;

// Type ramp. `fontFamily` carries weight — never pair with `fontWeight`.
export const type = {
  display: { fontFamily: fonts.extrabold, fontSize: 40, lineHeight: 42, letterSpacing: -1.2 },
  h1:      { fontFamily: fonts.extrabold, fontSize: 30, lineHeight: 34, letterSpacing: -0.9 },
  h2:      { fontFamily: fonts.extrabold, fontSize: 24, lineHeight: 28, letterSpacing: -0.6 },
  h3:      { fontFamily: fonts.bold,      fontSize: 19, lineHeight: 24, letterSpacing: -0.3 },
  bodyLg:  { fontFamily: fonts.regular,   fontSize: 17, lineHeight: 26 },
  body:    { fontFamily: fonts.regular,   fontSize: 15, lineHeight: 22 },
  bodyMd:  { fontFamily: fonts.medium,    fontSize: 15, lineHeight: 22 },
  sm:      { fontFamily: fonts.medium,    fontSize: 13, lineHeight: 18 },
  eyebrow: { fontFamily: fonts.monoMd,    fontSize: 11, lineHeight: 15, letterSpacing: 1.4 },
  label:   { fontFamily: fonts.mono,      fontSize: 12, lineHeight: 16, letterSpacing: 0.3 },
  mono:    { fontFamily: fonts.mono,      fontSize: 13, lineHeight: 18 },
} as const;

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, x2: 24, x3: 32, x4: 40, x5: 56, x6: 72,
} as const;

export const radius = {
  sm: 8, md: 12, lg: 16, xl: 20, x2: 24, x3: 28, pill: 999,
} as const;

// Soft warm shadows for a light, premium paper UI.
export const shadow = {
  sm: { shadowColor: '#4a2a10', shadowOffset: { width: 0, height: 2 },  shadowOpacity: 0.06, shadowRadius: 8,  elevation: 2 },
  md: { shadowColor: '#4a2a10', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.10, shadowRadius: 24, elevation: 6 },
  lg: { shadowColor: '#3a1f0c', shadowOffset: { width: 0, height: 22 }, shadowOpacity: 0.14, shadowRadius: 46, elevation: 12 },
} as const;

export const layout = {
  screenX: spacing.xl,
  maxContentWidth: 460,
  tabBarHeight: 64,
} as const;
