import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { ColDef, ColumnState, GridReadyEvent, SelectionChangedEvent } from '@ag-grid-community/core';
import { Company } from '@carrier-io/lynx-fleet-types';
import { ColumnApi, GridApi } from '@ag-grid-community/core';

import { HasParentRenderer } from '../../formatters';
import { NAME_COL_ID } from '../../constants';

import { CompaniesTableParams } from './types';
import { useFirstColumnHighlighting } from './hooks';
import { useStyles } from './styles';
import {
  CompanyActionsRenderer,
  CompanyTypeRenderer,
  RegionNameRenderer,
  ParentSum,
  CompanyAdminRenderer,
} from './formatters';

import { PageLoader as Loader } from '@/components/PageLoader';
import { useUserSettings } from '@/providers/UserSettings';
import { Table, PrivacyRenderer, CountryNameRenderer } from '@/components';
import { applyComposedColumnsUserSettings, useTableSaveColumns } from '@/utils';
import { Columns } from '@/types';
import { DEFAULT_COLUMN_WIDTH } from '@/constants';

const defaultColumnState: ColumnState[] = [
  {
    colId: NAME_COL_ID,
    sort: 'asc',
  },
];

interface CompaniesTableProps {
  selectedIds: string[];
  columnDefs: Columns;
  rowData: CompaniesTableParams['data'][];
  onSelectionChanged: (event: SelectionChangedEvent) => void;
  loading: boolean;
}

export const CompaniesTable = ({
  selectedIds,
  rowData,
  columnDefs: defaultColumns,
  onSelectionChanged,
  loading,
}: CompaniesTableProps) => {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const setColumnApiState = useState<ColumnApi | null>(null);
  const setColumnApi = setColumnApiState[1];
  const { t } = useTranslation();
  const classes = useStyles();
  const { userSettings, onUserSettingsChange } = useUserSettings();
  const { companiesColumns } = userSettings;

  const getRowId = ({ data }: { data: Company }) => data.id;

  const { isCarrierCompany, isFirstColumn } = useFirstColumnHighlighting();

  const defaultColDef: ColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      filter: false,
      width: DEFAULT_COLUMN_WIDTH,
      suppressSizeToFit: true,
      cellClassRules: {
        [classes.firstColumn]: isFirstColumn,
        [classes.carrierCompany]: isCarrierCompany,
      },
      suppressRowClickSelection: true,
      getQuickFilterText: () => '',
    }),
    [classes.carrierCompany, classes.firstColumn, isCarrierCompany, isFirstColumn]
  );

  const savedColumns = useMemo(
    () => applyComposedColumnsUserSettings(defaultColumns, companiesColumns),
    [companiesColumns, defaultColumns]
  );

  const { onColumnsChanged, onColumnsChangedDebounced, onResetColumnsState } = useTableSaveColumns({
    onSaveColumn: onUserSettingsChange,
    gridApi,
    defaultColumns,
    columnsSettingKey: 'companiesColumns',
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

  const handleGridReady = (e: GridReadyEvent) => {
    const { api } = e;
    setGridApi(api);
    setColumnApi(e.columnApi);

    e.columnApi.applyColumnState({ state: defaultColumnState });

    selectedIds.forEach((id) => api.getRowNode(id)?.setSelected(true));
  };

  return (
    <div className={classes.companiesTable}>
      <Table
        rowData={rowData}
        sortingOrder={['asc', 'desc']}
        cacheOverflowSize={15}
        cacheBlockSize={15}
        defaultColDef={defaultColDef}
        getRowId={getRowId}
        rowBuffer={0}
        components={{
          hasParentRenderer: HasParentRenderer,
          rowActionsRenderer: CompanyActionsRenderer,
          regionNameRenderer: (params) => RegionNameRenderer(params, t),
          countryNameRenderer: (params) => CountryNameRenderer(params, t),
          privacyRenderer: PrivacyRenderer,
          CompanyTypeRenderer,
          companyAdminRenderer: (params) => CompanyAdminRenderer(params, t),
        }}
        aggFuncs={{
          assetCount: (params) => ParentSum(params, 'assetCount'),
          userCount: (params) => ParentSum(params, 'userCount'),
        }}
        rowSelection="single"
        onSelectionChanged={onSelectionChanged}
        getMainMenuItems={getMainMenuItems}
        columnDefs={savedColumns}
        onColumnMoved={onColumnsChanged}
        onColumnPinned={onColumnsChanged}
        onColumnVisible={onColumnsChanged}
        onSortChanged={onColumnsChanged}
        onColumnResized={onColumnsChangedDebounced}
        suppressRowClickSelection={false}
        accentedSort
        onGridReady={handleGridReady}
        resizeColumnsToFit
      />
      {loading && <Loader />}
    </div>
  );
};

CompaniesTable.displayName = 'CompaniesTable';
