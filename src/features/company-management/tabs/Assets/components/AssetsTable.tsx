import { useCallback, useState } from 'react';
import Box from '@carrier-io/fds-react/Box';
import { Maybe, AssetRow } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';
import { GridApi, GridReadyEvent, SelectionChangedEvent } from '@ag-grid-community/core';

import { MoreActionsRenderer, FleetNameRenderer } from '../formatters';
import { useAssetsTableColumns, useRowClassRules } from '../hooks';
import { LIMIT } from '../constants';
import { Permissions } from '../providers';
import { makeNodeId } from '../../common/utils/assetTable';
import { RowSelected } from '../../common/types';

import { useTableSaveColumns } from '@/utils';
import { PageLoader as Loader } from '@/components/PageLoader';
import { useUserSettings } from '@/providers/UserSettings';
import { PrivacyRenderer, Table } from '@/components';

interface AssetsTableProps {
  rowData?: Maybe<AssetRow[]>;
  loading?: boolean;
  selectedIds?: string[];
  onSelectedIdsChange?: (selectedAssets: RowSelected[]) => void;
  onGridApiReady?: (gridApi: GridApi) => void;
  permissions: Pick<Permissions, 'editAssetAllowed' | 'deleteAssetAllowed'>;
  defsConfig?: string[];
  checkboxSelection?: boolean;
  headerCheckboxSelection?: boolean;
  quickFilterText?: string;
}

export const AssetsTable = ({
  rowData,
  loading,
  selectedIds,
  onSelectedIdsChange,
  onGridApiReady,
  permissions,
  defsConfig,
  checkboxSelection,
  headerCheckboxSelection,
  quickFilterText,
}: AssetsTableProps) => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const { t } = useTranslation();
  const { userSettings, onUserSettingsChange } = useUserSettings();
  const { companyAssetsColumns } = userSettings;

  const { savedColumns, defaultColumns, defaultColDef } = useAssetsTableColumns({
    companyAssetsColumns,
    permissions,
    defsConfig,
    checkboxSelection,
    headerCheckboxSelection,
  });
  const rowClassRules = useRowClassRules();

  const { onColumnsChanged, onColumnsChangedDebounced, onResetColumnsState } = useTableSaveColumns({
    onSaveColumn: onUserSettingsChange,
    gridApi,
    defaultColumns,
    columnsSettingKey: 'companyAssetsColumns',
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
    selectedIds?.forEach((id) => params.api.getRowNode(id)?.setSelected(true));
    onGridApiReady?.(params.api);
    setGridApi(params.api);
  };

  const handleSelectionChanged = useCallback(
    (event: SelectionChangedEvent) => {
      const rows = event.api.getSelectedRows();

      onSelectedIdsChange?.(
        rows.map(({ id, tenant, __typename }) => ({ id, tenantId: tenant?.id, __typename }))
      );
    },
    [onSelectedIdsChange]
  );

  return (
    <Box position="relative" display="flex" flexDirection="column" height="100%">
      <Table
        cacheOverflowSize={LIMIT}
        cacheBlockSize={LIMIT}
        sortingOrder={['asc', 'desc']}
        defaultColDef={defaultColDef}
        rowData={rowData}
        rowBuffer={0}
        rowSelection="multiple"
        rowMultiSelectWithClick
        rowClassRules={rowClassRules}
        components={{
          rowActionsRenderer: MoreActionsRenderer,
          fleetNameRenderer: FleetNameRenderer,
          privacyRenderer: PrivacyRenderer,
        }}
        getRowId={makeNodeId}
        onGridReady={handleGridReady}
        getMainMenuItems={getMainMenuItems}
        columnDefs={savedColumns}
        onColumnMoved={onColumnsChanged}
        onColumnPinned={onColumnsChanged}
        onColumnVisible={onColumnsChanged}
        onSortChanged={onColumnsChanged}
        onColumnResized={onColumnsChangedDebounced}
        onSelectionChanged={handleSelectionChanged}
        suppressRowClickSelection
        accentedSort
        suppressFieldDotNotation={false}
        quickFilterText={quickFilterText}
        resizeColumnsToFit
      />
      {loading && <Loader />}
    </Box>
  );
};

AssetsTable.displayName = 'AssetsTable';
