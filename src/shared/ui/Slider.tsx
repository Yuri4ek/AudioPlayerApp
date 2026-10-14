import { LinearGradient } from 'expo-linear-gradient';
import { memo, useRef, useState } from 'react';
import { type GestureResponderEvent, StyleSheet, View } from 'react-native';

import { useTheme } from '../theme';

type Props = {
  /** 0..1 */
  value: number;
  /** Called continuously while dragging. */
  onChange?: (v: number) => void;
  /** Called once when the finger is lifted. */
  onComplete?: (v: number) => void;
  /** Reports the drag value (or null when released), e.g. to show a live time label. */
  onDrag?: (v: number | null) => void;
  disabled?: boolean;
  label?: string;
};

export const Slider = memo(function Slider({ value, onChange, onComplete, onDrag, disabled, label }: Props) {
  const t = useTheme();
  const [drag, setDrag] = useState<number | null>(null);
  const geo = useRef({ x: 0, w: 1 });

  const at = (e: GestureResponderEvent) => Math.max(0, Math.min(1, (e.nativeEvent.pageX - geo.current.x) / geo.current.w));
  const move = (v: number | null) => {
    setDrag(v);
    onDrag?.(v);
    if (v != null) onChange?.(v);
  };

  const ratio = Math.max(0, Math.min(1, drag ?? value));
  const pct = `${ratio * 100}%` as const;

  return (
    <View
      style={s.hit}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(ratio * 100) }}
      onLayout={(e) => (geo.current.w = e.nativeEvent.layout.width || 1)}
      onStartShouldSetResponder={() => !disabled}
      onMoveShouldSetResponder={() => !disabled}
      onResponderTerminationRequest={() => false}
      onResponderGrant={(e) => {
        geo.current.x = e.nativeEvent.pageX - e.nativeEvent.locationX;
        move(at(e));
      }}
      onResponderMove={(e) => move(at(e))}
      onResponderRelease={(e) => {
        const v = at(e);
        onComplete?.(v);
        move(null);
      }}
      onResponderTerminate={() => move(null)}
    >
      <View pointerEvents="none" style={[s.track, { backgroundColor: t.dark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.08)' }]}>
        <LinearGradient colors={t.grad} start={START} end={END} style={[s.fill, { width: pct }]} />
      </View>
      <View
        pointerEvents="none"
        style={[s.thumb, { left: pct, backgroundColor: t.grad[1], borderColor: t.dark ? '#000' : '#fff', transform: [{ scale: drag == null ? 1 : 1.3 }] }]}
      />
    </View>
  );
});

const START = { x: 0, y: 0 };
const END = { x: 1, y: 0 };

const s = StyleSheet.create({
  hit: { height: 28, justifyContent: 'center' },
  track: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  thumb: { position: 'absolute', width: 18, height: 18, borderRadius: 9, marginLeft: -9, top: 5, borderWidth: 3 },
});
