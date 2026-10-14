import { memo, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { seek, usePlayer, useProgress } from '@/entities/player';
import { formatTime } from '@/shared/lib';
import { Slider, Txt } from '@/shared/ui';

export const SeekBar = memo(function SeekBar() {
  const duration = usePlayer((s) => s.duration);
  const position = useProgress((s) => s.position);
  const [drag, setDrag] = useState<number | null>(null);

  const onComplete = useCallback((v: number) => seek(v * duration), [duration]);
  const value = drag != null ? drag * duration : position;

  return (
    <View>
      <Slider
        value={duration > 0 ? value / duration : 0}
        onDrag={setDrag}
        onComplete={onComplete}
        disabled={duration <= 0}
        label="Позиция трека"
      />
      <View style={s.times}>
        <Txt v="caption">{formatTime(value)}</Txt>
        <Txt v="caption">-{formatTime(duration - value)}</Txt>
      </View>
    </View>
  );
});

const s = StyleSheet.create({
  times: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
});
