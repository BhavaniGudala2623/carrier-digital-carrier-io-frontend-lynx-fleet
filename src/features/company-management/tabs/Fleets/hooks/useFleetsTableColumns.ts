import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ValueGetterParams, ColDef, ValueFormatterParams } from '@ag-grid-community/core';

import { NAME_COL_ID } from '../constants';
import { CompanyNameValueGetter } from '../../Assets/formatters';

import { dateTimeFormatter } from '@/components';
import { applyComposedColumnsUserSettings } from '@/utils';
import { Columns } from '@/types';
import { useUserSettings } from '@/providers/UserSettings';
import { DEFAULT_COLUMN_WIDTH } from '@/constants';

interface Permissions {
  editAssetAllowed: boolean;
  editFleetAllowed?: boolean;
  deleteAssetAllowed: boolean;
  deleteFleetAllowed?: boolean;
}

export const useFleetsTableColumns = ({ permissions }: { permissions: Permissions }) => {
  const { t } = useTranslation();
  const { userSettings } = useUserSettings();
  const { companyFleetsColumns, timezone, dateFormat } = userSettings;

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

  const defaultColumns = useMemo(() => {
    const colDefs: Columns = [
      {
        field: '',
        colId: 'tenantName',
        headerName: t('company.management.company-name'),
        valueGetter: CompanyNameValueGetter,
        minWidth: 240,
        lockVisible: true,
      },
      {
        colId: 'licensePlateNumber',
        field: 'licensePlateNumber',
        headerName: t('assets.management.license-plate'),
        minWidth: 220,
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
        field: 'modifiedBy',
        minWidth: 220,
        headerName: t('assets.management.last-modified-by'),
        headerTooltip: t('assets.management.last-modified-by'),
        cellRenderer: 'privacyRenderer',
      },
      {
        colId: 'lastModified',
        field: 'updatedAt',
        headerName: t('assets.management.last-modified-on'),
        headerTooltip: t('assets.management.last-modified-on'),
        minWidth: 200,
        valueFormatter: (params: ValueFormatterParams) =>
          dateTimeFormatter(params.value, { dateFormat, timezone }),
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
        field: '',
        colId: 'actions',
        headerName: '',
        cellRenderer: 'rowActionsRenderer',
        minWidth: 60,
        width: 60,
        resizable: false,
        sortable: false,
        pinned: 'right',
        suppressMenu: true,
        hide: Object.values(permissions).every((value) => !value),
        cellRendererParams: { permissions },
        cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
        suppressColumnsToolPanel: true,
      },
    ];

    return colDefs;
  }, [t, permissions, dateFormat, timezone]);

  const autoGroupColumnDef: ColDef = useMemo(
    () => ({
      headerName: t('company.management.fleet-name'),
      colId: NAME_COL_ID,
      minWidth: 300,
      rowDrag: false,
      suppressMovable: true,
      valueGetter: (param: ValueGetterParams) => param.data?.name,
    }),
    /* eslint-disable react-hooks/exhaustive-deps */
    []
  );

  const savedColumns = useMemo(
    () => applyComposedColumnsUserSettings(defaultColumns, companyFleetsColumns),
    [companyFleetsColumns, defaultColumns]
  );

  return { savedColumns, defaultColumns, defaultColDef, autoGroupColumnDef };
};
