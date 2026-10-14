import { Directory, File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';

import { uid } from '@/shared/lib';
import { useThemeStore } from '@/shared/theme';

const dir = () => new Directory(Paths.document, 'backgrounds');

/** Lets the user pick a photo from the gallery and makes it the app background. */
export const pickBackgroundPhoto = async () => {
  const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.9 });
  if (res.canceled || !res.assets[0]) return;
  const d = dir();
  if (!d.exists) d.create({ intermediates: true, idempotent: true });
  const prev = useThemeStore.getState().background;
  const target = new File(d, `bg-${uid()}.jpg`);
  try {
    new File(res.assets[0].uri).copy(target);
  } catch {
    return;
  }
  useThemeStore.getState().setBackground({ kind: 'image', uri: target.uri });
  if (prev.kind === 'image') removePhoto(prev.uri);
};

export const removePhoto = (uri: string) => {
  try {
    const f = new File(uri);
    if (f.exists) f.delete();
  } catch {}
};
