import { OutputActions, OutputList } from '@/features/output-picker';
import { CenterModal, ModalSection } from '@/shared/ui';

export function OutputPage() {
  return (
    <CenterModal title="Аудиовыход">
      <ModalSection title="Воспроизводить через">
        <OutputList />
      </ModalSection>
      <ModalSection title="Ещё">
        <OutputActions />
      </ModalSection>
    </CenterModal>
  );
}
