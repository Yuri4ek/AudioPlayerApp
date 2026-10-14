import { useEffect } from 'react';

import { next, previous } from '@/entities/player';
import { Headset } from '@/shared/api/headset';

export const useHeadsetControls = () => {
  useEffect(() => {
    const sub = Headset?.addListener('onRemote', ({ action }) => (action === 'next' ? next() : previous()));
    return () => sub?.remove();
  }, []);
};
