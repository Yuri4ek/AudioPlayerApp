import { Headset } from '@/shared/api/headset';

import { artFile, trackFile, writeLyrics } from '../lib/files';
import { useTracks } from './store';
import type { Track } from './types';

/** Reads tags, embedded artwork and lyrics from the audio file (Android). */
const scan = async (t: Track) => {
  const patch: Partial<Track> = { scanned: true };
  if (Headset?.readMeta) {
    try {
      const meta = await Headset.readMeta(trackFile(t).uri, artFile(t).uri);
      if (meta.title) patch.title = meta.title;
      if (meta.artist) patch.artist = meta.artist;
      patch.art = meta.art;
      if (meta.lyrics) patch.lyrics = writeLyrics(t, meta.lyrics);
    } catch {}
  }
  useTracks.getState().update(t.id, patch);
};

let running = false;

/** Scans not-yet-scanned tracks one by one in the background. */
export const scanPending = async () => {
  if (running) return;
  running = true;
  try {
    for (;;) {
      const next = useTracks.getState().tracks.find((t) => !t.scanned);
      if (!next) break;
      await scan(next);
    }
  } finally {
    running = false;
  }
};
