import MenuItem from '@carrier-io/fds-react/MenuItem';
import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';

import { SensorFieldValue } from '../../../../types';

import { FormSelect } from '@/components';

interface Option {
  key: string;
  value: string;
  title: string;
}

interface SensorLocationSelectProps {
  handleChangeSensorField: (value: SensorFieldValue, flespiKey: string, field: string) => void;
  disabled: boolean;
  options: Option[];
  dataField: string;
  sensorLocation: string;
  formKey: string;
}

export const SensorLocationSelect = ({
  sensorLocation,
  disabled,
  dataField,
  handleChangeSensorField,
  options,
  formKey,
}: SensorLocationSelectProps) => {
  const { t } = useTranslation();

  const menuItemsSx = { display: 'flex' };

  return (
    <FormSelect
      disabled={disabled}
      key={formKey}
      value={sensorLocation ?? ''}
      onChange={(event) => handleChangeSensorField(`${event.target.value}`, dataField, 'sensorLocation')}
      size="small"
      stylesSelect={{
        '& > .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
        },
      }}
      hideBackgroundColor
      disableUnderline
      fullWidth
    >
      <MenuItem key="NONE" value="NONE" sx={menuItemsSx}>
        <Typography variant="body2">{t('device.management.sensor.config.select-value')}</Typography>
      </MenuItem>
      {options.map((option) => (
        <MenuItem key={option.key} value={option.value} sx={menuItemsSx}>
          <Typography variant="body2">{option.title}</Typography>
        </MenuItem>
      ))}
    </FormSelect>
  );
};
