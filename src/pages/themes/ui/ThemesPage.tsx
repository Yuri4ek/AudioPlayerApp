import { AccentPicker, BackgroundPicker, ModePicker } from '@/features/theme-picker';
import { CenterModal, ModalSection } from '@/shared/ui';

export function ThemesPage() {
  return (
    <CenterModal title="Оформление">
      <ModalSection title="Тема">
        <ModePicker />
      </ModalSection>
      <ModalSection title="Цвет акцента">
        <AccentPicker />
      </ModalSection>
      <ModalSection title="Фон">
        <BackgroundPicker />
      </ModalSection>
    </CenterModal>
  );
}
