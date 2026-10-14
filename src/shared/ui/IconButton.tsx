import Ionicons from '@expo/vector-icons/Ionicons';
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
  label?: string;
};

export const IconButton = memo(function IconButton({ icon, onPress, size = 44, primary, plain, label }: Props) {
  const t = useTheme();
  const bg = primary ? t.accent : plain ? 'transparent' : t.card;
  const fg = primary ? t.onAccent : t.text;
  return (
    <Tap
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      style={[s.btn, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}
    >
      <Ionicons name={icon} size={size * 0.48} color={fg} />
    </Tap>
  );
});

const s = StyleSheet.create({
  btn: { alignItems: 'center', justifyContent: 'center' },
});
