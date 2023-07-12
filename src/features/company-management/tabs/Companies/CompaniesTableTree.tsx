import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ColDef, GridApi, GridReadyEvent, SelectionChangedEvent } from '@ag-grid-community/core';

import { HasParentRenderer } from '../../formatters';
import { NAME_COL_ID } from '../../constants';

import { useFirstColumnHighlighting } from './hooks';
import { useStyles } from './styles';
import { CompaniesTableTreeParams } from './types';
import {
  CompanyActionsRenderer,
  CompanyAdminRenderer,
  CompanyTypeRenderer,
  ParentSum,
  RegionNameRenderer,
} from './formatters';

import { PageLoader as Loader } from '@/components/PageLoader';
import { useUserSettings } from '@/providers/UserSettings';
import { applyComposedColumnsUserSettings, useTableSaveColumns } from '@/utils';
import { Table, CountryNameRenderer } from '@/components';
import { Columns } from '@/types';
import { DEFAULT_COLUMN_WIDTH } from '@/constants';

interface CompaniesTableTreeProps {
  selectedIds: string[];
  columnDefs: Columns;
  rowData: CompaniesTableTreeParams['data'][];
  onSelectionChanged: (event: SelectionChangedEvent) => void;
  loading: boolean;
}

export const CompaniesTableTree = ({
  rowData,
  selectedIds,
  columnDefs: defaultColumns,
  onSelectionChanged,
  loading,
}: CompaniesTableTreeProps) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { userSettings, onUserSettingsChange } = useUserSettings();
  const { companiesParentsColumns } = userSettings;
  const [gridApi, setGridApi] = useState<GridApi | null>(null);

  const getRowId = ({ data }: { data: CompaniesTableTreeParams['data'] }) => data.id;
  const getDataPath = (data: CompaniesTableTreeParams['data']) => data.hierarchy;

  const { isCarrierCompany, isFirstColumn } = useFirstColumnHighlighting();

  const handleGridReady = (e: GridReadyEvent) => {
    const { api } = e;
    setGridApi(api);

    selectedIds.forEach((id) => api.getRowNode(id)?.setSelected(true));
  };

  const autoGroupColumnDef = useMemo(
    () => ({
      headerName: t('company.management.company-name'),
      colId: NAME_COL_ID,
      minWidth: 300,
      cellRendererParams: {
        suppressCount: true,
      },
      rowDrag: false,
      suppressMovable: true,
    }),
    [t]
  );

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
    () => applyComposedColumnsUserSettings(defaultColumns, companiesParentsColumns),
    [companiesParentsColumns, defaultColumns]
  );

  const { onColumnsChanged, onColumnsChangedDebounced, onResetColumnsState } = useTableSaveColumns({
    onSaveColumn: onUserSettingsChange,
    gridApi,
    defaultColumns,
    columnsSettingKey: 'companiesParentsColumns',
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
          companyAdminRenderer: (params) => CompanyAdminRenderer(params, t),
          CompanyTypeRenderer,
        }}
        aggFuncs={{
          assetCount: (params) => ParentSum(params, 'assetCount'),
          userCount: (params) => ParentSum(params, 'userCount'),
        }}
        autoGroupColumnDef={autoGroupColumnDef}
        rowSelection="single"
        getDataPath={getDataPath}
        onSelectionChanged={onSelectionChanged}
        groupDefaultExpanded={0}
        suppressRowClickSelection={false}
        onGridReady={handleGridReady}
        columnDefs={savedColumns}
        onColumnMoved={onColumnsChanged}
        onColumnPinned={onColumnsChanged}
        onColumnVisible={onColumnsChanged}
        onSortChanged={onColumnsChanged}
        onColumnResized={onColumnsChangedDebounced}
        getMainMenuItems={getMainMenuItems}
        treeData
        accentedSort
        resizeColumnsToFit
      />
      {loading && <Loader />}
    </div>
  );
};

CompaniesTableTree.displayName = 'CompaniesTableTree';
