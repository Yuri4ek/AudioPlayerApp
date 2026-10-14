import { NativeModule, requireOptionalNativeModule } from 'expo';

import type { AudioRoute, HeadsetModuleEvents } from './Headset.types';

declare class HeadsetModule extends NativeModule<HeadsetModuleEvents> {
  getRoute(): AudioRoute;
}

export default requireOptionalNativeModule<HeadsetModule>('Headset');
