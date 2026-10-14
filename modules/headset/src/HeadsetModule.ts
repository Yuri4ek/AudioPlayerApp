import { NativeModule, requireOptionalNativeModule } from 'expo';
import type { AudioPlayer } from 'expo-audio';

import type { AudioOutput, AudioRoute, HeadsetModuleEvents, TrackMeta } from './Headset.types';

// Functions other than getRoute are Android-only for now; callers must check they exist.
declare class HeadsetModule extends NativeModule<HeadsetModuleEvents> {
  getRoute(): AudioRoute;
  getOutputs?(): AudioOutput[];
  setOutput?(player: AudioPlayer, id: number | null): Promise<void>;
  showOutputSwitcher?(): boolean;
  openBluetoothSettings?(): boolean;
  readMeta?(path: string, artPath: string): Promise<TrackMeta>;
}

export default requireOptionalNativeModule<HeadsetModule>('Headset');
