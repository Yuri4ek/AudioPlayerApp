import Ionicons from '@expo/vector-icons/Ionicons';
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

type Props = { seed: string; size: number; radius?: number };

export const Cover = memo(function Cover({ seed, size, radius = size * 0.28 }: Props) {
  return (
    <LinearGradient
      colors={GRADIENTS[hash(seed) % GRADIENTS.length]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[s.box, { width: size, height: size, borderRadius: radius }]}
    >
      <Ionicons name="musical-notes" size={size * 0.42} color="rgba(255,255,255,0.92)" />
    </LinearGradient>
  );
});

const s = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
});
