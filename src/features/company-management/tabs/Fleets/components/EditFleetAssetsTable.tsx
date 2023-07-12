import { ColDef, GridReadyEvent, SelectionChangedEvent } from '@ag-grid-community/core';
import Box from '@carrier-io/fds-react/Box';
import { AssetRow } from '@carrier-io/lynx-fleet-types';

import { makeNodeId } from '../../common/utils';
import { LIMIT } from '../constants';

import { Table } from '@/components';

interface EditFleetAssetsTableProps {
  assets?: AssetRow[];
  searchText: string;
  columnDefs: ColDef[];
  defaultColDef: ColDef;
  handleGridReady: (params: GridReadyEvent) => void;
  handleSelectionChanged: (e: SelectionChangedEvent) => void;
}

export const EditFleetAssetsTable = ({
  assets,
  columnDefs,
  defaultColDef,
  handleGridReady,
  searchText,
  handleSelectionChanged,
}: EditFleetAssetsTableProps) => (
  <Box height={400} position="relative" display="flex" flexDirection="column">
    <Table
      cacheOverflowSize={LIMIT}
      cacheBlockSize={LIMIT}
      columnDefs={columnDefs}
      sortingOrder={['asc', 'desc']}
      defaultColDef={defaultColDef}
      rowData={assets}
      rowBuffer={0}
      rowSelection="multiple"
      rowMultiSelectWithClick
      getRowId={makeNodeId}
      onGridReady={handleGridReady}
      onSelectionChanged={handleSelectionChanged}
      quickFilterText={searchText}
      suppressRowClickSelection
      accentedSort
    />
  </Box>
);
