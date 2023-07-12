import { ChangeEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import FormControl from '@carrier-io/fds-react/FormControl';
import InputAdornment from '@carrier-io/fds-react/InputAdornment';
import Input from '@carrier-io/fds-react/Input';
import MenuItem from '@carrier-io/fds-react/MenuItem';
import Select from '@carrier-io/fds-react/Select';
import TextField from '@carrier-io/fds-react/TextField';
import Box from '@carrier-io/fds-react/Box';
import { DeviceFilterField, BluetoothSensorField } from '@carrier-io/lynx-fleet-types';
import InputLabel from '@carrier-io/fds-react/InputLabel';

import { useTabsState } from '../providers';

import { SelectChangeEvent } from '@/types';
import { SearchIcon } from '@/components';

interface DeviceProvisioningControlsProps {
  onFilterFieldChange: (value: DeviceFilterField) => void;
  onFilterValueChange: (value: string) => void;
  searchField: DeviceFilterField | BluetoothSensorField;
}

export const DeviceProvisioningControls = ({
  searchField,
  onFilterFieldChange,
  onFilterValueChange,
}: DeviceProvisioningControlsProps) => {
  const { t } = useTranslation();
  const { selectedTabId } = useTabsState();

  const filterFieldToTranslation = useMemo<Record<DeviceFilterField, string> | Record<'macId', string>>(
    () =>
      selectedTabId === 'DEVICES'
        ? {
            assetName: t('assets.management.asset-name'),
            imei: t('device.management.device.info.device-IMEI-number'),
            serialNumber: t('device.management.device.provisioning.serial'),
            iccid: t('device.management.device.info.device-ICCID'),
            truSerialNumber: t('common.tru-serial-number'),
          }
        : {
            macId: t('device.management.bluetooth-sensors.sensors-table.mac-id'),
          },
    [t, selectedTabId]
  );

  const handleFilterFieldChange = (event: SelectChangeEvent<unknown>) => {
    const { value = '' } = event.target;

    onFilterFieldChange(value as DeviceFilterField);
  };

  const handleFilterValueChange = (e: ChangeEvent<{ name?: string; value: string }>) => {
    onFilterValueChange(e.target.value);
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="flex-end">
      <Box display="flex" alignItems="flex-end">
        <FormControl
          sx={{
            minWidth: 220,
            mr: 2,
          }}
          variant="filled"
        >
          <InputLabel>{t('device.management.device.provisioning.search-by')}</InputLabel>
          <Select
            input={<Input sx={{ minWidth: 220 }} />}
            value={searchField}
            onChange={handleFilterFieldChange}
            size="small"
          >
            {Object.entries(filterFieldToTranslation).map(([field, translation]) => (
              <MenuItem value={field} key={field}>
                {t(translation)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          placeholder={t('device.management.device.provisioning.search-devices')}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          defaultValue=""
          size="small"
          onChange={handleFilterValueChange}
          style={{
            width: 300,
            marginRight: 8,
          }}
        />
      </Box>
    </Box>
  );
};
