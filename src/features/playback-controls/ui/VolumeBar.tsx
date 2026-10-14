import Ionicons from '@expo/vector-icons/Ionicons';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { setVolume, useVolume } from '@/entities/player';
import { useTheme } from '@/shared/theme';
import { Slider, Txt } from '@/shared/ui';

export const VolumeBar = memo(function VolumeBar() {
  const t = useTheme();
  const volume = useVolume((s) => s.volume);
  return (
    <View style={s.row}>
      <Ionicons name={volume === 0 ? 'volume-mute' : 'volume-low'} size={18} color={t.sub} />
      <View style={s.slider}>
        <Slider value={volume} onChange={setVolume} label="Громкость" />
      </View>
      <Txt v="caption" style={s.pct}>
        {Math.round(volume * 100)}%
      </Txt>
    </View>
  );
});

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  slider: { flex: 1 },
  pct: { width: 38, textAlign: 'right', fontVariant: ['tabular-nums'] },
});
