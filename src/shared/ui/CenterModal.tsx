import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { type ReactNode, memo, useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../theme';
import { Tap } from './Tap';
import { Txt } from './Txt';

type Props = { title: string; children: ReactNode };

const close = () => router.back();

/** Dialog centred on screen; used with `presentation: 'transparentModal'` routes. */
export const CenterModal = memo(function CenterModal({ title, children }: Props) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(v, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 6 }).start();
  }, [v]);

  return (
    <View style={[s.root, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}>
      <Pressable style={[StyleSheet.absoluteFill, s.backdrop]} onPress={close} accessibilityLabel="Закрыть" />
      <Animated.View
        style={[
          s.card,
          {
            backgroundColor: t.dark ? '#151517' : t.bg,
            maxHeight: height - insets.top - insets.bottom - 32,
            opacity: v,
            transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }],
          },
        ]}
      >
        <View style={s.head}>
          <Txt v="h2">{title}</Txt>
          <Tap onPress={close} hitSlop={10} style={[s.close, { backgroundColor: t.cardAlt }]} accessibilityLabel="Закрыть">
            <Ionicons name="close" size={18} color={t.sub} />
          </Tap>
        </View>
        <ScrollView bounces={false} showsVerticalScrollIndicator={false} contentContainerStyle={s.body}>
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );
});

/** A titled block inside a CenterModal. */
export const ModalSection = memo(function ModalSection({ title, children }: { title: string; children: ReactNode }) {
  const t = useTheme();
  return (
    <View style={[s.section, { backgroundColor: t.dark ? '#222225' : '#FFFFFF' }]}>
      <Txt v="caption" style={s.sectionTitle}>
        {title.toUpperCase()}
      </Txt>
      {children}
    </View>
  );
});

const s = StyleSheet.create({
  root: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 },
  backdrop: { backgroundColor: 'rgba(0,0,0,0.45)' },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 32,
    paddingTop: 20,
    overflow: 'hidden',
    elevation: 24,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 12 },
  },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 14 },
  close: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  body: { paddingHorizontal: 14, paddingBottom: 14, gap: 12 },
  section: { borderRadius: 22, padding: 14, gap: 12 },
  sectionTitle: { letterSpacing: 0.6, marginLeft: 2 },
});
