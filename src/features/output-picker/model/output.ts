import { create } from 'zustand';

import { audioOutputs, audioRoute, subscribeAudioRoute, useAudioOutputs, useAudioRoute } from '@/entities/headset';
import { getAudioPlayer, onAudioPlayer } from '@/entities/player';
import { type AudioOutput, type AudioRoute, Headset } from '@/shared/api/headset';

/** Output chosen by the user; null = follow the system (headphones when connected). */
const useOutputStore = create<{ preferredId: number | null }>()(() => ({ preferredId: null }));

const apply = (id: number | null) => {
  const p = getAudioPlayer();
  if (p) Headset?.setOutput?.(p, id).catch(() => {});
};

export const canPickOutput = !!Headset?.setOutput;

export const selectOutput = (o: AudioOutput) => {
  // Picking the device the system already uses means "follow the system" again.
  const id = audioRoute().id === o.id ? null : o.id;
  useOutputStore.setState({ preferredId: id });
  apply(id);
};

onAudioPlayer((p) => {
  const id = useOutputStore.getState().preferredId;
  if (id != null) Headset?.setOutput?.(p, id).catch(() => {});
});

// Forget the choice once that device is gone (e.g. headphones disconnected).
subscribeAudioRoute(() => {
  const id = useOutputStore.getState().preferredId;
  if (id != null && !audioOutputs().some((o) => o.id === id)) {
    useOutputStore.setState({ preferredId: null });
    apply(null);
  }
});

/** The output music is actually playing through. */
export const useCurrentOutput = (): AudioRoute => {
  const route = useAudioRoute();
  const outputs = useAudioOutputs();
  const id = useOutputStore((s) => s.preferredId);
  return (id != null && outputs.find((o) => o.id === id)) || route;
};

export const showSystemOutputs = () => Headset?.showOutputSwitcher?.() ?? false;
export const openBluetoothSettings = () => Headset?.openBluetoothSettings?.() ?? false;
