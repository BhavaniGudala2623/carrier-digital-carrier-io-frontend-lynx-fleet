import { Tooltip } from '@carrier-io/fds-react';
import { useTranslation } from 'react-i18next';

import { ElectricAssetParams } from '../../../../types';

import { TableCellLink } from '@/components';

export const AssetNameRenderer = ({ data, value }: ElectricAssetParams) => {
  const { t } = useTranslation();
  const assetId = data?.battery?.assetId ?? undefined;
  if (!assetId) {
    return null;
  }

  return (
    <Tooltip
      title={t('assets.asset.table.go-to-asset-details')}
      componentsProps={{ tooltip: { sx: { fontWeight: 700 } } }}
      enterDelay={1000}
      enterNextDelay={1000}
    >
      <span>
        <TableCellLink to={`/assets/${assetId}`}>{value}</TableCellLink>
      </span>
    </Tooltip>
  );
};
