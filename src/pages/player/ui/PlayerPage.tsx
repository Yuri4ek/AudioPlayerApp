import { router } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ROUTE_LABEL, RouteIcon, isHeadphones, useAudioRoute } from '@/entities/headset';
import { usePlayer } from '@/entities/player';
import { useTracks } from '@/entities/track';
import { Controls, SeekBar } from '@/features/playback-controls';
import { useTheme } from '@/shared/theme';
import { Cover, IconButton, Txt } from '@/shared/ui';

export function PlayerPage() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const id = usePlayer((s) => s.currentId);
  const track = useTracks((s) => (id ? s.tracks.find((x) => x.id === id) : undefined));
  const route = useAudioRoute();
  const on = isHeadphones(route);
  const size = Math.min(width - 48, height * 0.42);

  return (
    <View style={[s.root, { backgroundColor: t.bg, paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }]}>
      <View style={s.bar}>
        <IconButton icon="chevron-down" onPress={router.back} label="Закрыть" />
        <Txt v="title">Сейчас играет</Txt>
        <View style={s.spacer} />
      </View>

      <View style={s.center}>
        <Cover seed={track?.id ?? 'empty'} size={size} radius={36} />
      </View>

      <View style={s.bottom}>
        <View style={s.meta}>
          <Txt v="h2" numberOfLines={1}>
            {track?.title ?? 'Ничего не играет'}
          </Txt>
          <Txt v="body" color={t.sub} numberOfLines={1}>
            {track?.artist ?? 'Выберите трек в библиотеке'}
          </Txt>
        </View>
        <SeekBar />
        <Controls />
        <View style={[s.chip, { backgroundColor: on ? t.accentSoft : t.cardAlt }]}>
          <RouteIcon type={route.type} size={16} color={on ? t.text : t.sub} />
          <Txt v="caption" color={on ? t.text : t.sub} numberOfLines={1}>
            {on ? route.name || ROUTE_LABEL[route.type] : ROUTE_LABEL.speaker}
          </Txt>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, paddingHorizontal: 24 },
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  spacer: { width: 44 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottom: { gap: 22 },
  meta: { gap: 4 },
  chip: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, height: 32, borderRadius: 16, maxWidth: '80%' },
});
