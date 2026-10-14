import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { Cover, Tap, Txt } from '@/shared/ui';

import { artUri } from '../lib/files';
import type { Track } from '../model/types';

export const TRACK_ROW_HEIGHT = 72;

type Props = {
  track: Track;
  active: boolean;
  playing: boolean;
  onPress: (id: string) => void;
  onLongPress: (track: Track) => void;
};

export const TrackRow = memo(function TrackRow({ track, active, playing, onPress, onLongPress }: Props) {
  const t = useTheme();
  return (
    <Tap
      scale={0.98}
      onPress={() => onPress(track.id)}
      onLongPress={() => onLongPress(track)}
      style={[s.row, active && { backgroundColor: t.card }]}
    >
      {active && (
        <LinearGradient
          colors={[t.grad[0] + '38', t.grad[1] + '14']}
          start={START}
          end={END}
          style={[StyleSheet.absoluteFill, s.radius]}
        />
      )}
      <Cover seed={track.id} uri={artUri(track)} size={48} radius={14} />
      <View style={s.info}>
        <Txt v="title" numberOfLines={1}>
          {track.title}
        </Txt>
        <Txt v="sub" numberOfLines={1}>
          {track.artist}
        </Txt>
      </View>
      {active && (
        <LinearGradient colors={t.grad} start={START} end={END} style={s.badge}>
          <Ionicons name={playing ? 'volume-high' : 'pause'} size={14} color={t.onAccent} />
        </LinearGradient>
      )}
    </Tap>
  );
});

const START = { x: 0, y: 0 };
const END = { x: 1, y: 1 };

const s = StyleSheet.create({
  row: {
    height: TRACK_ROW_HEIGHT - 4,
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 20,
    gap: 14,
    overflow: 'hidden',
  },
  radius: { borderRadius: 20 },
  info: { flex: 1, gap: 2 },
  badge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});
