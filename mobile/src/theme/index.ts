// Public theme surface. Screens import from `@/theme`, never from raw files.
//
// The app ships a single warm-paper (light) theme. `useTheme()` is a hook (not a
// bare export) so a provider / alternate variant can be swapped in later without
// touching call sites.

import { palette, type Palette, fonts, type, spacing, radius, shadow, layout } from './tokens';

export { palette, fonts, type, spacing, radius, shadow, layout };
export type { Palette, ColorToken } from './tokens';

/** Alias kept for readable call sites: `colors.accent`, `colors.text`, … */
export const colors = palette;

export interface Theme {
  colors: Palette;
  fonts: typeof fonts;
  type: typeof type;
  spacing: typeof spacing;
  radius: typeof radius;
  shadow: typeof shadow;
  layout: typeof layout;
}

const theme: Theme = { colors: palette, fonts, type, spacing, radius, shadow, layout };

/** Returns the active theme. Static today; hook-shaped for future theming. */
export function useTheme(): Theme {
  return theme;
}

/** Maps a health status to its solid / soft colour pair. */
export function statusColors(status: 'optimal' | 'normal' | 'attention' | 'high') {
  switch (status) {
    case 'optimal':   return { fg: palette.optimal,   bg: palette.optimalSoft };
    case 'normal':    return { fg: palette.normal,    bg: palette.normalSoft };
    case 'attention': return { fg: palette.attention, bg: palette.attentionSoft };
    case 'high':      return { fg: palette.high,      bg: palette.highSoft };
  }
}
