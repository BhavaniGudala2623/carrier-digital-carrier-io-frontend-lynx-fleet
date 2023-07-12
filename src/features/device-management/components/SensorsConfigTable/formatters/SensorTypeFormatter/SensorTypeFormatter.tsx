import Typography from '@carrier-io/fds-react/Typography';

import { ParamsProps, SensorTypeFormatterOptionsType } from '../../../../types';
import { sensorTypes } from '../../constants';

export const SensorTypeFormatter = (params: ParamsProps, options: SensorTypeFormatterOptionsType) => {
  const {
    data: { dataField, sensorType, idField, macId },
  } = params;
  const { BT_EN12830, ONE_WIRE } = sensorTypes;
  const { isTemperatureSensor1WireBLE } = options;
  const isTemperatureWirelessSensorData = isTemperatureSensor1WireBLE?.(dataField, idField);
  let typeText;

  if (isTemperatureWirelessSensorData) {
    typeText = macId ? BT_EN12830.name : ONE_WIRE.name;
  } else {
    typeText = sensorType && sensorType !== 'NONE' ? sensorType : '-';
  }

  return <Typography variant="body2">{typeText}</Typography>;
};
