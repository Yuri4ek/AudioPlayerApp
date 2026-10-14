export const ACCENTS = {
  yellow: { color: '#FFC21A', grad: ['#FFE14D', '#FF9F1A'], on: '#1A1A1A' },
  orange: { color: '#FF7A2B', grad: ['#FFA93D', '#FF5A36'], on: '#FFFFFF' },
  red: { color: '#F5444C', grad: ['#FF6B6B', '#E6246E'], on: '#FFFFFF' },
  pink: { color: '#FF4FA0', grad: ['#FF7EC1', '#C447F5'], on: '#FFFFFF' },
  purple: { color: '#8C5CF6', grad: ['#B07BFF', '#5B4BF5'], on: '#FFFFFF' },
  blue: { color: '#3D6BFF', grad: ['#5C9DFF', '#3D4BFF'], on: '#FFFFFF' },
  cyan: { color: '#14B4E8', grad: ['#3FD9F5', '#2A7BFF'], on: '#FFFFFF' },
  green: { color: '#1FC47A', grad: ['#4BE38F', '#12A6A0'], on: '#FFFFFF' },
} as const satisfies Record<string, { color: string; grad: readonly [string, string]; on: string }>;

export type AccentKey = keyof typeof ACCENTS;
export type Mode = 'system' | 'light' | 'dark';

/** Gradient backgrounds; `accent` is tinted with the current accent colour. */
export const BACKDROPS = {
  accent: null,
  sunset: { light: ['#FFD9BF', '#FFD3E6', '#F2F3F5'], dark: ['#4A1D2E', '#24102F', '#000000'] },
  ocean: { light: ['#C9E4FF', '#D3F4EE', '#F2F3F5'], dark: ['#0B2A4A', '#06222F', '#000000'] },
  forest: { light: ['#D3F3DC', '#EBF5CC', '#F2F3F5'], dark: ['#0E3020', '#14260E', '#000000'] },
  candy: { light: ['#EED6FF', '#FFDDEB', '#DCE6FF'], dark: ['#2E1446', '#3A1230', '#101A3A'] },
  plain: { light: ['#F2F3F5', '#F2F3F5'], dark: ['#000000', '#000000'] },
} as const satisfies Record<string, { light: readonly string[]; dark: readonly string[] } | null>;

export type BackdropKey = keyof typeof BACKDROPS;
export type Background = { kind: 'preset'; key: BackdropKey } | { kind: 'image'; uri: string };

const LIGHT = {
  bg: '#F2F3F5',
  card: '#FFFFFF',
  cardAlt: '#ECEEF2',
  text: '#16171A',
  sub: '#7E8590',
  sep: '#E1E4E9',
  scrim: 'rgba(242,243,245,0.55)',
};

const DARK = {
  bg: '#000000',
  card: '#1C1C1E',
  cardAlt: '#2C2C2F',
  text: '#FFFFFF',
  sub: '#8E8E93',
  sep: '#38383A',
  scrim: 'rgba(0,0,0,0.5)',
};

export type Theme = typeof LIGHT & {
  dark: boolean;
  accent: string;
  grad: readonly [string, string];
  onAccent: string;
  accentSoft: string;
  /** Colours of the full-screen gradient behind the app (ignored when a photo is set). */
  backdrop: readonly [string, string, ...string[]];
};

const cache = new Map<string, Theme>();

export const getTheme = (dark: boolean, accent: AccentKey, backdrop: BackdropKey, photo: boolean): Theme => {
  const key = `${dark ? 'd' : 'l'}|${accent}|${backdrop}|${photo ? 1 : 0}`;
  let t = cache.get(key);
  if (!t) {
    const a = ACCENTS[accent];
    const base = dark ? DARK : LIGHT;
    const preset = BACKDROPS[backdrop];
    const colors = preset
      ? (dark ? preset.dark : preset.light)
      : [a.grad[0] + (dark ? '59' : '4D'), a.grad[1] + (dark ? '1F' : '1A'), base.bg, base.bg];
    t = {
      ...base,
      // Translucent cards over a photo look like frosted glass and keep text readable.
      card: photo ? (dark ? 'rgba(28,28,30,0.78)' : 'rgba(255,255,255,0.8)') : base.card,
      cardAlt: photo ? (dark ? 'rgba(60,60,64,0.7)' : 'rgba(236,238,242,0.85)') : base.cardAlt,
      dark,
      accent: a.color,
      grad: a.grad,
      onAccent: a.on,
      accentSoft: a.color + (dark ? '33' : '24'),
      backdrop: colors as unknown as Theme['backdrop'],
    };
    cache.set(key, t);
  }
  return t;
};
