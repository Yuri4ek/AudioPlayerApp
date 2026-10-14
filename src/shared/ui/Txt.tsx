import { memo } from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

import { useTheme } from '../theme';

type Variant = 'h1' | 'h2' | 'title' | 'body' | 'sub' | 'caption';

type Props = TextProps & { v?: Variant; color?: string };

export const Txt = memo(function Txt({ v = 'body', color, style, ...rest }: Props) {
  const t = useTheme();
  const c = color ?? (v === 'sub' || v === 'caption' ? t.sub : t.text);
  return <Text {...rest} style={[s[v], { color: c }, style]} />;
});

const s = StyleSheet.create({
  h1: { fontSize: 32, fontWeight: '800', letterSpacing: -0.6 },
  h2: { fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  title: { fontSize: 17, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: '400' },
  sub: { fontSize: 14, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '500' },
});
