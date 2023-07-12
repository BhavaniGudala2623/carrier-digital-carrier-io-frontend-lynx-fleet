import { TFunction } from 'i18next';

import type { SnapshotDataEx } from '@/features/common';
import { TableCellLink } from '@/components';

interface ParamsProps {
  data?: SnapshotDataEx;
  changedFields?: Set<string>;
}

export const FreezerAlarmRenderer = (
  params: ParamsProps,
  t: TFunction,
  setModalSelectedAsset: (data: SnapshotDataEx) => void,
  rowClass?: string
) => {
  const { data } = params;

  if (!data?.activeFreezerAlarms?.length) {
    return null;
  }

  const handleLinkClick = () => {
    setModalSelectedAsset(data);
  };

  return (
    <TableCellLink className={rowClass} onClick={handleLinkClick}>
      <b>
        {data.activeFreezerAlarms.length} {t('common.active').toLowerCase()}
      </b>
    </TableCellLink>
  );
};
