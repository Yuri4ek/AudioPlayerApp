import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { next, previous, toggle, usePlayer } from '@/entities/player';
import { IconButton } from '@/shared/ui';

export const PlayButton = memo(function PlayButton({ size = 48, glow }: { size?: number; glow?: boolean }) {
  const playing = usePlayer((s) => s.playing);
  return <IconButton icon={playing ? 'pause' : 'play'} primary glow={glow} size={size} onPress={toggle} label={playing ? 'Пауза' : 'Играть'} />;
});

export const NextButton = memo(function NextButton({ size = 44 }: { size?: number }) {
  return <IconButton icon="play-forward" plain size={size} onPress={next} label="Следующий" />;
});

export const PrevButton = memo(function PrevButton({ size = 44 }: { size?: number }) {
  return <IconButton icon="play-back" plain size={size} onPress={previous} label="Предыдущий" />;
});

export const Controls = memo(function Controls() {
  return (
    <View style={s.row}>
      <PrevButton size={64} />
      <PlayButton size={84} glow />
      <NextButton size={64} />
    </View>
  );
});

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 28 },
});
