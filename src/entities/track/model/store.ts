import { create } from 'zustand';

import { storage } from '@/shared/lib';

import type { Track } from './types';

type State = {
  tracks: Track[];
  add: (list: Track[]) => void;
  remove: (id: string) => void;
};

const KEY = 'tracks';

export const useTracks = create<State>()((set) => ({
  tracks: storage.get<Track[]>(KEY, []),
  add: (list) => set((s) => ({ tracks: [...s.tracks, ...list] })),
  remove: (id) => set((s) => ({ tracks: s.tracks.filter((t) => t.id !== id) })),
}));

useTracks.subscribe((s, prev) => {
  if (s.tracks !== prev.tracks) storage.set(KEY, s.tracks);
});
