import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePlayer } from '@/entities/player';
import { TrackBackdrop, artUri, readLyrics, useTrack, useTracks, writeLyrics } from '@/entities/track';
import { useTheme } from '@/shared/theme';
import { Cover, IconButton, Tap, Txt } from '@/shared/ui';

const START = { x: 0, y: 0 };
const END = { x: 1, y: 1 };

export function LyricsPage() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const id = usePlayer((s) => s.currentId);
  const track = useTrack(id);
  // Lyrics are loaded per track; reloaded when another track starts or its lyrics appear after a tag scan.
  const key = track ? `${track.id}|${track.lyrics ? 1 : 0}` : '';
  const [loaded, setLoaded] = useState<{ key: string; text: string }>({ key: '', text: '' });
  const [draft, setDraft] = useState<string | null>(null);
  const text = loaded.key === key ? loaded.text : null;

  useEffect(() => {
    if (!track) return;
    let alive = true;
    const done = (v: string) => alive && setLoaded({ key, text: v });
    readLyrics(track).then(done, () => done(''));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const save = () => {
    if (!track || draft == null) return;
    const has = writeLyrics(track, draft);
    useTracks.getState().update(track.id, { lyrics: has });
    setLoaded({ key: `${track.id}|${has ? 1 : 0}`, text: has ? draft.trim() : '' });
    setDraft(null);
  };

  const editing = draft != null;
  const size = width - 48;

  return (
    <View style={s.root}>
      <TrackBackdrop track={track} />
      <View style={[s.bar, { paddingTop: insets.top + 8 }]}>
        <IconButton icon="chevron-down" onPress={router.back} label="Закрыть" />
        {track && !!text && !editing && <IconButton icon="create-outline" onPress={() => setDraft(text)} label="Редактировать текст" />}
        {editing && (
          <View style={s.actions}>
            <IconButton icon="close" onPress={() => setDraft(null)} label="Отмена" />
            <IconButton icon="checkmark" primary onPress={save} label="Сохранить" />
          </View>
        )}
      </View>
      <KeyboardAvoidingView style={s.flex} behavior="padding">
        <ScrollView
          contentContainerStyle={[s.content, { paddingBottom: insets.bottom + 32 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[s.cover, { shadowColor: t.dark ? '#000' : t.accent }]}>
            <Cover seed={track?.id ?? 'empty'} uri={artUri(track)} size={size} radius={32} />
          </View>
          <View style={s.meta}>
            <Txt v="h2">{track?.title ?? 'Ничего не играет'}</Txt>
            <Txt v="body" color={t.sub}>
              {track?.artist ?? ''}
            </Txt>
          </View>

          {editing ? (
            <TextInput
              value={draft}
              onChangeText={setDraft}
              multiline
              autoFocus
              placeholder="Вставьте или введите текст песни"
              placeholderTextColor={t.sub}
              textAlignVertical="top"
              style={[s.input, { color: t.text, backgroundColor: t.card }]}
            />
          ) : text ? (
            <View style={[s.lyrics, { backgroundColor: t.card }]}>
              <Txt v="body" style={s.lyricsText} selectable>
                {text}
              </Txt>
            </View>
          ) : text === '' && track ? (
            <View style={[s.empty, { backgroundColor: t.card }]}>
              <Ionicons name="document-text-outline" size={28} color={t.sub} />
              <Txt v="title">Текст не найден</Txt>
              <Txt v="sub" style={s.center}>
                В файле нет встроенного текста. Можно добавить его вручную.
              </Txt>
              <Tap onPress={() => setDraft('')} style={s.addWrap} accessibilityRole="button">
                <LinearGradient colors={t.grad} start={START} end={END} style={s.add}>
                  <Ionicons name="add" size={18} color={t.onAccent} />
                  <Txt v="title" color={t.onAccent} style={s.addText}>
                    Добавить текст
                  </Txt>
                </LinearGradient>
              </Tap>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingBottom: 8 },
  actions: { flexDirection: 'row', gap: 10 },
  content: { paddingHorizontal: 24, paddingTop: 8, gap: 20 },
  cover: { borderRadius: 32, elevation: 18, shadowOpacity: 0.35, shadowRadius: 30, shadowOffset: { width: 0, height: 16 } },
  meta: { gap: 4 },
  lyrics: { borderRadius: 24, padding: 20 },
  lyricsText: { fontSize: 18, lineHeight: 28, fontWeight: '500' },
  input: { borderRadius: 24, padding: 20, minHeight: 240, fontSize: 17, lineHeight: 26 },
  empty: { borderRadius: 24, padding: 24, alignItems: 'center', gap: 8 },
  center: { textAlign: 'center' },
  addWrap: { marginTop: 8 },
  add: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 18, height: 44, borderRadius: 22 },
  addText: { fontSize: 15 },
});
