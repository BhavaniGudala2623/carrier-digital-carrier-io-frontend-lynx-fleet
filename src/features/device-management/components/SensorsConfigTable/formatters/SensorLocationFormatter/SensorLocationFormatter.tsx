import Typography from '@carrier-io/fds-react/Typography';
import { useTranslation } from 'react-i18next';
import { SxProps } from '@mui/material';

import { DoorSensorLocationValues, ParamsProps, SensorsConfigTableProps } from '../../../../types';

import { SensorLocationSelect } from './SensorLocationSelect';

import { temperatureSensorLocations } from '@/types';
import { getTemperatureSensorLocationTranslate } from '@/utils';

export type SensorLocationFormatterOptionsType = {
  editAllowed?: boolean;
  sx?: SxProps;
} & Pick<SensorsConfigTableProps, 'handleChangeSensorField' | 'isDoorSensor' | 'isTemperatureSensor'>;

const sensorDropdownValues = temperatureSensorLocations.filter((name) => !name.includes('DATACOLD'));

export const SensorLocationFormatter = (params: ParamsProps, options: SensorLocationFormatterOptionsType) => {
  const { t } = useTranslation();
  const {
    data: {
      dataField,
      sensorLocation: { sensorLocationTemp, sensorLocationDoor },
      datacold,
    },
  } = params;
  const { handleChangeSensorField, isDoorSensor, isTemperatureSensor, editAllowed } = options;

  const isDoorSensorSelected = isDoorSensor({ dataField });
  const isTemperatureSensorSelected = isTemperatureSensor({ dataField });
  let optionsSelector;
  let sensorLocation;
  let formKey;

  if (isDoorSensorSelected) {
    optionsSelector = [
      {
        key: DoorSensorLocationValues.SIDE,
        value: DoorSensorLocationValues.SIDE,
        title: t('device.management.sensor.config.door.side'),
      },
      {
        key: DoorSensorLocationValues.REAR,
        value: DoorSensorLocationValues.REAR,
        title: t('device.management.sensor.config.door.rear'),
      },
    ];
    sensorLocation = sensorLocationDoor;
    formKey = `${dataField}_location`;
  } else {
    optionsSelector = sensorDropdownValues.map((type) => ({
      key: type,
      value: datacold ? `${type}_DATACOLD` : type,
      title: getTemperatureSensorLocationTranslate(type, t),
    }));
    sensorLocation = sensorLocationTemp;
    formKey = `${dataField}type`;
  }

  return isDoorSensorSelected || isTemperatureSensorSelected ? (
    <SensorLocationSelect
      handleChangeSensorField={handleChangeSensorField}
      sensorLocation={sensorLocation}
      dataField={dataField}
      formKey={formKey}
      options={optionsSelector}
      disabled={!editAllowed}
    />
  ) : (
    <Typography variant="body2">-</Typography>
  );
};
