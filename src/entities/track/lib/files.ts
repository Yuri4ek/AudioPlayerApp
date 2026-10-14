import { Directory, File, Paths } from 'expo-file-system';

import type { Track } from '../model/types';

export const musicDir = () => new Directory(Paths.document, 'music');
const artDir = () => new Directory(Paths.document, 'artwork');
const lyricsDir = () => new Directory(Paths.document, 'lyrics');

export const trackFile = (t: Track) => new File(musicDir(), t.file);
export const artFile = (t: Pick<Track, 'id'>) => new File(artDir(), t.id + '.jpg');
export const lyricsFile = (t: Pick<Track, 'id'>) => new File(lyricsDir(), t.id + '.txt');

export const artUri = (t: Track | undefined) => (t?.art ? artFile(t).uri : undefined);

export const ensureDir = (d: Directory) => {
  if (!d.exists) d.create({ intermediates: true, idempotent: true });
};

export const readLyrics = async (t: Track) => {
  const f = lyricsFile(t);
  return t.lyrics && f.exists ? f.text() : '';
};

export const writeLyrics = (t: Pick<Track, 'id'>, text: string) => {
  const f = lyricsFile(t);
  if (!text.trim()) {
    if (f.exists) f.delete();
    return false;
  }
  ensureDir(lyricsDir());
  f.write(text);
  return true;
};

/** Removes a track's file together with its artwork and lyrics. */
export const deleteTrackFiles = (t: Track) => {
  for (const f of [trackFile(t), artFile(t), lyricsFile(t)]) {
    try {
      if (f.exists) f.delete();
    } catch {}
  }
};

export const parseName = (name: string) => {
  const base = name.replace(/\.[^.]+$/, '').replace(/_/g, ' ').trim();
  const i = base.indexOf(' - ');
  return i > 0
    ? { artist: base.slice(0, i).trim(), title: base.slice(i + 3).trim() }
    : { artist: 'Неизвестный исполнитель', title: base || 'Без названия' };
};
