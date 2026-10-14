import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { refreshLockScreen, usePlayer } from '@/entities/player';
import { scanPending, useTracks } from '@/entities/track';
import { useHeadsetControls } from '@/features/headset-controls';
import { useTheme } from '@/shared/theme';
import { Backdrop } from '@/shared/ui';

const TRANSPARENT = { backgroundColor: 'transparent' };

// When tags of the playing track are read, show the new title/artwork on the lock screen.
useTracks.subscribe((s, prev) => {
  const id = usePlayer.getState().currentId;
  if (id && s.tracks.find((x) => x.id === id) !== prev.tracks.find((x) => x.id === id)) refreshLockScreen();
});

export default function RootLayout() {
  const t = useTheme();
  useHeadsetControls();
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(t.bg).catch(() => {});
  }, [t.bg]);
  useEffect(() => {
    // Read tags/artwork/lyrics of tracks imported earlier, without competing with the first render.
    const task = requestIdleCallback(() => scanPending());
    return () => cancelIdleCallback(task);
  }, []);
  return (
    <SafeAreaProvider>
      <View style={[s.root, { backgroundColor: t.bg }]}>
        <Backdrop />
        <StatusBar style={t.dark ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false, contentStyle: TRANSPARENT }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="player" options={{ presentation: 'modal', contentStyle: { backgroundColor: t.bg } }} />
          <Stack.Screen name="lyrics" options={{ presentation: 'modal', contentStyle: { backgroundColor: t.bg } }} />
          <Stack.Screen name="themes" options={{ presentation: 'transparentModal', animation: 'fade' }} />
          <Stack.Screen name="output" options={{ presentation: 'transparentModal', animation: 'fade' }} />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
});
