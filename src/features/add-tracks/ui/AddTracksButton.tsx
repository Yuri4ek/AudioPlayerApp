import { memo, useCallback, useState } from 'react';

import { IconButton } from '@/shared/ui';

import { pickTracks } from '../model/pick';

export const AddTracksButton = memo(function AddTracksButton({ size }: { size?: number }) {
  const [busy, setBusy] = useState(false);
  const onPress = useCallback(() => {
    if (busy) return;
    setBusy(true);
    pickTracks().finally(() => setBusy(false));
  }, [busy]);
  return <IconButton icon={busy ? 'hourglass-outline' : 'add'} primary size={size} onPress={onPress} label="Добавить треки" />;
});
