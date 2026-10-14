import Ionicons from '@expo/vector-icons/Ionicons';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ACCENTS, type AccentKey, type Mode, useTheme, useThemeStore } from '@/shared/theme';
import { Tap, Txt } from '@/shared/ui';

const MODES: { key: Mode; label: string; icon: 'phone-portrait-outline' | 'sunny' | 'moon' }[] = [
  { key: 'system', label: 'Авто', icon: 'phone-portrait-outline' },
  { key: 'light', label: 'Светлая', icon: 'sunny' },
  { key: 'dark', label: 'Тёмная', icon: 'moon' },
];

const KEYS = Object.keys(ACCENTS) as AccentKey[];

export const ModePicker = memo(function ModePicker() {
  const t = useTheme();
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  return (
    <View style={[s.segment, { backgroundColor: t.cardAlt }]}>
      {MODES.map((m) => {
        const on = m.key === mode;
        return (
          <Tap key={m.key} style={[s.seg, on && { backgroundColor: t.card }]} onPress={() => setMode(m.key)}>
            <Ionicons name={m.icon} size={16} color={on ? t.text : t.sub} />
            <Txt v="caption" color={on ? t.text : t.sub}>
              {m.label}
            </Txt>
          </Tap>
        );
      })}
    </View>
  );
});

export const AccentPicker = memo(function AccentPicker() {
  const t = useTheme();
  const accent = useThemeStore((s) => s.accent);
  const setAccent = useThemeStore((s) => s.setAccent);
  return (
    <View style={s.grid}>
      {KEYS.map((k) => {
        const a = ACCENTS[k];
        const on = k === accent;
        return (
          <Tap key={k} style={s.cell} onPress={() => setAccent(k)}>
            <View style={[s.ring, { borderColor: on ? a.color : 'transparent' }]}>
              <View style={[s.dot, { backgroundColor: a.color }]}>
                {on && <Ionicons name="checkmark" size={22} color={a.on} />}
              </View>
            </View>
            <Txt v="caption" color={on ? t.text : t.sub} numberOfLines={1}>
              {a.name}
            </Txt>
          </Tap>
        );
      })}
    </View>
  );
});

const s = StyleSheet.create({
  segment: { flexDirection: 'row', borderRadius: 16, padding: 4 },
  seg: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 40, borderRadius: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 16 },
  cell: { width: '25%', alignItems: 'center', gap: 6 },
  ring: { width: 58, height: 58, borderRadius: 29, borderWidth: 2.5, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
});
