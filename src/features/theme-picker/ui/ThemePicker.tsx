import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  ACCENTS,
  type AccentKey,
  BACKDROPS,
  type BackdropKey,
  type Mode,
  useTheme,
  useThemeStore,
} from '@/shared/theme';
import { Tap, Txt } from '@/shared/ui';

import { pickBackgroundPhoto, removePhoto } from '../model/background';

const START = { x: 0, y: 0 };
const END = { x: 1, y: 1 };

const MODES: { key: Mode; label: string; icon: 'phone-portrait-outline' | 'sunny' | 'moon' }[] = [
  { key: 'system', label: 'Авто', icon: 'phone-portrait-outline' },
  { key: 'light', label: 'Светлая', icon: 'sunny' },
  { key: 'dark', label: 'Тёмная', icon: 'moon' },
];

const ACCENT_KEYS = Object.keys(ACCENTS) as AccentKey[];
const BACKDROP_KEYS = Object.keys(BACKDROPS) as BackdropKey[];

export const ModePicker = memo(function ModePicker() {
  const t = useTheme();
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  return (
    <View style={[s.segment, { backgroundColor: t.cardAlt }]}>
      {MODES.map((m) => {
        const on = m.key === mode;
        return (
          <Tap
            key={m.key}
            scale={0.97}
            style={[s.seg, on && [s.segOn, { backgroundColor: t.dark ? '#3A3A3E' : '#FFFFFF' }]]}
            onPress={() => setMode(m.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
          >
            <Ionicons name={m.icon} size={16} color={on ? t.accent : t.sub} />
            <Txt v="caption" color={on ? t.text : t.sub} style={s.segText} numberOfLines={1}>
              {m.label}
            </Txt>
          </Tap>
        );
      })}
    </View>
  );
});

export const AccentPicker = memo(function AccentPicker() {
  const accent = useThemeStore((s) => s.accent);
  const setAccent = useThemeStore((s) => s.setAccent);
  return (
    <View style={s.grid}>
      {ACCENT_KEYS.map((k) => {
        const a = ACCENTS[k];
        const on = k === accent;
        return (
          <View key={k} style={s.cell}>
            <Tap
              onPress={() => setAccent(k)}
              style={[s.ring, { borderColor: on ? a.color : 'transparent' }]}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`Цвет ${k}`}
            >
              <LinearGradient colors={a.grad} start={START} end={END} style={s.dot}>
                {on && <Ionicons name="checkmark" size={22} color={a.on} />}
              </LinearGradient>
            </Tap>
          </View>
        );
      })}
    </View>
  );
});

export const BackgroundPicker = memo(function BackgroundPicker() {
  const t = useTheme();
  const bg = useThemeStore((s) => s.background);
  const setBackground = useThemeStore((s) => s.setBackground);
  const choose = (key: BackdropKey) => {
    if (bg.kind === 'image') removePhoto(bg.uri);
    setBackground({ kind: 'preset', key });
  };
  return (
    <View style={s.grid}>
      {BACKDROP_KEYS.map((k) => {
        const preset = BACKDROPS[k];
        const colors = preset ? (t.dark ? preset.dark : preset.light) : t.grad;
        const on = bg.kind === 'preset' && bg.key === k;
        return (
          <View key={k} style={s.cell}>
            <Tap
              onPress={() => choose(k)}
              style={[s.tileRing, { borderColor: on ? t.accent : 'transparent' }]}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
            >
              <LinearGradient colors={colors as unknown as [string, string]} start={START} end={END} style={[s.tile, { borderColor: t.sep }]}>
                {k === 'plain' && <Ionicons name="remove-outline" size={22} color={t.sub} />}
                {k === 'accent' && <Ionicons name="color-palette" size={20} color="rgba(255,255,255,0.95)" />}
              </LinearGradient>
            </Tap>
          </View>
        );
      })}
      <View style={s.cell}>
        <Tap
          onPress={pickBackgroundPhoto}
          style={[s.tileRing, { borderColor: bg.kind === 'image' ? t.accent : 'transparent' }]}
          accessibilityRole="button"
          accessibilityLabel="Выбрать фото"
        >
          <View style={[s.tile, { backgroundColor: t.cardAlt, borderColor: t.sep }]}>
            {bg.kind === 'image' && <Image source={bg.uri} style={StyleSheet.absoluteFill} contentFit="cover" />}
            <View style={s.photoBadge}>
              <Ionicons name={bg.kind === 'image' ? 'swap-horizontal' : 'image'} size={18} color="#fff" />
            </View>
          </View>
        </Tap>
      </View>
    </View>
  );
});

const s = StyleSheet.create({
  segment: { flexDirection: 'row', borderRadius: 16, padding: 4 },
  seg: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 40, borderRadius: 12 },
  segOn: { elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
  segText: { fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 10 },
  cell: { width: '25%', alignItems: 'center' },
  ring: { width: 60, height: 60, borderRadius: 30, borderWidth: 2.5, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  tileRing: { width: 64, height: 64, borderRadius: 20, borderWidth: 2.5, alignItems: 'center', justifyContent: 'center' },
  tile: {
    width: 52,
    height: 52,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  photoBadge: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
});
