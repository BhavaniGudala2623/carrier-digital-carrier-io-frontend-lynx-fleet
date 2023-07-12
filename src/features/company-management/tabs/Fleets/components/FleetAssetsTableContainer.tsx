import { useCallback } from 'react';
import { GridReadyEvent, SelectionChangedEvent, ColumnState } from '@ag-grid-community/core';
import { AssetRow } from '@carrier-io/lynx-fleet-types';

import { useDialogAssetsTableColumns } from '../hooks';
import { NAME_COL_ID } from '../constants';

import { FleetDialogAssetsTable } from '.';

import { TableProps } from '@/components';

const defaultColumnState: ColumnState[] = [
  {
    colId: NAME_COL_ID,
    sort: 'asc',
  },
];

type EditFleetAssetsTableContainerProps = {
  assets?: AssetRow[];
  onSelectedAssetIdsChanged: (assetsIds: string[]) => void;
  selectedAssetIds: string[];
  loading?: boolean;
} & TableProps;

export const FleetAssetsTableContainer = ({
  assets,
  selectedAssetIds,
  onSelectedAssetIdsChanged,
  ...rest
}: EditFleetAssetsTableContainerProps) => {
  const { columnDefs, defaultColDef } = useDialogAssetsTableColumns();

  const handleGridReady = (params: GridReadyEvent) => {
    params.columnApi.applyColumnState({ state: defaultColumnState });
    selectedAssetIds?.forEach((id) => params.api.getRowNode(id)?.setSelected(true));
  };

  const handleSelectionChanged = useCallback(
    (event: SelectionChangedEvent) => {
      const nodes = event.api.getSelectedNodes();
      onSelectedAssetIdsChanged(nodes.map(({ data }) => data.id));
    },
    [onSelectedAssetIdsChanged]
  );

  return (
    <FleetDialogAssetsTable
      {...rest}
      assets={assets}
      columnDefs={columnDefs}
      defaultColDef={defaultColDef}
      onGridReady={handleGridReady}
      onSelectionChanged={handleSelectionChanged}
    />
  );
};
