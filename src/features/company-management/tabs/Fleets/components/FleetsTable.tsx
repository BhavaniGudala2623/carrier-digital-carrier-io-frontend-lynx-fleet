import { useState } from 'react';
import { AssetRow, HierarchicalFleet, Maybe } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';
import { ColumnState, GridApi, GridReadyEvent } from '@ag-grid-community/core';
import { useTranslation } from 'react-i18next';

import { RowSelected } from '../../common/types';
import { MoreActionsRenderer } from '../formatters';
import { FleetNameRenderer } from '../../common/formatters';
import { useFleetsTableColumns, useRowClassRules, useTreeDataSelectionChanged } from '../hooks';
import { LIMIT, NAME_COL_ID } from '../constants';
import { Permissions } from '../providers';
import { makeNodeId } from '../../common/utils';

import { Loader, PrivacyRenderer, Table } from '@/components';
import { useUserSettings } from '@/providers/UserSettings';
import { useTableSaveColumns } from '@/utils';

const defaultColumnState: ColumnState[] = [
  {
    colId: NAME_COL_ID,
    sort: 'asc',
  },
];

interface FleetsTableProps {
  rowData?: Maybe<(AssetRow | Partial<HierarchicalFleet>)[]>;
  loading?: boolean;
  selectedIds?: string[];
  onSelectedIdsChange?: (selectedAssets: RowSelected[]) => void;
  onGridApiReady?: (gridApi: GridApi) => void;
  permissions: Permissions;
}

export const FleetsTable = ({
  rowData,
  loading,
  selectedIds,
  onSelectedIdsChange,
  onGridApiReady,
  permissions,
}: FleetsTableProps) => {
  const { t } = useTranslation();
  const { onUserSettingsChange } = useUserSettings();
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const { savedColumns, defaultColumns, defaultColDef, autoGroupColumnDef } = useFleetsTableColumns({
    permissions,
  });
  const rowClassRules = useRowClassRules();

  const { onColumnsChanged, onColumnsChangedDebounced, onResetColumnsState } = useTableSaveColumns({
    onSaveColumn: onUserSettingsChange,
    gridApi,
    defaultColumns,
    columnsSettingKey: 'companyFleetsColumns',
  });

  const getMainMenuItems = () => [
    'pinSubMenu',
    'separator',
    'autoSizeThis',
    'autoSizeAll',
    'separator',
    {
      name: t('common.reset-columns'),
      action: onResetColumnsState,
    },
  ];

  const handleGridReady = (params: GridReadyEvent) => {
    params.columnApi.applyColumnState({ state: defaultColumnState });
    selectedIds?.forEach((id) => params.api.getRowNode(id)?.setSelected(true));
    onGridApiReady?.(params.api);
    setGridApi(params.api);
  };

  const handleSelectionChanged = useTreeDataSelectionChanged(selectedIds ?? [], rowData, onSelectedIdsChange);

  const getDataPath = (data: AssetRow | Partial<HierarchicalFleet>) => data?.hierarchy ?? [];

  return (
    <Box height="100%" position="relative" display="flex" flexDirection="column">
      <Table
        cacheOverflowSize={LIMIT}
        cacheBlockSize={LIMIT}
        columnDefs={savedColumns}
        sortingOrder={['asc', 'desc']}
        defaultColDef={defaultColDef}
        autoGroupColumnDef={autoGroupColumnDef}
        rowData={rowData}
        rowBuffer={0}
        rowClassRules={rowClassRules}
        components={{
          rowActionsRenderer: MoreActionsRenderer,
          fleetNameRenderer: FleetNameRenderer,
          privacyRenderer: PrivacyRenderer,
        }}
        getRowId={makeNodeId}
        onGridReady={handleGridReady}
        getDataPath={getDataPath}
        onSelectionChanged={handleSelectionChanged}
        getMainMenuItems={getMainMenuItems}
        onColumnMoved={onColumnsChanged}
        onColumnPinned={onColumnsChanged}
        onColumnVisible={onColumnsChanged}
        onSortChanged={onColumnsChanged}
        onColumnResized={onColumnsChangedDebounced}
        suppressRowClickSelection
        accentedSort
        treeData
        suppressFieldDotNotation={false}
        resizeColumnsToFit
      />
      {loading && <Loader overlay />}
    </Box>
  );
};

FleetsTable.displayName = 'FleetsTable';
