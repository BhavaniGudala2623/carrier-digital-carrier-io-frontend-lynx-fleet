import { AssetDetails, Sensor } from '@carrier-io/lynx-fleet-types';

import { ConfiguredDeviceSensorsFields, RouteHistoryDefaultColIds } from '../types';

import { getSensorTranslationKey } from './getSensorTranslationKey';

import { TemperatureSensorLocationType, TimelineHeaderDef } from '@/types';
import { getSensorFlespiKey } from '@/utils';

export const getSensorColumnsConfig = (
  configuredFlespiFields: string[],
  deviceSensors?: AssetDetails['sensors']
) => {
  const availableSensors =
    deviceSensors?.filter((sensor) => {
      const field = getSensorFlespiKey(sensor.flespiKey, sensor.sensorType);

      return configuredFlespiFields.includes(field);
    }) || [];

  let sensorColumnsConfig = {} as Record<RouteHistoryDefaultColIds, TimelineHeaderDef>;

  availableSensors.forEach((sensor: Sensor) => {
    const name = getSensorTranslationKey(
      sensor.sensorLocation as TemperatureSensorLocationType,
      sensor.sensorType
    );

    const compartment = [1, 2, 3].find((comp) => sensor.sensorLocation?.includes(comp.toString()));

    if (!compartment) {
      return;
    }

    const field = getSensorFlespiKey(sensor.flespiKey, sensor.sensorType);

    sensorColumnsConfig = {
      ...(sensorColumnsConfig || {}),
      [field]: {
        titleKey: `C${compartment}`,
        subTitleKey: name,
        isTemperature: true,
      },
    };
  }, {} as Record<number, ConfiguredDeviceSensorsFields>);

  return sensorColumnsConfig;
};
