import { useMemo, useState } from 'react';
import Box from '@carrier-io/fds-react/Box';
import { useTranslation } from 'react-i18next';
import type { ColumnState, GridReadyEvent, SelectionChangedEvent } from '@ag-grid-community/core';
import { Maybe, User } from '@carrier-io/lynx-fleet-types';
import { GridApi } from '@ag-grid-community/core';

import {
  defaultColDef,
  FULL_NAME_COL_ID,
  IsPrimaryRenderer,
  UserRoleRenderer,
  UsersActionsRendererContainer,
} from '../../common';
import { UserGroupsRenderer } from '../../common/formatters/UserGroupsRenderer';

import { Loader } from '@/components/Loader';
import { applyComposedColumnsUserSettings, useTableSaveColumns } from '@/utils';
import { useUserSettings } from '@/providers/UserSettings';
import { PrivacyRenderer, Table } from '@/components';
import { Columns } from '@/types';

export interface UsersTableProps {
  columnDefs: Columns;
  rowData: User[];
  loading: boolean;
  selectedUsers: User['email'][];
  setSelectedUsers: (users: User['email'][]) => void;
}

const defaultColumnState: ColumnState[] = [
  {
    colId: FULL_NAME_COL_ID,
    sort: 'asc',
  },
];

export const UsersTable = ({
  columnDefs,
  rowData,
  loading,
  selectedUsers,
  setSelectedUsers,
}: UsersTableProps) => {
  const [gridApi, setGridApi] = useState<Maybe<GridApi>>(null);
  const { t } = useTranslation();
  const { userSettings, onUserSettingsChange } = useUserSettings();
  const { companyUsersColumns } = userSettings;

  const savedColumns = useMemo(
    () => applyComposedColumnsUserSettings(columnDefs, companyUsersColumns),
    [columnDefs, companyUsersColumns]
  );

  const { onColumnsChanged, onColumnsChangedDebounced, onResetColumnsState } = useTableSaveColumns({
    onSaveColumn: onUserSettingsChange,
    gridApi,
    defaultColumns: columnDefs,
    columnsSettingKey: 'companyUsersColumns',
  });

  const onSelectionChanged = (event: SelectionChangedEvent) => {
    setSelectedUsers?.(event.api.getSelectedRows()?.map(({ email }) => email));
  };

  const getRowId = ({ data: { email } }: { data: User }) => email;

  const handleGridReady = (e: GridReadyEvent) => {
    const { api, columnApi } = e;
    setGridApi(api);

    columnApi.applyColumnState({ state: defaultColumnState });

    selectedUsers.forEach((id) => api.getRowNode(id)?.setSelected(true));
  };

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
        getMainMenuItems={getMainMenuItems}
        defaultColDef={defaultColDef}
        columnDefs={savedColumns}
        sortingOrder={['asc', 'desc']}
        gridOptions={{
          suppressRowClickSelection: true,
        }}
        getRowId={getRowId}
        rowData={rowData}
        components={{
          isPrimaryRenderer: IsPrimaryRenderer,
          rowActionsRenderer: UsersActionsRendererContainer,
          privacyRenderer: PrivacyRenderer,
          userRoleRenderer: UserRoleRenderer,
          userGroupsRenderer: UserGroupsRenderer,
        }}
        onSelectionChanged={onSelectionChanged}
        rowSelection="multiple"
        suppressRowClickSelection
        suppressFieldDotNotation={false}
        onColumnMoved={onColumnsChanged}
        onColumnPinned={onColumnsChanged}
        onColumnVisible={onColumnsChanged}
        onSortChanged={onColumnsChanged}
        onColumnResized={onColumnsChangedDebounced}
        accentedSort
        onGridReady={handleGridReady}
        resizeColumnsToFit
      />
      {loading && <Loader overlay />}
    </Box>
  );
};

UsersTable.displayName = 'UsersTable';
