import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RouteIcon, isHeadphones, routeName, routeTitle } from '@/entities/headset';
import { usePlayer } from '@/entities/player';
import { TrackBackdrop, artUri, useTrack } from '@/entities/track';
import { canPickOutput, useCurrentOutput } from '@/features/output-picker';
import { Controls, SeekBar, VolumeBar } from '@/features/playback-controls';
import { useTheme } from '@/shared/theme';
import { Cover, IconButton, Tap, Txt } from '@/shared/ui';

const openLyrics = () => router.push('/lyrics');
const openOutputs = () => router.push('/output');

export function PlayerPage() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  // The cover fills whatever space the controls leave, so it never overlaps them on small screens.
  const [area, setArea] = useState(0);
  const id = usePlayer((s) => s.currentId);
  const track = useTrack(id);
  const route = useCurrentOutput();
  const on = isHeadphones(route);
  const size = Math.max(0, Math.min(width - 48, area - 24));

  return (
    <View style={[s.root, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 12 }]}>
      <TrackBackdrop track={track} />
      <View style={s.bar}>
        <IconButton icon="chevron-down" onPress={router.back} label="Закрыть" />
        <Txt v="title">Сейчас играет</Txt>
        <View style={s.spacer} />
      </View>

      <View style={s.center} onLayout={(e) => setArea(e.nativeEvent.layout.height)}>
        {size > 0 && (
          <Tap
            scale={0.97}
            onPress={track ? openLyrics : undefined}
            disabled={!track}
            style={[s.cover, { shadowColor: t.dark ? '#000' : t.accent }]}
            accessibilityRole="button"
            accessibilityLabel="Открыть обложку и текст"
          >
            <Cover seed={track?.id ?? 'empty'} uri={artUri(track)} size={size} radius={32} />
          </Tap>
        )}
      </View>

      <View style={s.bottom}>
        <View style={s.metaRow}>
          <View style={s.meta}>
            <Txt v="h2" numberOfLines={1}>
              {track?.title ?? 'Ничего не играет'}
            </Txt>
            <Txt v="body" color={t.sub} numberOfLines={1}>
              {track?.artist ?? 'Выберите трек в библиотеке'}
            </Txt>
          </View>
          {track && <IconButton icon="document-text-outline" size={40} onPress={openLyrics} label="Текст песни" />}
        </View>
        <SeekBar />
        <Controls />
        <VolumeBar />
        <Tap
          scale={0.96}
          onPress={canPickOutput ? openOutputs : undefined}
          disabled={!canPickOutput}
          style={[s.chip, { backgroundColor: on ? t.accentSoft : t.card }]}
          accessibilityRole="button"
          accessibilityLabel="Выбрать аудиовыход"
        >
          <RouteIcon type={route.type} size={16} color={on ? t.accent : t.text} />
          <Txt v="caption" color={t.text} numberOfLines={1} style={s.chipText}>
            {on ? `${routeTitle(route)} · ${routeName(route)}` : routeTitle(route)}
          </Txt>
          {canPickOutput && <Ionicons name="chevron-expand" size={14} color={t.sub} />}
        </Tap>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 24 },
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  spacer: { width: 44 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cover: { borderRadius: 32, elevation: 18, shadowOpacity: 0.35, shadowRadius: 30, shadowOffset: { width: 0, height: 16 } },
  bottom: { gap: 18 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  meta: { flex: 1, gap: 4 },
  chip: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 18,
    maxWidth: '90%',
  },
  chipText: { flexShrink: 1, fontSize: 13 },
});
