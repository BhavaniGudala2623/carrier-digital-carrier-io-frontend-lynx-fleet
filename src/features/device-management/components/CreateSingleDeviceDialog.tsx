import { useTranslation } from 'react-i18next';

import { AddOneDevice } from './AddOneDevice';

import { Dialog } from '@/components';

interface CreateSingleDeviceDialogProps {
  onClose: () => void;
}

export const CreateSingleDeviceDialog = ({ onClose }: CreateSingleDeviceDialogProps) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="sm"
      dialogTitle={t('device.management.drawer.create-device-title')}
      fullWidth
      content={<AddOneDevice onClose={onClose} />}
    />
  );
};
