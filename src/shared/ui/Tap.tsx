import { memo, useRef, type ReactNode } from 'react';
import { Animated, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { haptic } from '../lib/haptic';

type Props = Omit<PressableProps, 'style' | 'children'> & {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  scale?: number;
  feedback?: boolean;
};

export const Tap = memo(function Tap({ style, children, scale = 0.96, feedback = true, onPress, ...rest }: Props) {
  const v = useRef(new Animated.Value(1)).current;
  const to = (toValue: number) =>
    Animated.spring(v, { toValue, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  return (
    <Pressable
      {...rest}
      onPressIn={() => to(scale)}
      onPressOut={() => to(1)}
      onPress={(e) => {
        if (feedback) haptic();
        onPress?.(e);
      }}
    >
      <Animated.View style={[style, { transform: [{ scale: v }] }]}>{children}</Animated.View>
    </Pressable>
  );
});
