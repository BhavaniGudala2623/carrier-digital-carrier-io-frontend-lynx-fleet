import { WirelessSensorsTableParams } from '../../../types';

import { routes } from '@/routes';
import { TableCellLink } from '@/components';

export const AssetNameRenderer = ({ data }: WirelessSensorsTableParams) => {
  const name = data?.assetName;
  const id = data?.assetId;

  if (!name) {
    return '-';
  }

  if (!id) {
    return name;
  }

  return <TableCellLink to={`${routes.assetHistory.path.replace(':assetId', id)}`}>{name}</TableCellLink>;
};
