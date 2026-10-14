import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ROUTE_LABEL, RouteIcon, isHeadphones, useAudioRoute } from '@/entities/headset';
import { useTheme } from '@/shared/theme';
import { Txt } from '@/shared/ui';

export const HeadsetCard = memo(function HeadsetCard() {
  const t = useTheme();
  const route = useAudioRoute();
  const on = isHeadphones(route);
  return (
    <View style={[s.card, { backgroundColor: t.card }]}>
      <View style={[s.icon, { backgroundColor: on ? t.accent : t.cardAlt }]}>
        <RouteIcon type={route.type} size={22} color={on ? t.onAccent : t.sub} />
      </View>
      <View style={s.info}>
        <Txt v="title" numberOfLines={1}>
          {on ? route.name || ROUTE_LABEL[route.type] : 'Наушники не подключены'}
        </Txt>
        <Txt v="sub" numberOfLines={1}>
          {on ? `${ROUTE_LABEL[route.type]} · жесты активны` : 'Звук идёт через ' + ROUTE_LABEL[route.type].toLowerCase()}
        </Txt>
      </View>
      <View style={[s.dot, { backgroundColor: on ? '#1FC47A' : t.sep }]} />
    </View>
  );
});

const s = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 24, gap: 14 },
  icon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: 2 },
  dot: { width: 10, height: 10, borderRadius: 5 },
});
