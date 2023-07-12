import { Maybe, Sensor } from '@carrier-io/lynx-fleet-types';

import { flespiKeysSensorLocation, getSensorFlespiKey, getSensorType } from '@/utils';

const compartments = [1, 2, 3];

export function getConfiguredFlespiFields(
  sensors: Maybe<Sensor[]> | undefined,
  configuredCompartmentNumbers: number[],
  isFeatureBluetoothSensorsManagementEnabled: boolean
): string[] {
  const configuredTemperatureFields: string[] = [];

  if (configuredCompartmentNumbers.includes(1)) {
    configuredTemperatureFields.push(
      ...[
        'freezer_zone1_temperature_setpoint',
        'freezer_zone1_supply_air_temperature',
        'freezer_zone1_return_air_temperature',
      ]
    );
  }

  if (configuredCompartmentNumbers.includes(2)) {
    configuredTemperatureFields.push(
      ...[
        'freezer_zone2_temperature_setpoint',
        'freezer_zone2_supply_air_temperature',
        'freezer_zone2_return_air_temperature',
      ]
    );
  }

  if (configuredCompartmentNumbers.includes(3)) {
    configuredTemperatureFields.push(
      ...[
        'freezer_zone3_temperature_setpoint',
        'freezer_zone3_supply_air_temperature',
        'freezer_zone3_return_air_temperature',
      ]
    );
  }

  const configuredSensorFields = flespiKeysSensorLocation.filter((flespiKey) => {
    const sensorData =
      sensors?.find((sensor) => getSensorFlespiKey(sensor.flespiKey, sensor.sensorType) === flespiKey) ||
      null;

    if (!isFeatureBluetoothSensorsManagementEnabled && sensorData?.sensorType === 'BT_EN12830') {
      // remove bluetooth fields if REACT_APP_FEATURE_BLUETOOTH_SENSORS_MANAGEMENT feature flag not enabled
      return false;
    }

    const compartment = compartments.find((comp) => sensorData?.sensorLocation?.includes(comp.toString()));

    if (!compartment || !sensorData || !configuredCompartmentNumbers.includes(compartment)) {
      return false;
    }

    return !!getSensorType(sensorData);
  });

  return [...configuredSensorFields, ...configuredTemperatureFields, 'position_speed'];
}
