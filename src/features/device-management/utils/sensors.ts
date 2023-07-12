import { sensorFlespiKeys, sensorTemperatureIds } from '@carrier-io/lynx-fleet-common';
import {
  FlespiData,
  SnapshotDataGql,
  Device,
  Maybe,
  SensorInputData,
  SensorLocationType,
  DeviceSensorType,
  UpdateDeviceInput,
} from '@carrier-io/lynx-fleet-types';
import { TFunction } from 'i18next';
import { isEmpty } from 'lodash-es';

import {
  ConnectionLocations,
  DoorSensorLocationValues,
  SensorConnectionLocationType,
  SensorType,
  SensorsConfig,
} from '../types';

export const indexDeviceSensors = (sensors: SensorType[] = []) =>
  sensors.reduce(
    (res: SensorsConfig, { __typename, sensorData, ...sensor }: SensorType) => ({
      ...res,
      [sensor.flespiKey!]: {
        ...sensor,
        dataField: sensor.flespiKey!,
      },
    }),
    {}
  );

export const getPreparedSensors = (
  config: SensorsConfig,
  includeDatacoldSensors: boolean
): UpdateDeviceInput['sensors'] =>
  Object.entries(config)
    .filter(([, { flespiKey }]) => includeDatacoldSensors || !flespiKey?.includes('datacold'))
    .map(
      // @ts-ignore
      ([key, item]): SensorInputData => ({
        compatibleWithEN12830: item.compatibleWithEN12830,
        configured: Boolean(item.configured),
        connectionLocation: item.connectionLocation ?? DoorSensorLocationValues.NONE,
        flespiKey: item.flespiKey ?? key,
        installed: item.installed,
        sensorId: item.sensorId,
        sensorLocation: item.sensorLocation as SensorLocationType,
        sensorType: item.sensorType as DeviceSensorType,
        macId: item.macId,
      })
    );

export const isFuelLevelSensor = (sensor: Pick<SensorType, 'dataField'>) =>
  sensor.dataField === 'freezer_fuel_level' || sensor.dataField === 'plugin_fuel_level';

export const isDoorSensor = (sensor: Pick<SensorType, 'dataField'>) =>
  sensor.dataField.startsWith('plugin_door_closed') || sensor.dataField.startsWith('freezer_datacold_din');

export const isTemperatureSensor = (sensor: Pick<SensorType, 'dataField'>) =>
  sensor.dataField.includes('temperature');

export const isTemperatureSensor1WireBLE = (
  dataField: SensorType['dataField'],
  idField?: SensorType['idField']
) => Boolean(dataField.includes('temperature') && idField?.includes('onewire_sensor'));

export const isIgnitionInput = (sensor: Pick<SensorType, 'dataField'>) =>
  sensor.dataField === 'engine_ignition_status' || sensor.dataField === 'din_4';

export const getSensorConnectionLocation = (
  dataField: string,
  connectionLocation?: SensorConnectionLocationType
) => {
  if (isFuelLevelSensor({ dataField })) {
    return dataField === 'freezer_fuel_level'
      ? ConnectionLocations.TRU_CONTROLLER
      : ConnectionLocations.TELEMATICS_DEVICE;
  }

  // hardcoded per LYNXFLT-5722
  if (isDoorSensor({ dataField })) {
    return ConnectionLocations.TELEMATICS_DEVICE;
  }

  return connectionLocation;
};

export const mapConfigAndDeviceSensors = (
  initialSensors: SensorsConfig,
  indexedDeviceSensors: SensorsConfig
) =>
  Object.keys(initialSensors).reduce((acc: SensorsConfig, flespiKey: string) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { __typename, ...sensor } = initialSensors[flespiKey];
    if (!isEmpty(indexedDeviceSensors[flespiKey])) {
      acc[flespiKey] = initialSensors[flespiKey].touched
        ? initialSensors[flespiKey]
        : {
            ...indexedDeviceSensors[flespiKey],
            touched: false,
          };
    } else {
      acc[flespiKey] = sensor;
    }

    acc[flespiKey].connectionLocation = getSensorConnectionLocation(
      flespiKey,
      acc[flespiKey].connectionLocation
    );

    return acc;
  }, {});

export const isIncludeDatacoldSensors = (config: SensorsConfig) =>
  Object.values(config).some((sensor) => sensor.configured && sensor.flespiKey?.includes('datacold'));

export const prepareDin4TypeSensors = (
  config: SensorsConfig,
  isDin4Config?: boolean,
  isTRSConfig?: boolean
): SensorsConfig => ({
  ...config,
  din_4: {
    ...config.din_4,
    configured: !!isTRSConfig,
  },
  engine_ignition_status: {
    ...config.engine_ignition_status,
    configured: isDin4Config ? config.engine_ignition_status.configured : false,
  },
  plugin_door_closed_4: {
    ...config.plugin_door_closed_4,
    configured: !isDin4Config ? config.plugin_door_closed_4.configured : false,
  },
});

