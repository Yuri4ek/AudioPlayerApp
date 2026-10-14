import { useColorScheme } from 'react-native';
import { create } from 'zustand';

import { storage } from '../lib/storage';
import { type AccentKey, type Mode, type Theme, getTheme } from './palettes';

type Prefs = { mode: Mode; accent: AccentKey };

type State = Prefs & {
  setMode: (mode: Mode) => void;
  setAccent: (accent: AccentKey) => void;
};

const KEY = 'theme';

export const useThemeStore = create<State>()((set) => ({
  ...storage.get<Prefs>(KEY, { mode: 'system', accent: 'yellow' }),
  setMode: (mode) => set({ mode }),
  setAccent: (accent) => set({ accent }),
}));

useThemeStore.subscribe(({ mode, accent }) => storage.set(KEY, { mode, accent }));

export const useTheme = (): Theme => {
  const mode = useThemeStore((s) => s.mode);
  const accent = useThemeStore((s) => s.accent);
  const scheme = useColorScheme();
  return getTheme(mode === 'system' ? scheme === 'dark' : mode === 'dark', accent);
};
