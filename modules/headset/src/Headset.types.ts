export type RouteType = 'speaker' | 'wired' | 'usb' | 'bluetooth' | 'airplay';

export type AudioRoute = { type: RouteType; name: string };

export type RemoteAction = 'next' | 'previous';

export type HeadsetModuleEvents = {
  onRouteChange: (route: AudioRoute) => void;
  onRemote: (e: { action: RemoteAction }) => void;
};
