import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddTracksButton } from '@/features/add-tracks';
import { IconButton, Txt } from '@/shared/ui';
import { HeadsetCard } from '@/widgets/headset-card';
import { MINI_PLAYER_HEIGHT, MiniPlayer } from '@/widgets/mini-player';
import { TrackList } from '@/widgets/track-list';

const s = StyleSheet.create({
  root: { flex: 1 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, paddingTop: 8 },
  actions: { flexDirection: 'row', gap: 10 },
});

const openThemes = () => router.push('/themes');

const header = (
  <>
    <View style={s.top}>
      <Txt v="h1">Музыка</Txt>
      <View style={s.actions}>
        <IconButton icon="color-palette" onPress={openThemes} label="Оформление" />
        <AddTracksButton />
      </View>
    </View>
    <HeadsetCard />
  </>
);

export function HomePage() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.root, { paddingTop: insets.top + 8 }]}>
      <TrackList header={header} bottomInset={insets.bottom + MINI_PLAYER_HEIGHT + 32} />
      <MiniPlayer bottom={insets.bottom} />
    </View>
  );
}
