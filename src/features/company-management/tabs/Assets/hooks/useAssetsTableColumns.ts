import { useMemo } from 'react';
import type { ValueGetterParams, ColDef, ValueFormatterParams, CellStyle } from '@ag-grid-community/core';
import { Fleet } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';

import { CompanyNameValueGetter } from '../formatters';
import { NAME_COL_ID } from '../constants';

import { timestampFormatter } from '@/components';
import { applyComposedColumnsUserSettings } from '@/utils';
import { SavedColumns, useUserSettings } from '@/providers/UserSettings';
import { DEFAULT_COLUMN_WIDTH } from '@/constants';

interface Permissions {
  editAssetAllowed: boolean;
  editFleetAllowed?: boolean;
  deleteAssetAllowed: boolean;
  deleteFleetAllowed?: boolean;
}

export const useAssetsTableColumns = ({
  companyAssetsColumns,
  permissions,
  defsConfig,
  checkboxSelection = false,
  headerCheckboxSelection = false,
}: {
  companyAssetsColumns: SavedColumns;
  permissions: Permissions;
  defsConfig?: string[];
  checkboxSelection?: boolean;
  headerCheckboxSelection?: boolean;
}) => {
  const { t } = useTranslation();
  const {
    userSettings: { timezone, dateFormat },
  } = useUserSettings();

  const defaultColDef: ColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: false,
      width: DEFAULT_COLUMN_WIDTH,
      suppressSizeToFit: true,
    }),
    []
  );

  const defaultColumns = useMemo(
    () => [
      {
        colId: NAME_COL_ID,
        field: 'name',
        headerName: t('assets.management.asset-name'),
        minWidth: 300,
        checkboxSelection,
        headerCheckboxSelection,
        lockVisible: true,
      },
      {
        colId: 'tenantName',
        field: '',
        headerName: t('company.management.company-name'),
        headerTooltip: t('company.management.company-name'),
        valueGetter: CompanyNameValueGetter,
        minWidth: 240,
      },
      {
        colId: 'licensePlateNumber',
        field: 'licensePlateNumber',
        headerName: t('assets.management.license-plate'),
        headerTooltip: t('assets.management.license-plate'),
        minWidth: 205,
      },
      {
        colId: 'fleetName',
        field: 'fleets',
        headerName: t('assets.management.fleets'),
        cellRenderer: 'fleetNameRenderer',
        valueGetter: (params: ValueGetterParams) =>
          params.data.fleets?.map((fleet: Fleet) => fleet.name).join(', '),
        minWidth: 200,
      },
      {
        colId: 'truSerial',
        field: 'device.truSerialNumber',
        headerName: t('assets.management.tru-serial'),
        headerTooltip: t('assets.management.tru-serial'),
      },
      {
        colId: 'truModel',
        field: 'device.truModelNumber',
        headerName: t('assets.management.tru-model'),
        headerTooltip: t('assets.management.tru-model'),
      },
      {
        colId: 'deviceSerial',
        field: 'device.serialNumber',
        headerName: t('assets.management.device-serial'),
        headerTooltip: t('assets.management.device-serial'),
      },
      {
        colId: 'lastModifiedBy',
        field: 'lastModifiedBy',
        minWidth: 220,
        headerName: t('assets.management.last-modified-by'),
        headerTooltip: t('assets.management.last-modified-by'),
        cellRenderer: 'privacyRenderer',
        cellStyle: { textAlign: 'left' } as CellStyle,
      },
      {
        colId: 'lastModified',
        field: 'lastModified',
        headerName: t('assets.management.last-modified-on'),
        headerTooltip: t('assets.management.last-modified-on'),
        type: 'numericColumn',
        minWidth: 200,
        valueFormatter: (params: ValueFormatterParams) =>
          timestampFormatter(params.value, dateFormat, { timezone }),
        cellStyle: { textAlign: 'right' } as CellStyle,
      },
      {
        colId: '',
        field: '',
        headerName: '',
        suppressMenu: true,
        sortable: false,
        lockVisible: true,
        minWidth: 1,
        width: 1,
        suppressSizeToFit: false,
        suppressColumnsToolPanel: true,
      },
      {
        colId: 'actions',
        headerName: '',
        field: '',
        cellRenderer: 'rowActionsRenderer',
        minWidth: 60,
        width: 60,
        resizable: false,
        sortable: false,
        pinned: 'right' as ColDef['pinned'],
        suppressMenu: true,
        hide: Object.values(permissions).every((value) => !value),
        cellRendererParams: { permissions },
        cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
        suppressColumnsToolPanel: true,
      },
    ],
    [t, checkboxSelection, headerCheckboxSelection, permissions, dateFormat, timezone]
  );

  const generatedColumnDefs = useMemo(
    () =>
      defsConfig
        ? defaultColumns.filter(({ colId }) => defsConfig.findIndex((defName) => defName === colId) > -1)
        : defaultColumns,
    [defsConfig, defaultColumns]
  );

  const savedColumns = useMemo(
    () => applyComposedColumnsUserSettings(generatedColumnDefs, companyAssetsColumns),
    [generatedColumnDefs, companyAssetsColumns]
  );

  const autoGroupColumnDef: ColDef = useMemo(
    () => ({
      headerName: t('company.management.fleet-name'),
      colId: NAME_COL_ID,
      minWidth: 300,
      rowDrag: false,
      valueGetter: (param: ValueGetterParams) => param.data?.name,
    }),
    [t]
  );

  return { defaultColumns: generatedColumnDefs, defaultColDef, autoGroupColumnDef, savedColumns };
};
