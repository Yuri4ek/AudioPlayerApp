import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { StyleSheet } from 'react-native';

const GRADIENTS: [string, string][] = [
  ['#FFDD2D', '#FF8A2B'],
  ['#8C5CF6', '#3D6BFF'],
  ['#23B5F2', '#1FC47A'],
  ['#FF5CA8', '#F5444C'],
  ['#3D6BFF', '#23B5F2'],
  ['#FF8A2B', '#FF5CA8'],
  ['#1FC47A', '#FFDD2D'],
  ['#F5444C', '#8C5CF6'],
];

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

/** Gradient used for a track without artwork; also tints the player background. */
export const coverGradient = (seed: string) => GRADIENTS[hash(seed) % GRADIENTS.length];

type Props = { seed: string; uri?: string; size: number; radius?: number };

export const Cover = memo(function Cover({ seed, uri, size, radius = size * 0.28 }: Props) {
  const box = { width: size, height: size, borderRadius: radius };
  if (uri) {
    return <Image source={uri} style={box} contentFit="cover" transition={150} recyclingKey={seed} cachePolicy="memory-disk" />;
  }
  return (
    <LinearGradient colors={coverGradient(seed)} start={START} end={END} style={[s.box, box]}>
      <Ionicons name="musical-notes" size={size * 0.42} color="rgba(255,255,255,0.92)" />
    </LinearGradient>
  );
});

const START = { x: 0, y: 0 };
const END = { x: 1, y: 1 };

const s = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
});
