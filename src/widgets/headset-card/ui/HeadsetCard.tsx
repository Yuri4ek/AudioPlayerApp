import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { RouteIcon, isHeadphones, routeName, routeTitle } from '@/entities/headset';
import { canPickOutput, useCurrentOutput } from '@/features/output-picker';
import { useTheme } from '@/shared/theme';
import { Tap, Txt } from '@/shared/ui';

const START = { x: 0, y: 0 };
const END = { x: 1, y: 1 };

const open = () => router.push('/output');

export const HeadsetCard = memo(function HeadsetCard() {
  const t = useTheme();
  const route = useCurrentOutput();
  const on = isHeadphones(route);
  return (
    <Tap
      scale={0.98}
      onPress={canPickOutput ? open : undefined}
      disabled={!canPickOutput}
      style={[s.card, { backgroundColor: t.card }]}
      accessibilityRole="button"
      accessibilityLabel={`Аудиовыход: ${routeTitle(route)}. Выбрать устройство`}
    >
      {on ? (
        <LinearGradient colors={t.grad} start={START} end={END} style={s.icon}>
          <RouteIcon type={route.type} size={22} color={t.onAccent} />
        </LinearGradient>
      ) : (
        <View style={[s.icon, { backgroundColor: t.cardAlt }]}>
          <RouteIcon type={route.type} size={22} color={t.text} />
        </View>
      )}
      <View style={s.info}>
        <Txt v="title" numberOfLines={1}>
          {routeTitle(route)}
        </Txt>
        <Txt v="sub" numberOfLines={1}>
          {routeName(route)}
        </Txt>
      </View>
      {canPickOutput && (
        <View style={[s.chevron, { backgroundColor: t.cardAlt }]}>
          <Ionicons name="swap-vertical" size={16} color={t.sub} />
        </View>
      )}
    </Tap>
  );
});

const s = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 24, gap: 14 },
  icon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: 2 },
  chevron: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
