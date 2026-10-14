import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { usePlayer, useProgress } from '@/entities/player';
import { useTheme } from '@/shared/theme';

export const ProgressLine = memo(function ProgressLine() {
  const t = useTheme();
  const duration = usePlayer((s) => s.duration);
  const ratio = useProgress((s) => (duration > 0 ? Math.min(1, s.position / duration) : 0));
  return (
    <View style={[s.line, { backgroundColor: t.sep }]}>
      <View style={[s.fill, { width: `${ratio * 100}%`, backgroundColor: t.accent }]} />
    </View>
  );
});

const s = StyleSheet.create({
  line: { height: 3, borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%' },
});