export function getSensors(t: TFunction) {
  const sensors: SensorType[] = [
    {
      value: 'AIN4',
      dataField: 'plugin_fuel_level',
      display: t('device.management.asset.configuration.plugin-fuel-level'),
      fixed: true,
    },
    {
      value: 'AIN4',
      dataField: 'freezer_fuel_level',
      display: t('device.management.asset.configuration.freezer-fuel-level'),
      fixed: true,
    },
    {
      value: 'DIN1',
      dataField: 'plugin_door_closed_1',
      display: `${t('notifications.door')} 1`,
      fixed: true,
    },
    {
      value: 'DIN2',
      dataField: 'plugin_door_closed_2',
      display: `${t('notifications.door')} 2`,
      fixed: true,
    },
    {
      value: 'DIN3',
      dataField: 'plugin_door_closed_3',
      display: `${t('notifications.door')} 3`,
      fixed: true,
    },
    {
      value: 'DIN4',
      dataField: 'engine_ignition_status',
      display: t('device.management.sensor.config.ignition-input'),
      fixed: false,
    },
    {
      value: 'DIN4',
      dataField: 'din_4',
      display: t('device.management.sensor.config.ignition-input'),
      fixed: false,
    },
    {
      value: 'DIN4',
      dataField: 'plugin_door_closed_4',
      display: `${t('notifications.door')} 4`,
      fixed: true,
    },
    {
      dataField: 'sensor_temperature_1',
      idField: 'onewire_sensor_serial_1',
      display: `${t('common.temperature')} 1`,
      fixed: false,
    },
    {
      dataField: 'sensor_temperature_2',
      idField: 'onewire_sensor_serial_2',
      display: `${t('common.temperature')} 2`,
      fixed: false,
    },
    {
      dataField: 'sensor_temperature_3',
      idField: 'onewire_sensor_serial_3',
      display: `${t('common.temperature')} 3`,
      fixed: false,
    },
    {
      dataField: 'sensor_temperature_4',
      idField: 'onewire_sensor_serial_4',
      display: `${t('common.temperature')} 4`,
      fixed: false,
    },
    {
      dataField: 'sensor_temperature_5',
      idField: 'onewire_sensor_serial_5',
      display: `${t('common.temperature')} 5`,
      fixed: false,
    },
    {
      dataField: 'sensor_temperature_6',
      idField: 'onewire_sensor_serial_6',
      display: `${t('common.temperature')} 6`,
      fixed: false,
    },
  ];

  return sensors;
}

export const getResetSensors = () => {
  const resetSensors = sensorFlespiKeys.reduce((prev, curr) => {
    // eslint-disable-next-line no-param-reassign
    prev[curr] = null;

    return prev;
  }, {} as Record<string, unknown>);

  sensorTemperatureIds.forEach((id) => {
    resetSensors[id] = null;
  });

  return resetSensors;
};

export const getDatacoldSensors = (t: TFunction): SensorType[] => {
  const freezerDatacoldSensors = Array.from({ length: 7 }, (_x, i) => i)
    .slice(1)
    .map((v) => ({
      dataField: `freezer_datacold_sensor_temperature_${v}`,
      display: `Datacold ${t('device.management.sensor.config.temperature-sensor')} ${v}`,
      datacold: true,
    }));

  const digitalDatacoldSensors = Array.from({ length: 5 }, (_x, i) => i)
    .slice(1)
    .map((v) => ({
      value: `DIN${v}_DATACOLD`,
      displayValue: `DIN${v}`,
      dataField: `freezer_datacold_din_${v}`,
      display: `Datacold ${t('device.management.sensor.config.digital-sensor')} ${v}`,
      datacold: true,
      fixed: true,
    }));

  const analogDatacoldSensors = Array.from({ length: 4 }, (_x, i) => i)
    .slice(1)
    .map((v) => ({
      value: `AIN${v}`,
      dataField: `freezer_datacold_ain_${v}`,
      display: `Datacold ${t('device.management.sensor.config.analog-sensor')} ${v}`,
      datacold: true,
      fixed: true,
    }));

  return freezerDatacoldSensors.concat(digitalDatacoldSensors, analogDatacoldSensors);
};

export const getInitialSensorValues = (
  t: TFunction,
  flespiData: SnapshotDataGql['flespiData'],
  device?: Maybe<Device>
) => {
  const extractSensorId = (idField?: string | null) =>
    idField ? flespiData?.[idField as keyof Partial<FlespiData>] : null;

  const allSensors = [...getSensors(t), ...getDatacoldSensors(t)].reduce(
    (res, sensor) => ({
      ...res,
      [sensor.dataField]: {
        sensorType: sensor.value ?? DoorSensorLocationValues.NONE,
        flespiKey: sensor.dataField,
        configured: false,
        connectionLocation: getSensorConnectionLocation(
          sensor.dataField,
          ConnectionLocations.TELEMATICS_DEVICE
        ),
        sensorLocation: sensor.location ?? DoorSensorLocationValues.NONE,
        dataField: sensor.dataField,
        sensorId: extractSensorId(sensor?.idField) as string,
        installed: sensor?.installed || null,
        lastUpdated: sensor?.lastUpdated || null,
        compatibleWithEN12830: sensor?.compatibleWithEN12830 || null,
        touched: false,
      },
    }),
    {} as SensorsConfig
  );

  const indexedDeviceSensors = indexDeviceSensors((device?.sensors as SensorType[]) ?? []);

  return isEmpty(indexedDeviceSensors)
    ? allSensors
    : mapConfigAndDeviceSensors(allSensors, indexedDeviceSensors);
};
