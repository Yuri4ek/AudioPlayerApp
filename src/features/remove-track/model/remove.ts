import { Alert } from 'react-native';

import { stop, usePlayer } from '@/entities/player';
import { type Track, deleteTrackFiles, useTracks } from '@/entities/track';

export const confirmRemove = (track: Track) =>
  Alert.alert('Удалить трек?', `«${track.title}» будет удалён с устройства`, [
    { text: 'Отмена', style: 'cancel' },
    {
      text: 'Удалить',
      style: 'destructive',
      onPress: () => {
        if (usePlayer.getState().currentId === track.id) stop();
        useTracks.getState().remove(track.id);
        deleteTrackFiles(track);
      },
    },
  ]);
