import { memo, useRef, type ReactNode } from 'react';
import { Animated, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, 'style' | 'children'> & {
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  scale?: number;
};

// The pressable itself is animated, so layout styles (flex, width %) apply to the
// element that actually takes part in layout.
export const Tap = memo(function Tap({ style, children, scale = 0.96, ...rest }: Props) {
  const v = useRef(new Animated.Value(1)).current;
  const to = (toValue: number) =>
    Animated.spring(v, { toValue, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  return (
    <AnimatedPressable
      {...rest}
      onPressIn={() => to(scale)}
      onPressOut={() => to(1)}
      style={[style, { transform: [{ scale: v }] }]}
    >
      {children}
    </AnimatedPressable>
  );
});
