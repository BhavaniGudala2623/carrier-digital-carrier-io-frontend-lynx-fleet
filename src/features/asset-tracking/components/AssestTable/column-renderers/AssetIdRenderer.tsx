import { Maybe } from '@carrier-io/lynx-fleet-types';
import { Tooltip } from '@carrier-io/fds-react';
import { TFunction } from 'i18next';

import type { SnapshotDataEx } from '@/features/common';
import { TableCellLink } from '@/components';

export function AssetIdRenderer(
  { data, value }: { data: SnapshotDataEx; value?: Maybe<string> },
  t: TFunction
) {
  const assetId = data?.asset?.id;

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
}
