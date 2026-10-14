import { type ReactElement, memo, useCallback } from 'react';
import { FlatList, type ListRenderItem, StyleSheet, View } from 'react-native';

import { play, usePlayer } from '@/entities/player';
import { TRACK_ROW_HEIGHT, type Track, TrackRow, useTracks } from '@/entities/track';
import { AddTracksButton } from '@/features/add-tracks';
import { confirmRemove } from '@/features/remove-track';
import { useTheme } from '@/shared/theme';
import { Txt } from '@/shared/ui';

const Row = memo(function Row({ track }: { track: Track }) {
  const active = usePlayer((s) => s.currentId === track.id);
  const playing = usePlayer((s) => s.currentId === track.id && s.playing);
  return <TrackRow track={track} active={active} playing={playing} onPress={play} onLongPress={confirmRemove} />;
});

const renderItem: ListRenderItem<Track> = ({ item }) => <Row track={item} />;
const keyExtractor = (t: Track) => t.id;
const getItemLayout = (_: unknown, index: number) => ({ length: TRACK_ROW_HEIGHT, offset: TRACK_ROW_HEIGHT * index, index });

const Empty = memo(function Empty() {
  const t = useTheme();
  return (
    <View style={[s.empty, { backgroundColor: t.card }]}>
      <AddTracksButton size={64} />
      <Txt v="h2">Здесь пока тихо</Txt>
      <Txt v="sub" style={s.center}>
        Добавьте музыку с устройства — mp3, m4a, flac, wav и другие форматы
      </Txt>
    </View>
  );
});

type Props = { header: ReactElement; bottomInset: number };

export const TrackList = memo(function TrackList({ header, bottomInset }: Props) {
  const tracks = useTracks((s) => s.tracks);
  const t = useTheme();
  const Header = useCallback(
    () => (
      <View style={s.header}>
        {header}
        {tracks.length > 0 && (
          <Txt v="h2" style={s.section}>
            Треки <Txt v="h2" color={t.sub}>{tracks.length}</Txt>
          </Txt>
        )}
      </View>
    ),
    [header, tracks.length, t.sub],
  );
  return (
    <FlatList
      data={tracks}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      ListHeaderComponent={Header}
      ListEmptyComponent={Empty}
      contentContainerStyle={[s.content, { paddingBottom: bottomInset }]}
      initialNumToRender={12}
      windowSize={7}
      maxToRenderPerBatch={12}
      removeClippedSubviews
      showsVerticalScrollIndicator={false}
    />
  );
});

const s = StyleSheet.create({
  content: { paddingHorizontal: 16 },
  header: { gap: 16, marginBottom: 8 },
  section: { marginTop: 8, marginLeft: 4 },
  empty: { borderRadius: 28, padding: 28, alignItems: 'center', gap: 12, marginTop: 8 },
  center: { textAlign: 'center' },
});
