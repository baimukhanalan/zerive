// Typed text primitive. `variant` maps to a type-ramp token; `color` maps to a
// palette token. Keeps font-family (which carries weight) and colour off call
// sites so the type system stays consistent app-wide.

import { Text as RNText, type TextProps, type TextStyle } from 'react-native';
import { type, colors, type ColorToken } from '@/theme';

type Variant = keyof typeof type;

export interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: ColorToken;
  center?: boolean;
  mono?: boolean;
}

export function Text({
  variant = 'body',
  color = 'text',
  center,
  style,
  children,
  ...rest
}: AppTextProps) {
  const base = type[variant] as TextStyle;
  return (
    <RNText
      style={[base, { color: colors[color] }, center && { textAlign: 'center' }, style]}
      {...rest}
    >
      {children}
    </RNText>
  );
}
