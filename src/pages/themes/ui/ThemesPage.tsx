import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AccentPicker, ModePicker } from '@/features/theme-picker';
import { useTheme } from '@/shared/theme';
import { Txt } from '@/shared/ui';

export function ThemesPage() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.root, { backgroundColor: t.bg, paddingBottom: insets.bottom + 24 }]}>
      <Txt v="h2">Оформление</Txt>
      <View style={[s.card, { backgroundColor: t.card }]}>
        <Txt v="sub">Тема</Txt>
        <ModePicker />
      </View>
      <View style={[s.card, { backgroundColor: t.card }]}>
        <Txt v="sub">Цвет акцента</Txt>
        <AccentPicker />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { padding: 20, paddingTop: 28, gap: 14 },
  card: { borderRadius: 24, padding: 16, gap: 14 },
});
