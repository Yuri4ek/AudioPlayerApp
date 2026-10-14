import { type AudioPlayer, type AudioStatus, createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { create } from 'zustand';

import { trackFile, useTracks } from '@/entities/track/@x/player';

type PlayerState = { currentId: string | null; playing: boolean; duration: number };

export const usePlayer = create<PlayerState>()(() => ({ currentId: null, playing: false, duration: 0 }));
export const useProgress = create<{ position: number }>()(() => ({ position: 0 }));

let player: AudioPlayer | null = null;
let lockScreen = false;
let holdUntil = 0;

const onStatus = (s: AudioStatus) => {
  const st = usePlayer.getState();
  const duration = s.duration > 0 ? s.duration : st.duration;
  if (st.playing !== s.playing || st.duration !== duration) usePlayer.setState({ playing: s.playing, duration });
  if (Date.now() > holdUntil) useProgress.setState({ position: s.currentTime });
  if (s.didJustFinish) next();
};

setAudioModeAsync({
  playsInSilentMode: true,
  shouldPlayInBackground: true,
  interruptionMode: 'doNotMix',
}).catch(() => {});

const ensure = () => {
  if (player) return player;
  player = createAudioPlayer(null, { updateInterval: 500 });
  player.addListener('playbackStatusUpdate', onStatus);
  return player;
};

export const play = (id: string) => {
  const track = useTracks.getState().tracks.find((t) => t.id === id);
  if (!track) return;
  const p = ensure();
  p.replace({ uri: trackFile(track).uri });
  p.play();
  usePlayer.setState({ currentId: id, playing: true, duration: 0 });
  useProgress.setState({ position: 0 });
  const meta = { title: track.title, artist: track.artist };
  if (lockScreen) p.updateLockScreenMetadata(meta);
  else {
    p.setActiveForLockScreen(true, meta);
    lockScreen = true;
  }
};

export const toggle = () => {
  const { currentId, playing } = usePlayer.getState();
  if (!currentId || !player) {
    const first = useTracks.getState().tracks[0];
    if (first) play(first.id);
    return;
  }
  if (playing) player.pause();
  else player.play();
  usePlayer.setState({ playing: !playing });
};

const step = (d: 1 | -1) => {
  const list = useTracks.getState().tracks;
  if (!list.length) return;
  const i = list.findIndex((t) => t.id === usePlayer.getState().currentId);
  play(list[(Math.max(i, d > 0 ? -1 : 0) + d + list.length) % list.length].id);
};

export const next = () => step(1);

export const previous = () => {
  if (player && useProgress.getState().position > 3) seek(0);
  else step(-1);
};

export const seek = (sec: number) => {
  if (!player) return;
  holdUntil = Date.now() + 800;
  useProgress.setState({ position: sec });
  player.seekTo(sec).catch(() => {});
};

export const stop = () => {
  if (!player) return;
  player.pause();
  if (lockScreen) player.clearLockScreenControls();
  lockScreen = false;
  usePlayer.setState({ currentId: null, playing: false, duration: 0 });
  useProgress.setState({ position: 0 });
};
