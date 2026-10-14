export type RouteType = 'speaker' | 'wired' | 'usb' | 'bluetooth' | 'airplay';

export type AudioRoute = { type: RouteType; name: string; id?: number };

export type AudioOutput = { id: number; type: RouteType; name: string };

export type RemoteAction = 'next' | 'previous' | 'play';

export type TrackMeta = {
  title?: string | null;
  artist?: string | null;
  album?: string | null;
  art: boolean;
  lyrics?: string | null;
};

export type HeadsetModuleEvents = {
  onRouteChange: (route: AudioRoute) => void;
  onRemote: (e: { action: RemoteAction }) => void;
  onNoisy: () => void;
};
