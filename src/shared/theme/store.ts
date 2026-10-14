import { useColorScheme } from 'react-native';
import { create } from 'zustand';

import { storage } from '../lib/storage';
import { type AccentKey, type Background, type Mode, type Theme, ACCENTS, BACKDROPS, getTheme } from './palettes';

type Prefs = { mode: Mode; accent: AccentKey; background: Background };

type State = Prefs & {
  setMode: (mode: Mode) => void;
  setAccent: (accent: AccentKey) => void;
  setBackground: (background: Background) => void;
};

const KEY = 'theme';
const DEFAULTS: Prefs = { mode: 'system', accent: 'green', background: { kind: 'preset', key: 'accent' } };

const load = (): Prefs => {
  const p = { ...DEFAULTS, ...storage.get<Partial<Prefs>>(KEY, {}) };
  if (!(p.accent in ACCENTS)) p.accent = DEFAULTS.accent;
  if (p.background.kind === 'preset' && !(p.background.key in BACKDROPS)) p.background = DEFAULTS.background;
  return p;
};

export const useThemeStore = create<State>()((set) => ({
  ...load(),
  setMode: (mode) => set({ mode }),
  setAccent: (accent) => set({ accent }),
  setBackground: (background) => set({ background }),
}));

useThemeStore.subscribe(({ mode, accent, background }) => storage.set(KEY, { mode, accent, background }));

export const useTheme = (): Theme => {
  const mode = useThemeStore((s) => s.mode);
  const accent = useThemeStore((s) => s.accent);
  const backdrop = useThemeStore((s) => (s.background.kind === 'preset' ? s.background.key : 'plain'));
  const photo = useThemeStore((s) => s.background.kind === 'image');
  const scheme = useColorScheme();
  return getTheme(mode === 'system' ? scheme === 'dark' : mode === 'dark', accent, backdrop, photo);
};
