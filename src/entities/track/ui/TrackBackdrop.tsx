import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/shared/theme';
import { coverGradient } from '@/shared/ui';

import { artUri } from '../lib/files';
import type { Track } from '../model/types';

/** Full-screen background tinted by the track: blurred artwork, or its cover gradient. */
export const TrackBackdrop = memo(function TrackBackdrop({ track }: { track: Track | undefined }) {
  const t = useTheme();
  const uri = artUri(track);
  const [a, b] = coverGradient(track?.id ?? 'empty');
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: t.bg }]}>
      {uri ? (
        <>
          <Image source={uri} style={StyleSheet.absoluteFill} contentFit="cover" blurRadius={60} cachePolicy="memory-disk" />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: t.dark ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.6)' }]} />
        </>
      ) : (
        <LinearGradient
          colors={[a + (t.dark ? '66' : '59'), b + (t.dark ? '33' : '2E'), t.bg]}
          locations={[0, 0.45, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
    </View>
  );
});
