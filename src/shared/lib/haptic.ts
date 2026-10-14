import * as Haptics from 'expo-haptics';

export const haptic = () => {
  Haptics.selectionAsync().catch(() => {});
};
