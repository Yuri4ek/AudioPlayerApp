import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { RouteIcon, routeName, routeTitle, useAudioOutputs } from '@/entities/headset';
import type { AudioOutput } from '@/shared/api/headset';
import { useTheme } from '@/shared/theme';
import { Tap, Txt } from '@/shared/ui';

import { openBluetoothSettings, selectOutput, showSystemOutputs, useCurrentOutput } from '../model/output';

const START = { x: 0, y: 0 };
const END = { x: 1, y: 1 };

const Item = memo(function Item({ output, active }: { output: AudioOutput; active: boolean }) {
  const t = useTheme();
  return (
    <Tap
      scale={0.98}
      onPress={() => {
        selectOutput(output);
        router.back();
      }}
      style={[s.item, active && { backgroundColor: t.accentSoft }]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      {active ? (
        <LinearGradient colors={t.grad} start={START} end={END} style={s.icon}>
          <RouteIcon type={output.type} size={20} color={t.onAccent} />
        </LinearGradient>
      ) : (
        <View style={[s.icon, { backgroundColor: t.cardAlt }]}>
          <RouteIcon type={output.type} size={20} color={t.sub} />
        </View>
      )}
      <View style={s.info}>
        <Txt v="title" numberOfLines={1}>
          {routeTitle(output)}
        </Txt>
        <Txt v="sub" numberOfLines={1}>
          {routeName(output)}
        </Txt>
      </View>
      {active && <Ionicons name="checkmark-circle" size={22} color={t.accent} />}
    </Tap>
  );
});

const Action = memo(function Action({ icon, label, onPress }: { icon: 'volume-high-outline' | 'bluetooth'; label: string; onPress: () => void }) {
  const t = useTheme();
  return (
    <Tap scale={0.98} onPress={onPress} style={s.item} accessibilityRole="button">
      <View style={[s.icon, { backgroundColor: t.cardAlt }]}>
        <Ionicons name={icon} size={20} color={t.text} />
      </View>
      <Txt v="title" style={s.info} numberOfLines={1}>
        {label}
      </Txt>
      <Ionicons name="chevron-forward" size={18} color={t.sub} />
    </Tap>
  );
});

export const OutputList = memo(function OutputList() {
  const outputs = useAudioOutputs();
  const current = useCurrentOutput();
  return (
    <View>
      {outputs.map((o) => (
        <Item key={o.id} output={o} active={o.id === current.id} />
      ))}
    </View>
  );
});

export const OutputActions = memo(function OutputActions() {
  return (
    <View>
      <Action icon="volume-high-outline" label="Другие устройства" onPress={showSystemOutputs} />
    </View>
  );
});

const s = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, borderRadius: 18 },
  icon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: 1 },
});
