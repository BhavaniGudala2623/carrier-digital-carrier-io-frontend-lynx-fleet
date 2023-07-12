import { useTranslation } from 'react-i18next';

import { BluetoothSensorMacIdDialogContent } from './BluetoothSensorMacIdDialogContent';

import { Dialog } from '@/components/Dialog';

interface Props {
  onClose: () => void;
  onChangeMacId: (macId) => void;
  macId: string;
  isLoading: boolean;
  macIdOptions: string[];
}
export const BluetoothSensorMacIdDialog = ({
  onClose,
  macId,
  onChangeMacId,
  isLoading,
  macIdOptions,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open
      dialogTitle={t('device.management.sensor.config.sensor-bluetooth-sensor-mac-id')}
      fullWidth
      contentSx={{ minHeight: '100%' }}
      styleContent={{ padding: '4px 8px 8px 24px' }}
      content={
        <BluetoothSensorMacIdDialogContent
          onClose={onClose}
          macIdValue={macId}
          onChangeMacId={onChangeMacId}
          isLoading={isLoading}
          macIdOptions={macIdOptions}
        />
      }
    />
  );
};
