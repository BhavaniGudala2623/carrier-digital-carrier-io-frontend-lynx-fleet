import { BatteryNotificationsColumnDataType } from '../../../../types';

import { TableCellLink } from '@/components';
import { routes } from '@/routes';

export const AssetNameRenderer = ({ data }: { data: BatteryNotificationsColumnDataType }) => {
  if (!data) {
    return null;
  }
  const { assetName } = data.notification;
  if (!assetName) {
    return null;
  }

  return <TableCellLink to={`${routes.batteryManagement.path}/${assetName}`}>{assetName}</TableCellLink>;
};
