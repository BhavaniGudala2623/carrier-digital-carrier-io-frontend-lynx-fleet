import { routes } from '@/routes';
import { TableCellLink } from '@/components';

export const AssetNameRenderer = ({ data, value }) => {
  if (!data?.assetId) {
    return value;
  }

  return <TableCellLink to={`${routes.assets.path}/${data.assetId}`}>{value}</TableCellLink>;
};
