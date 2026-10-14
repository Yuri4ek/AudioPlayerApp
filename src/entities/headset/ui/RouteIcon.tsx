import Ionicons from '@expo/vector-icons/Ionicons';
import { memo } from 'react';

import type { AudioRoute, RouteType } from '@/shared/api/headset';

const ICONS = {
  speaker: 'phone-portrait-outline',
  wired: 'headset',
  usb: 'headset',
  bluetooth: 'headset',
  airplay: 'tv-outline',
} as const;

export const RouteIcon = memo(function RouteIcon({ type, size, color }: { type: RouteType; size: number; color: string }) {
  return <Ionicons name={ICONS[type]} size={size} color={color} />;
});

export const ROUTE_LABEL: Record<RouteType, string> = {
  speaker: 'Динамик телефона',
  wired: 'Проводные наушники',
  usb: 'USB-наушники',
  bluetooth: 'Bluetooth-наушники',
  airplay: 'AirPlay',
};

/** Short title: «Динамики» or «Наушники». */
export const routeTitle = (r: Pick<AudioRoute, 'type'>) => (r.type === 'speaker' ? 'Динамики' : r.type === 'airplay' ? 'AirPlay' : 'Наушники');

/** Device name, falling back to the kind of output. */
export const routeName = (r: Pick<AudioRoute, 'type' | 'name'>) => r.name || ROUTE_LABEL[r.type];
