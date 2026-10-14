import { router } from 'expo-router';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { usePlayer } from '@/entities/player';
import { artUri, useTrack } from '@/entities/track';
import { NextButton, PlayButton, PrevButton, ProgressLine } from '@/features/playback-controls';
import { useTheme } from '@/shared/theme';
import { Cover, Tap, Txt } from '@/shared/ui';

export const MINI_PLAYER_HEIGHT = 76;

const open = () => router.push('/player');

export const MiniPlayer = memo(function MiniPlayer({ bottom }: { bottom: number }) {
  const t = useTheme();
  const id = usePlayer((s) => s.currentId);
  const track = useTrack(id);
  if (!track) return null;
  return (
    <View style={[s.wrap, { bottom: bottom + 8 }]}>
      <Tap
        scale={0.98}
        onPress={open}
        style={[s.card, { backgroundColor: t.dark ? '#1C1C1E' : '#FFFFFF', shadowColor: t.dark ? '#000' : t.accent }]}
      >
        <View style={s.row}>
          <Cover seed={track.id} uri={artUri(track)} size={48} radius={14} />
          <View style={s.info}>
            <Txt v="title" numberOfLines={1}>
              {track.title}
            </Txt>
            <Txt v="sub" numberOfLines={1}>
              {track.artist}
            </Txt>
          </View>
          <View style={s.controls}>
            <PrevButton size={36} />
            <PlayButton size={44} />
            <NextButton size={36} />
          </View>
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
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 10,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  info: { flex: 1, gap: 1 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 2 },
});
