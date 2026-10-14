import { memo, useRef, useState } from 'react';
import { type GestureResponderEvent, StyleSheet, View } from 'react-native';

import { seek, usePlayer, useProgress } from '@/entities/player';
import { formatTime } from '@/shared/lib';
import { useTheme } from '@/shared/theme';
import { Txt } from '@/shared/ui';

export const SeekBar = memo(function SeekBar() {
  const t = useTheme();
  const duration = usePlayer((s) => s.duration);
  const position = useProgress((s) => s.position);
  const [drag, setDrag] = useState<number | null>(null);
  const geo = useRef({ x: 0, w: 1 });

  const at = (e: GestureResponderEvent) =>
    Math.max(0, Math.min(1, (e.nativeEvent.pageX - geo.current.x) / geo.current.w)) * duration;

  const value = drag ?? position;
  const ratio = duration > 0 ? Math.min(1, value / duration) : 0;

  return (
    <View>
      <View
        style={s.hit}
        onLayout={(e) => (geo.current.w = e.nativeEvent.layout.width || 1)}
        onStartShouldSetResponder={() => duration > 0}
        onMoveShouldSetResponder={() => duration > 0}
        onResponderGrant={(e) => {
          geo.current.x = e.nativeEvent.pageX - e.nativeEvent.locationX;
          setDrag(at(e));
        }}
        onResponderMove={(e) => setDrag(at(e))}
        onResponderRelease={(e) => {
          seek(at(e));
          setDrag(null);
        }}
        onResponderTerminate={() => setDrag(null)}
      >
        <View pointerEvents="none" style={[s.track, { backgroundColor: t.sep }]}>
          <View style={[s.fill, { width: `${ratio * 100}%`, backgroundColor: t.accent }]} />
        </View>
        <View
          pointerEvents="none"
          style={[s.thumb, { left: `${ratio * 100}%`, backgroundColor: t.accent, transform: [{ scale: drag == null ? 1 : 1.35 }] }]}
        />
      </View>
      <View style={s.times}>
        <Txt v="caption">{formatTime(value)}</Txt>
        <Txt v="caption">-{formatTime(duration - value)}</Txt>
      </View>
    </View>
  );
});

const s = StyleSheet.create({
  hit: { height: 28, justifyContent: 'center' },
  track: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  thumb: { position: 'absolute', width: 16, height: 16, borderRadius: 8, marginLeft: -8, top: 6 },
  times: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
});
