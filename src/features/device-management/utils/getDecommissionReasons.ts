import {
  BLUETOOTH_SENSOR_DECOMMISSION_REASON_EXPIRATION,
  BLUETOOTH_SENSOR_DECOMMISSION_REASON_MALFUNCTION,
  BLUETOOTH_SENSOR_DECOMMISSION_REASON_OTHER,
  BLUETOOTH_SENSOR_DECOMMISSION_REASON_SUBSCRIPTION_REDUCTION,
} from '@carrier-io/lynx-fleet-common';
import { t } from 'i18next';

export const getDecommissionReasons = () => {
  const reasons = {
    [BLUETOOTH_SENSOR_DECOMMISSION_REASON_EXPIRATION]: t(
      'device.management.bluetooth-sensors.sensors-table.decommission-reason.expiration'
    ),
    [BLUETOOTH_SENSOR_DECOMMISSION_REASON_MALFUNCTION]: t(
      'device.management.bluetooth-sensors.sensors-table.decommission-reason.malfunction'
    ),
    [BLUETOOTH_SENSOR_DECOMMISSION_REASON_SUBSCRIPTION_REDUCTION]: t(
      'device.management.bluetooth-sensors.sensors-table.decommission-reason.subscription-reduction'
    ),
    [BLUETOOTH_SENSOR_DECOMMISSION_REASON_OTHER]: t(
      'device.management.bluetooth-sensors.sensors-table.decommission-reason.other'
    ),
  };

  return reasons;
};
