import { create } from 'zustand';

import { storage } from '@/shared/lib';

import type { Track } from './types';

type State = {
  tracks: Track[];
  add: (list: Track[]) => void;
  remove: (id: string) => void;
  update: (id: string, patch: Partial<Omit<Track, 'id'>>) => void;
};

const KEY = 'tracks';

export const useTracks = create<State>()((set) => ({
  tracks: storage.get<Track[]>(KEY, []),
  add: (list) => set((s) => ({ tracks: [...s.tracks, ...list] })),
  remove: (id) => set((s) => ({ tracks: s.tracks.filter((t) => t.id !== id) })),
  update: (id, patch) => set((s) => ({ tracks: s.tracks.map((t) => (t.id === id ? { ...t, ...patch } : t)) })),
}));

useTracks.subscribe((s, prev) => {
  if (s.tracks !== prev.tracks) storage.set(KEY, s.tracks);
});

export const useTrack = (id: string | null | undefined) => useTracks((s) => (id ? s.tracks.find((x) => x.id === id) : undefined));
