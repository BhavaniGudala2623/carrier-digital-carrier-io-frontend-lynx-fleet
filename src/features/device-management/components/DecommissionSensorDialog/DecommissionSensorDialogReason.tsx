import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getDecommissionReasons } from '../../utils/getDecommissionReasons';

import { FormSelect } from '@/components/FormSelect';
import { SelectChangeEvent } from '@/types';

export interface DecommissionSensorDialogReasonProps {
  onChange: (value: string) => void;
}

export const DecommissionSensorDialogReason = ({ onChange }: DecommissionSensorDialogReasonProps) => {
  const { t } = useTranslation();
  const [selectedReason, setSelectedReason] = useState<string>('');

  const reasons = getDecommissionReasons();

  const handleOnChange = (event: SelectChangeEvent<unknown>) => {
    const { value = '' } = event.target;
    setSelectedReason(value as string);
    onChange(value as string);
  };

  return (
    <FormSelect
      sx={{ display: 'flex', justifyContent: 'flex-start', height: 48, width: 267 }}
      dictionary={reasons}
      value={selectedReason}
      label={t('device.management.bluetooth-sensors.sensors-table.decommission-reason.select-placeholder')}
      name="selectReason"
      onChange={handleOnChange}
      options={Object.keys(reasons)}
      required
      stylesFormControl={{ mt: '26px' }}
      stylesInputLabel={{ fontSize: 'small' }}
      stylesMenuItem={{ whiteSpace: 'normal', pl: 1, fontSize: '14px' }}
      stylesMenu={{ width: 267 }}
    />
  );
};
