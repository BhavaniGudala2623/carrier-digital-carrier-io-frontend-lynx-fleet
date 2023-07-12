import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { Chip } from '@carrier-io/fds-react';

import { DeviceProvisioningTableParams, DeviceStatus } from '../../../types';

import { DeviceSnapshotData } from '@/types';

const deviceStatusToColorClass: Record<DeviceStatus, 'success' | 'primary' | 'warning'> = {
  Commissioned: 'success',
  Installed: 'primary',
  Uninstalled: 'warning',
};

const DEVICE_STATUS_TO_TRANSLATION: Record<DeviceStatus, string> = {
  Commissioned: 'device.management.device.provisioning.commissioned',
  Installed: 'device.management.device.provisioning.installed',
  Uninstalled: 'device.management.device.provisioning.uninstalled',
};

const translateStatus = (status: DeviceStatus, t: TFunction) => t(DEVICE_STATUS_TO_TRANSLATION[status]);

function getStatus(entity: DeviceSnapshotData): DeviceStatus | '' {
  if (entity?.asset?.id) {
    return 'Commissioned';
  }

  if (
    entity?.snapshot?.freezer_model_number ||
    entity?.snapshot?.freezer_serial_number ||
    entity?.device?.productFamily
  ) {
    return 'Installed';
  }

  return entity ? 'Uninstalled' : '';
}

export const DeviceStatusRenderer = ({ data }: DeviceProvisioningTableParams) => {
  const { t } = useTranslation();
  const status = getStatus(data);

  if (!status) {
    return null;
  }

  if (deviceStatusToColorClass?.[status] && DEVICE_STATUS_TO_TRANSLATION?.[status]) {
    const label = translateStatus(status, t);
    const color = deviceStatusToColorClass[status];

    return <Chip label={label} color={color} size="small" lightBackground />;
  }

  return null;
};
