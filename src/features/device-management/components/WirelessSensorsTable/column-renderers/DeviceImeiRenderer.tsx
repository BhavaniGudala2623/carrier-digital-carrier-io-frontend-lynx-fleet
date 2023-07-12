import { WirelessSensorsTableParams } from '../../../types';

import { routes } from '@/routes';
import { TableCellLink } from '@/components';

export const DeviceImeiRenderer = ({ data, deviceViewAllowed }: WirelessSensorsTableParams) => {
  const imei = data?.deviceIMEI;
  const id = data?.deviceId;

  if (!imei) {
    return '-';
  }

  if (!deviceViewAllowed || !id) {
    return imei;
  }

  return (
    <TableCellLink to={`${routes.deviceCommissioning.path.replace(':deviceId', id ?? '')}`}>
      {imei}
    </TableCellLink>
  );
};
