import { useSyncExternalStore } from 'react';

import { type AudioOutput, type AudioRoute, Headset } from '@/shared/api/headset';

type Snapshot = { route: AudioRoute; outputs: AudioOutput[] };

const FALLBACK: AudioRoute = { type: 'speaker', name: '' };

const read = (): Snapshot => ({
  route: Headset?.getRoute() ?? FALLBACK,
  outputs: Headset?.getOutputs?.() ?? [],
});

const keyOf = (s: Snapshot) =>
  `${s.route.type}|${s.route.name}|${s.route.id}|${s.outputs.map((o) => `${o.id}:${o.type}:${o.name}`).join(',')}`;

let current = read();
let currentKey = keyOf(current);
const listeners = new Set<() => void>();
let sub: { remove: () => void } | null = null;

const refresh = () => {
  const next = read();
  const k = keyOf(next);
  if (k === currentKey) return;
  current = next;
  currentKey = k;
  listeners.forEach((l) => l());
};

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  if (!sub && Headset) {
    sub = Headset.addListener('onRouteChange', refresh);
    refresh();
  }
  return () => {
    listeners.delete(cb);
    if (!listeners.size) {
      sub?.remove();
      sub = null;
    }
  };
};

const getRoute = () => current.route;
const getOutputs = () => current.outputs;

/** Where the system sends media by default (headphones win over the speaker). */
export const useAudioRoute = () => useSyncExternalStore(subscribe, getRoute);
/** All outputs music can be sent to right now. */
export const useAudioOutputs = () => useSyncExternalStore(subscribe, getOutputs);
/** Non-hook access, e.g. for event handlers. */
export const audioOutputs = () => current.outputs;
export const subscribeAudioRoute = subscribe;
export const audioRoute = () => current.route;

export const isHeadphones = (r: Pick<AudioRoute, 'type'>) => r.type !== 'speaker' && r.type !== 'airplay';
