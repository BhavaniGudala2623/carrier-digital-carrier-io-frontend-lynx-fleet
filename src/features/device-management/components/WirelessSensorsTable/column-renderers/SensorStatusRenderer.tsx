import { useTranslation } from 'react-i18next';
import { Chip } from '@carrier-io/fds-react';
import { TFunction } from 'i18next';
import { BluetoothSensorsStatusType } from '@carrier-io/lynx-fleet-types';

import { WirelessSensorsTableParams } from '../../../types';

const deviceStatusToColorClass: Record<BluetoothSensorsStatusType, 'success' | 'error' | 'secondary'> = {
  COMMISSIONED: 'success',
  DECOMMISSIONED: 'error',
  INBOUND: 'secondary',
  SHIPPED: 'secondary', // TODO fix color
};

const SENSOR_STATUS_TO_TRANSLATION: Record<BluetoothSensorsStatusType, string> = {
  COMMISSIONED: 'device.management.bluetooth-sensors.sensors-table.status.commissioned',
  DECOMMISSIONED: 'device.management.bluetooth-sensors.sensors-table.status.decommissioned',
  INBOUND: 'device.management.bluetooth-sensors.sensors-table.status.inbound',
  SHIPPED: 'device.management.bluetooth-sensors.sensors-table.status.shipped',
};

const translateStatus = (status: BluetoothSensorsStatusType, t: TFunction) =>
  t(SENSOR_STATUS_TO_TRANSLATION[status]);

export const SensorStatusRenderer = ({ data }: WirelessSensorsTableParams) => {
  const { t } = useTranslation();
  const status = data?.status;

  if (!status) {
    return null;
  }

  if (deviceStatusToColorClass?.[status] && SENSOR_STATUS_TO_TRANSLATION?.[status]) {
    const label = translateStatus(status, t);
    const color = deviceStatusToColorClass[status];

    return <Chip label={label} color={color} size="small" lightBackground />;
  }

  return null;
};
