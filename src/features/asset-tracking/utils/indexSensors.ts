import { SnapshotDataGql, Alert, Maybe } from '@carrier-io/lynx-fleet-types';
import { omit } from 'lodash-es';

import { DeviceSensors, SnapshotDataEx } from '@/features/common';
import { hasOwnProperty } from '@/utils';
import { doorSensorTypes } from '@/constants/doorSensorTypes';

/** ****************************
 * indexSensors
 *
 * TODO: refactor the algorithm after running DB migration script to move sensorType to sensorLocation in the prod.
 *
 * Filters out unconfigured sensors, and turns the rest into the following structure -
 *  sensors: {
 *      ${sensorType}: {
 *          ${sensorLocation}: ${sensorData} - format for datacold DIN sensors
 *      }
 *      ${sensorType}: ${sensorData} - format for all other sensor types
 *  }
 */
export const indexSensors = (snapshot: Maybe<SnapshotDataGql>): SnapshotDataEx => {
  if (!snapshot?.device?.sensors || snapshot.device.sensors.length === 0) {
    return { ...omit(snapshot, 'device'), device: { ...omit(snapshot?.device, 'sensors') } };
  }

  const newAlerts: Alert[] = [];
  Object.assign(newAlerts, snapshot.alerts);
  const newFlespiData = { ...snapshot.flespiData };
  const indexedSensors: DeviceSensors = {
    pluginFuelLevelConfigured: false,
    freezerFuelLevelConfigured: false,
    sideDoorConfigured: false,
    rearDoorConfigured: false,
  };

  /* eslint-disable-next-line */
  for (const sensor of snapshot.device.sensors) {
    if (sensor?.configured) {
      let data;
      data = sensor.sensorData;
      if (sensor.sensorLocation && sensor.sensorLocation !== 'NONE') {
        if (doorSensorTypes.includes(sensor.sensorType)) {
          data = null;
          let alarmString = '';
          if (sensor.sensorLocation === 'SIDE') {
            alarmString = 'sideDoor';
            indexedSensors.sideDoorConfigured = true;
          } else if (sensor.sensorLocation === 'REAR') {
            alarmString = 'rearDoor';
            indexedSensors.rearDoorConfigured = true;
          }

          if (alarmString && snapshot.alerts) {
            newAlerts.forEach((alert, index) => {
              if (alert.type === 'DOOR_OPEN') {
                if (alert.triggers?.includes(sensor.flespiKey)) {
                  newAlerts[index] = {
                    ...newAlerts[index],
                    triggers: [...alert.triggers, alarmString],
                  };
                }
              }
            });
          }
        } else {
          data = {
            [sensor.sensorLocation]: sensor.sensorData,
          };
          if (sensor.sensorType === 'BT_EN12830') {
            indexedSensors[`${sensor.sensorLocation}_BT`] = sensor.sensorData;
          } else {
            indexedSensors[sensor.sensorLocation] = sensor.sensorData;
          }
        }
      } else if (sensor.flespiKey === 'plugin_fuel_level') {
        indexedSensors.pluginFuelLevelConfigured = true;
        indexedSensors.pluginFuelLevel = sensor.sensorData;
      } else if (sensor.flespiKey === 'freezer_fuel_level') {
        indexedSensors.freezerFuelLevelConfigured = true;
        indexedSensors.freezerFuelLevel = sensor.sensorData;
      }
      indexedSensors[sensor.sensorType] = data;

      if (
        sensor.sensorData &&
        sensor.flespiKey.includes('sensor_temperature') &&
        hasOwnProperty(newFlespiData, sensor.flespiKey)
      ) {
        delete newFlespiData[sensor.flespiKey];
      }
    }
  }

  return {
    ...snapshot,
    flespiData: newFlespiData,
    alerts: newAlerts,
    device: {
      ...snapshot.device,
      sensors: indexedSensors,
    },
  };
};
