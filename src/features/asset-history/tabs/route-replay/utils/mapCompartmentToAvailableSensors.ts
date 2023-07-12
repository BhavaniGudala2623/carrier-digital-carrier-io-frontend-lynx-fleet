import { Sensor } from '@carrier-io/lynx-fleet-types';

import { ConfiguredDeviceSensorsFields } from '../types';

import { getSensorFlespiKey } from '@/utils';

type AvailableSensorsToCompartment = Record<number, ConfiguredDeviceSensorsFields>;

export const mapCompartmentToAvailableSensors = (
  availableSensors: Sensor[]
): AvailableSensorsToCompartment => {
  let compartmentToSensorFlespiFields = {} as AvailableSensorsToCompartment;

  availableSensors.forEach((sensor: Sensor) => {
    const compartment = [1, 2, 3].find((comp) => sensor.sensorLocation?.includes(comp.toString()));

    if (!compartment) {
      return;
    }

    const flespiKey = getSensorFlespiKey(sensor.flespiKey, sensor.sensorType);

    compartmentToSensorFlespiFields = {
      ...compartmentToSensorFlespiFields,
      [compartment.toString()]: [...(compartmentToSensorFlespiFields?.[compartment] || []), flespiKey],
    };
  }, {} as Record<number, ConfiguredDeviceSensorsFields>);

  return compartmentToSensorFlespiFields;
};
