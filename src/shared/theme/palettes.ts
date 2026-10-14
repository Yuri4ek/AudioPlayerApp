export const ACCENTS = {
  yellow: { name: 'Жёлтая', color: '#FFDD2D', on: '#1A1A1A' },
  orange: { name: 'Оранжевая', color: '#FF8A2B', on: '#FFFFFF' },
  red: { name: 'Красная', color: '#F5444C', on: '#FFFFFF' },
  pink: { name: 'Розовая', color: '#FF5CA8', on: '#FFFFFF' },
  purple: { name: 'Фиолетовая', color: '#8C5CF6', on: '#FFFFFF' },
  blue: { name: 'Синяя', color: '#3D6BFF', on: '#FFFFFF' },
  cyan: { name: 'Голубая', color: '#23B5F2', on: '#FFFFFF' },
  green: { name: 'Зелёная', color: '#1FC47A', on: '#FFFFFF' },
} as const;

export type AccentKey = keyof typeof ACCENTS;
export type Mode = 'system' | 'light' | 'dark';

const LIGHT = {
  bg: '#F2F3F5',
  card: '#FFFFFF',
  cardAlt: '#F2F3F5',
  text: '#1A1A1A',
  sub: '#8A919C',
  sep: '#E4E6EA',
};

const DARK = {
  bg: '#000000',
  card: '#1C1C1E',
  cardAlt: '#2C2C2F',
  text: '#FFFFFF',
  sub: '#8E8E93',
  sep: '#38383A',
};

export type Theme = typeof LIGHT & {
  dark: boolean;
  accent: string;
  onAccent: string;
  accentSoft: string;
};

const cache = new Map<string, Theme>();

export const getTheme = (dark: boolean, accent: AccentKey): Theme => {
  const key = (dark ? 'd' : 'l') + accent;
  let t = cache.get(key);
  if (!t) {
    const a = ACCENTS[accent];
    t = {
      ...(dark ? DARK : LIGHT),
      dark,
      accent: a.color,
      onAccent: a.on,
      accentSoft: a.color + (dark ? '33' : '26'),
    };
    cache.set(key, t);
  }
  return t;
};
