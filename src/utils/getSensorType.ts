import { Maybe, Sensor } from '@carrier-io/lynx-fleet-types';

export const flespiKeysSensorLocation = [
  'sensor_temperature_1',
  'sensor_temperature_2',
  'sensor_temperature_3',
  'sensor_temperature_4',
  'sensor_temperature_5',
  'sensor_temperature_6',
  'freezer_datacold_sensor_temperature_1',
  'freezer_datacold_sensor_temperature_2',
  'freezer_datacold_sensor_temperature_3',
  'freezer_datacold_sensor_temperature_4',
  'freezer_datacold_sensor_temperature_5',
  'freezer_datacold_sensor_temperature_6',
  'bluetooth_sensor_temperature_1',
  'bluetooth_sensor_temperature_2',
  'bluetooth_sensor_temperature_3',
  'bluetooth_sensor_temperature_4',
  'bluetooth_sensor_temperature_5',
  'bluetooth_sensor_temperature_6',
];

const NONE = 'NONE';

const emptySensorType = (sensorType?: string | null) => !sensorType || sensorType === NONE;

export const getSensorType = (sensor: Maybe<Sensor>): string | undefined => {
  if (!sensor) {
    return undefined;
  }

  const { sensorType, sensorLocation, flespiKey } = sensor;

  if (!flespiKey || !flespiKeysSensorLocation.includes(flespiKey)) {
    return sensorType; // only for keys from flespiKeysSensorLocation sensorType is stored in sensorLocation
  }

  if (emptySensorType(sensorType) && emptySensorType(sensorLocation)) {
    return NONE; // not configured sensor.
  }
  if (sensorType && emptySensorType(sensorLocation)) {
    return sensorType; // old sensor, use 'sensorType' for logic
  }
  if (emptySensorType(sensorType) && sensorLocation) {
    return sensorLocation; // new configured sensor, use 'sensorLocation' for logic
  }
  if (sensorType && sensorLocation) {
    return sensorLocation; // old sensor, configured again, use 'sensorLocation' for logic
  }

  return undefined;
};
