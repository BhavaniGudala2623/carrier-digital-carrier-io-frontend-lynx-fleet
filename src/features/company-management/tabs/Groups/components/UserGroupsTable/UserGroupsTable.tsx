import { useState } from 'react';
import Box from '@carrier-io/fds-react/Box';
import { useTranslation } from 'react-i18next';
import type { GridReadyEvent, ColumnState } from '@ag-grid-community/core';
import { GridApi } from '@ag-grid-community/core';

import { LightGroup, SortedUser } from '../../../common/types';
import {
  FULL_NAME_COL_ID,
  UsersActionsRendererContainer,
  UserRoleRenderer,
  defaultColDef,
} from '../../../common';

import { useGroupsTableColumns } from './useGroupsTableColumns';
import { CompanyAdminRenderer } from './CompanyAdminRenderer';

import { Loader } from '@/components/Loader';
import { useUserSettings } from '@/providers/UserSettings';
import { useTableSaveColumns } from '@/utils';
import { PrivacyRenderer, Table } from '@/components';

export interface UsersByGroupTableProps {
  editAllowed: boolean;
  deleteAllowed: boolean;
  data: (SortedUser | LightGroup)[];
  loading: boolean;
}

const defaultColumnState: ColumnState[] = [
  {
    colId: FULL_NAME_COL_ID,
    sort: 'asc',
  },
];

export const UserGroupsTable = ({ editAllowed, deleteAllowed, data, loading }: UsersByGroupTableProps) => {
  const { t } = useTranslation();
  const { onUserSettingsChange } = useUserSettings();
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const getRowId = ({ data: rowData }: { data: SortedUser | LightGroup }) => {
    if (rowData.type === 'GROUP') {
      return `${rowData.type}-${rowData.id}`;
    }

    return `${rowData.type}-${rowData.thisGroupId}-${rowData.email}`;
  };

  const handleGridReady = ({ columnApi, api }: GridReadyEvent) => {
    columnApi.applyColumnState({ state: defaultColumnState });
    setGridApi(api);
  };

  const getDataPath = (user: SortedUser) => user.hierarchy;

  const { autoGroupColumnDef, defaultColumns, savedColumns } = useGroupsTableColumns({
    editAllowed,
    deleteAllowed,
  });

  const { onColumnsChanged, onColumnsChangedDebounced, onResetColumnsState } = useTableSaveColumns({
    onSaveColumn: onUserSettingsChange,
    gridApi,
    defaultColumns,
    columnsSettingKey: 'companyGroupsColumns',
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

  return (
    <Box position="relative" display="flex" flexDirection="column" height="100%">
      <Table
        defaultColDef={defaultColDef}
        columnDefs={savedColumns}
        onColumnMoved={onColumnsChanged}
        onColumnPinned={onColumnsChanged}
        onColumnVisible={onColumnsChanged}
        onSortChanged={onColumnsChanged}
        onColumnResized={onColumnsChangedDebounced}
        sortingOrder={['asc', 'desc']}
        getRowId={getRowId}
        rowData={data}
        getDataPath={getDataPath}
        treeData
        autoGroupColumnDef={autoGroupColumnDef}
        groupDefaultExpanded={0}
        components={{
          CompanyAdminRenderer,
          rowActionsRenderer: UsersActionsRendererContainer,
          privacyRenderer: PrivacyRenderer,
          userRoleRenderer: UserRoleRenderer,
        }}
        getMainMenuItems={getMainMenuItems}
        suppressRowClickSelection
        suppressFieldDotNotation={false}
        accentedSort
        onGridReady={handleGridReady}
        resizeColumnsToFit
      />
      {loading && <Loader overlay />}
    </Box>
  );
};
