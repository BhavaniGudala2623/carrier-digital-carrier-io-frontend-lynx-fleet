import Switch from '@carrier-io/fds-react/Switch';
import Box from '@carrier-io/fds-react/Box';
import { SxProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { ParamsProps, SensorsConfigTableProps } from '../../../types';
import { sensorTypes } from '../constants';

import { useAppDispatch } from '@/stores';
import { showMessage } from '@/stores/actions';

type ConfirmationFormatterOptionsType = {
  editAllowed?: boolean;
  sx?: SxProps;
} & Pick<
  SensorsConfigTableProps,
  | 'handleChangeConfigured'
  | 'toggleFuelLevelConfiguration'
  | 'isFuelLevelSensor'
  | 'isTemperatureSensor1WireBLE'
>;

export const ConfirmationFormatter = (params: ParamsProps, options: ConfirmationFormatterOptionsType) => {
  const {
    data: {
      dataField,
      idField,
      configured: { value, isDisabled },
      display,
      macId,
      sensorType,
      sensorLocation: { sensorLocationTemp, sensorLocationDoor },
    },
  } = params;
  const {
    isFuelLevelSensor,
    handleChangeConfigured,
    toggleFuelLevelConfiguration,
    editAllowed,
    sx,
    isTemperatureSensor1WireBLE,
  } = options;
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  let sensorLocationValue;
  let sensorTypeValue;

  const handleChange = (event) => {
    if (!isFuelLevelSensor({ dataField })) {
      handleChangeConfigured(event.target.checked, dataField);

      const isTempWirelessSensor = isTemperatureSensor1WireBLE?.(dataField, idField);
      sensorTypeValue = isTempWirelessSensor ? sensorTypes[sensorType]?.name : sensorType;
      sensorLocationValue = isTempWirelessSensor ? sensorLocationTemp : sensorLocationDoor;
    } else {
      toggleFuelLevelConfiguration(event.target.checked, dataField);
      sensorLocationValue = '';
      sensorTypeValue = sensorType;
    }

    if (event.target.checked) {
      showMessage(
        dispatch,
        `${t('device.management.bluetooth-sensors.sensors-table.installation-complete', {
          sensorName: display,
          sensorType: sensorTypeValue ?? '',
          sensorLocation: sensorLocationValue,
          macId,
        })}`
      );
    }
  };

  return (
    <Box sx={{ ...sx }}>
      <Switch
        size="small"
        key={`${dataField}configured`}
        disabled={isDisabled || !editAllowed}
        checked={value}
        onChange={handleChange}
      />
    </Box>
  );
};
