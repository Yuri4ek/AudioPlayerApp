import { router } from 'expo-router';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { usePlayer } from '@/entities/player';
import { useTracks } from '@/entities/track';
import { NextButton, PlayButton, ProgressLine } from '@/features/playback-controls';
import { useTheme } from '@/shared/theme';
import { Cover, Tap, Txt } from '@/shared/ui';

export const MINI_PLAYER_HEIGHT = 76;

const open = () => router.push('/player');

export const MiniPlayer = memo(function MiniPlayer({ bottom }: { bottom: number }) {
  const t = useTheme();
  const id = usePlayer((s) => s.currentId);
  const track = useTracks((s) => (id ? s.tracks.find((x) => x.id === id) : undefined));
  if (!track) return null;
  return (
    <View style={[s.wrap, { bottom: bottom + 8 }]}>
      <Tap scale={0.98} onPress={open} feedback={false} style={[s.card, { backgroundColor: t.card, shadowColor: t.dark ? '#000' : '#7A8089' }]}>
        <View style={s.row}>
          <Cover seed={track.id} size={48} radius={14} />
          <View style={s.info}>
            <Txt v="title" numberOfLines={1}>
              {track.title}
            </Txt>
            <Txt v="sub" numberOfLines={1}>
              {track.artist}
            </Txt>
          </View>
          <PlayButton size={44} />
          <NextButton size={40} />
        </View>
        <ProgressLine />
      </Tap>
    </View>
  );
});

const s = StyleSheet.create({
  wrap: { position: 'absolute', left: 12, right: 12 },
  card: {
    height: MINI_PLAYER_HEIGHT,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingTop: 10,
    gap: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 10,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  info: { flex: 1, gap: 1 },
});
