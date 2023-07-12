import type { ColDef, ColumnApi } from '@ag-grid-community/core';
import { get } from 'lodash-es';
import { useCallback, useEffect, useState } from 'react';

import { useAssetsPageDataContext } from '../../providers/AssetsPageDataProvider';

import { AssetTrackingColIdType } from './DefaultColumnDefs';

import type { SnapshotDataEx } from '@/features/common';
import { Columns } from '@/types';

const columnIdsToCheck = new Set<AssetTrackingColIdType>([
  'c1BoxSensor',
  'c1RasSensor',
  'c1SasSensor',
  'c1BoxBTSensor',
  'c1RasBTSensor',
  'c1SasBTSensor',
  'c1BoxDatacold',
  'c1RasDatacold',
  'c1SasDatacold',
  'c2BoxSensor',
  'c2RasSensor',
  'c2SasSensor',
  'c2BoxBTSensor',
  'c2RasBTSensor',
  'c2SasBTSensor',
  'c2BoxDatacold',
  'c2RasDatacold',
  'c2SasDatacold',
  'c3BoxSensor',
  'c3RasSensor',
  'c3SasSensor',
  'c3BoxBTSensor',
  'c3RasBTSensor',
  'c3SasBTSensor',
  'c3BoxDatacold',
  'c3RasDatacold',
  'c3SasDatacold',
  'datacoldDoorRear1',
  'datacoldDoorSide1',
  'datacoldDoorRear2',
  'datacoldDoorSide2',
  'datacoldDoorRear3',
  'datacoldDoorSide3',
  'datacoldDoorRear4',
  'datacoldDoorSide4',
  'datacoldFuelLevel1',
  'datacoldFuelLevel2',
  'datacoldFuelLevel3',
  'assetHealth',
]);

export const useHideEmptyColumns = ({
  columnApi,
  assetListColumns,
}: {
  columnApi: ColumnApi | null;
  assetListColumns: Columns;
}) => {
  const { filteredSnapshots: snapshots } = useAssetsPageDataContext();
  const [notVisibleColumnsIds, setNotVisibleColumnsIds] = useState<string[]>([]);

  const hideEmptyColumns = useCallback(() => {
    if (!snapshots?.length) {
      return;
    }

    const columnDefs = columnApi?.getColumns()?.map((c) => c.getColDef()) ?? [];
    const columnsToCheck = columnDefs.filter(
      (c: ColDef) => !('hide' in c) && columnIdsToCheck.has(c.colId! as AssetTrackingColIdType)
    );

    const visibleColumnIds = new Set<string>();
    const isColNotVisibleYet = (c: ColDef) => !visibleColumnIds.has(c.colId!);

    const checkColumn = (snapshot: SnapshotDataEx) => (c: ColDef) => {
      if (
        c.colId === 'assetHealth' &&
        snapshot.activeFreezerAlarms?.some((alarm) => alarm?.healthStatus === 'CRITICAL')
      ) {
        visibleColumnIds.add(c.colId);

        return;
      }
      const fieldValue = get(snapshot, c.field!);
      // todo: remove check for object when RAS2_DATACOLD column issue get resolved
      if (fieldValue !== undefined && fieldValue !== null && !(fieldValue instanceof Object)) {
        visibleColumnIds.add(c.colId!);
      }
    };

    snapshots.forEach((snapshot) => {
      columnsToCheck.filter(isColNotVisibleYet).forEach(checkColumn(snapshot));
    });

    const notVisibleColumns = columnsToCheck.filter(isColNotVisibleYet).map((c) => c.colId!);

    columnApi?.setColumnsVisible(notVisibleColumns, false);
    columnApi?.setColumnsVisible(Array.from(visibleColumnIds), true);
    setNotVisibleColumnsIds(notVisibleColumns);
  }, [columnApi, snapshots]);

  useEffect(() => {
    if (columnApi && snapshots?.length && assetListColumns) {
      hideEmptyColumns();
    }
  }, [columnApi, hideEmptyColumns, snapshots, assetListColumns]);

  return { hideEmptyColumns, notVisibleColumnsIds };
};
