import { Directory, File, Paths } from 'expo-file-system';

import type { Track } from '../model/types';

export const musicDir = () => new Directory(Paths.document, 'music');

export const trackFile = (t: Track) => new File(musicDir(), t.file);

export const parseName = (name: string) => {
  const base = name.replace(/\.[^.]+$/, '').replace(/_/g, ' ').trim();
  const i = base.indexOf(' - ');
  return i > 0
    ? { artist: base.slice(0, i).trim(), title: base.slice(i + 3).trim() }
    : { artist: 'Неизвестный исполнитель', title: base || 'Без названия' };
};
