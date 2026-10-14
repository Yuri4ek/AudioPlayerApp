import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme, useThemeStore } from '../theme';

const START = { x: 0.15, y: 0 };
const END = { x: 0.85, y: 1 };

/** Full-screen app background: a gradient preset or the user's photo. Rendered once behind all screens. */
export const Backdrop = memo(function Backdrop() {
  const t = useTheme();
  const uri = useThemeStore((s) => (s.background.kind === 'image' ? s.background.uri : null));
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: t.bg }]}>
      {uri ? (
        <>
          <Image source={uri} style={StyleSheet.absoluteFill} contentFit="cover" transition={200} cachePolicy="memory-disk" />
          <View style={[StyleSheet.absoluteFill, { backgroundColor: t.scrim }]} />
        </>
      ) : (
        <LinearGradient colors={t.backdrop} start={START} end={END} style={StyleSheet.absoluteFill} />
      )}
    </View>
  );
});
