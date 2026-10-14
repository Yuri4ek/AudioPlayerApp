import { useEffect } from 'react';

import { audioRoute, isHeadphones, subscribeAudioRoute } from '@/entities/headset';
import { next, pause, previous, resume, usePlayer } from '@/entities/player';
import { Headset } from '@/shared/api/headset';

/** Resume when headphones come back within this time after they were removed. */
const RESUME_WINDOW = 30 * 60 * 1000;

export const useHeadsetControls = () => {
  useEffect(() => {
    let pausedByUnplug = 0;

    const subs = [
      // next/previous/play arriving from the media session: headset gestures, notification, lock screen.
      Headset?.addListener('onRemote', ({ action }) => {
        if (action === 'next') next();
        else if (action === 'previous') previous();
        // Already playing natively; this re-acquires audio focus and syncs state.
        else resume();
      }),
      // Headphones unplugged / disconnected: pause instead of blasting the speaker.
      Headset?.addListener('onNoisy', () => {
        if (!usePlayer.getState().playing) return;
        pause();
        pausedByUnplug = Date.now();
      }),
    ];

    const unsubRoute = subscribeAudioRoute(() => {
      if (!pausedByUnplug || !isHeadphones(audioRoute())) return;
      const recent = Date.now() - pausedByUnplug < RESUME_WINDOW;
      pausedByUnplug = 0;
      if (recent && !usePlayer.getState().playing) resume();
    });

    const unsubPlayer = usePlayer.subscribe((s, prev) => {
      if (s.playing && !prev.playing) pausedByUnplug = 0;
    });

    return () => {
      subs.forEach((sub) => sub?.remove());
      unsubRoute();
      unsubPlayer();
    };
  }, []);
};
