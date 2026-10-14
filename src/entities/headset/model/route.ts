import { useSyncExternalStore } from 'react';

import { type AudioRoute, Headset } from '@/shared/api/headset';

const FALLBACK: AudioRoute = { type: 'speaker', name: '' };

let current: AudioRoute = Headset?.getRoute() ?? FALLBACK;
const listeners = new Set<() => void>();
let sub: { remove: () => void } | null = null;

const update = (r: AudioRoute) => {
  if (r.type === current.type && r.name === current.name) return;
  current = r;
  listeners.forEach((l) => l());
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  if (!sub && Headset) {
    sub = Headset.addListener('onRouteChange', update);
    update(Headset.getRoute());
  }
  return () => {
    listeners.delete(cb);
    if (!listeners.size) {
      sub?.remove();
      sub = null;
    }
  };
};

const snapshot = () => current;

export const useAudioRoute = () => useSyncExternalStore(subscribe, snapshot);

export const isHeadphones = (r: AudioRoute) => r.type !== 'speaker' && r.type !== 'airplay';
