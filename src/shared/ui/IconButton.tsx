import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, type ComponentProps } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '../theme';
import { Tap } from './Tap';

type Props = {
  icon: ComponentProps<typeof Ionicons>['name'];
  onPress?: () => void;
  size?: number;
  primary?: boolean;
  plain?: boolean;
  glow?: boolean;
  label?: string;
};

export const IconButton = memo(function IconButton({ icon, onPress, size = 44, primary, plain, glow, label }: Props) {
  const t = useTheme();
  const fg = primary ? t.onAccent : t.text;
  const round = { width: size, height: size, borderRadius: size / 2 };
  return (
    <Tap
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={[
        s.btn,
        round,
        !primary && { backgroundColor: plain ? 'transparent' : t.card },
        glow && { shadowColor: t.accent, elevation: 12, shadowOpacity: 0.5, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } },
      ]}
    >
      {primary && <LinearGradient colors={t.grad} start={START} end={END} style={[StyleSheet.absoluteFill, round]} />}
      <Ionicons name={icon} size={size * 0.46} color={fg} />
    </Tap>
  );
});

const START = { x: 0, y: 0 };
const END = { x: 1, y: 1 };

const s = StyleSheet.create({
  btn: { alignItems: 'center', justifyContent: 'center' },
});
