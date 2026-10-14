import Ionicons from '@expo/vector-icons/Ionicons';
import { memo } from 'react';

import type { RouteType } from '@/shared/api/headset';

const ICONS = {
  speaker: 'phone-portrait-outline',
  wired: 'headset',
  usb: 'headset',
  bluetooth: 'bluetooth',
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
