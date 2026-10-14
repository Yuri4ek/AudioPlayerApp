import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';

import { type Track, musicDir, parseName, scanPending, useTracks } from '@/entities/track';
import { uid } from '@/shared/lib';

export const pickTracks = async () => {
  const res = await DocumentPicker.getDocumentAsync({
    type: 'audio/*',
    multiple: true,
    copyToCacheDirectory: true,
  });
  if (res.canceled) return;
  const dir = musicDir();
  if (!dir.exists) dir.create({ intermediates: true, idempotent: true });
  const added: Track[] = [];
  for (const a of res.assets) {
    const ext = a.name.match(/\.[^.]+$/)?.[0] ?? '';
    const id = uid();
    const file = id + ext;
    try {
      await new File(a.uri).move(new File(dir, file));
      added.push({ id, file, ...parseName(a.name) });
    } catch {}
  }
  if (added.length) {
    useTracks.getState().add(added);
    scanPending();
  }
};
