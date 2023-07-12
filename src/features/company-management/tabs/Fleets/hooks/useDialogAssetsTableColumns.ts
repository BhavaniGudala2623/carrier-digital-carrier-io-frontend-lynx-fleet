import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ValueGetterParams, ColDef, ValueFormatterParams, ITooltipParams } from '@ag-grid-community/core';
import { Fleet } from '@carrier-io/lynx-fleet-types';

import { NAME_COL_ID } from '../constants';

import { timestampFormatter } from '@/components';
import { useUserSettings } from '@/providers/UserSettings';

export const useDialogAssetsTableColumns = () => {
  const { t } = useTranslation();
  const { userSettings } = useUserSettings();
  const { timezone, dateFormat } = userSettings;

  const defaultColDef: ColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: false,
      width: 200,
    }),
    []
  );

  const columnDefs = useMemo(() => {
    const colDefs: ColDef[] = [
      {
        colId: NAME_COL_ID,
        field: 'name',
        width: 240,
        headerName: t('assets.management.asset-name'),
        checkboxSelection: true,
        headerCheckboxSelection: true,
        tooltipValueGetter: ({ value }: ITooltipParams) => value,
        lockVisible: true,
      },
      {
        colId: 'licensePlateNumber',
        field: 'licensePlateNumber',
        headerName: t('assets.management.license-plate'),
      },
      {
        colId: 'fleetName',
        field: 'fleets',
        headerName: t('assets.management.fleets'),
        valueGetter: (params: ValueGetterParams) =>
          params.data.fleets?.map((fleet: Fleet) => fleet.name).join(', '),
        tooltipValueGetter: ({ value }: ITooltipParams) => value,
      },
      {
        colId: 'lastModified',
        field: 'lastModified',
        headerName: t('assets.management.last-modified-on'),
        valueFormatter: (params: ValueFormatterParams) =>
          timestampFormatter(params.value, dateFormat, { timezone }),
      },
    ];

    return colDefs;
  }, [t, dateFormat, timezone]);

  return { columnDefs, defaultColDef };
};
