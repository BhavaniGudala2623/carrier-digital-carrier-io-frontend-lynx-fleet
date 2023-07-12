import { DeviceProvisioningTableParams } from '../../../types';

import { routes } from '@/routes';
import { TableCellLink } from '@/components';

export const DeviceImeiRenderer = ({ data, deviceViewAllowed }: DeviceProvisioningTableParams) => {
  const imei = data?.device?.imei;
  const id = data?.device?.id;

  if (!imei) {
    return null;
  }

  if (!deviceViewAllowed || !id) {
    return imei;
  }

  return <TableCellLink to={`${routes.deviceManagement.path}/${id}`}>{imei}</TableCellLink>;
};
