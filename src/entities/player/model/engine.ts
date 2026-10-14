import { type AudioPlayer, type AudioStatus, createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import { create } from 'zustand';

import { artUri, trackFile, useTracks } from '@/entities/track/@x/player';

type PlayerState = { currentId: string | null; playing: boolean; duration: number };

export const usePlayer = create<PlayerState>()(() => ({ currentId: null, playing: false, duration: 0 }));
export const useProgress = create<{ position: number }>()(() => ({ position: 0 }));

/** App volume 0..1; every launch starts at 50%. */
export const DEFAULT_VOLUME = 0.5;
export const useVolume = create<{ volume: number }>()(() => ({ volume: DEFAULT_VOLUME }));

let player: AudioPlayer | null = null;
let lockScreen = false;
let holdUntil = 0;
const created = new Set<(p: AudioPlayer) => void>();

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
  player.volume = useVolume.getState().volume;
  player.addListener('playbackStatusUpdate', onStatus);
  created.forEach((cb) => cb(player!));
  return player;
};

/** The underlying player, if one exists yet. */
export const getAudioPlayer = () => player;

/** Runs `cb` with the player now (if created) and whenever it gets created. */
export const onAudioPlayer = (cb: (p: AudioPlayer) => void) => {
  created.add(cb);
  if (player) cb(player);
  return () => void created.delete(cb);
};

const lockScreenMeta = (id: string) => {
  const track = useTracks.getState().tracks.find((t) => t.id === id);
  return track ? { title: track.title, artist: track.artist, artworkUrl: artUri(track) } : null;
};

export const play = (id: string) => {
  const track = useTracks.getState().tracks.find((t) => t.id === id);
  if (!track) return;
  const p = ensure();
  p.replace({ uri: trackFile(track).uri });
  p.play();
  usePlayer.setState({ currentId: id, playing: true, duration: 0 });
  useProgress.setState({ position: 0 });
  const meta = lockScreenMeta(id)!;
  if (lockScreen) p.updateLockScreenMetadata(meta);
  else {
    p.setActiveForLockScreen(true, meta);
    lockScreen = true;
  }
};

/** Refreshes title/artist/artwork on the lock screen after tags were read. */
export const refreshLockScreen = () => {
  const { currentId } = usePlayer.getState();
  const meta = currentId && lockScreenMeta(currentId);
  if (player && lockScreen && meta) player.updateLockScreenMetadata(meta);
};

export const resume = () => {
  const { currentId } = usePlayer.getState();
  if (!currentId || !player) {
    const first = useTracks.getState().tracks[0];
    if (first) play(first.id);
    return;
  }
  player.play();
  usePlayer.setState({ playing: true });
};

export const pause = () => {
  if (!player) return;
  player.pause();
  usePlayer.setState({ playing: false });
};

export const toggle = () => (usePlayer.getState().playing ? pause() : resume());

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

export const setVolume = (v: number) => {
  const volume = Math.max(0, Math.min(1, v));
  useVolume.setState({ volume });
  if (player) player.volume = volume;
};

export const stop = () => {
  if (!player) return;
  player.pause();
  if (lockScreen) player.clearLockScreenControls();
  lockScreen = false;
  usePlayer.setState({ currentId: null, playing: false, duration: 0 });
  useProgress.setState({ position: 0 });
};
