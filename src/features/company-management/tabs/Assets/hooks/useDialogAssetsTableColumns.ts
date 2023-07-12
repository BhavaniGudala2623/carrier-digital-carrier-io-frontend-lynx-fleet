import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ValueGetterParams, ColDef, ValueFormatterParams, ITooltipParams } from '@ag-grid-community/core';
import { Fleet } from '@carrier-io/lynx-fleet-types';
import { DateFormatType } from '@carrier-io/lynx-fleet-common';

import { timestampFormatter } from '@/components';

export const useDialogAssetsTableColumns = ({
  dateFormat,
  timezone,
}: {
  dateFormat: DateFormatType;
  timezone?: string;
}) => {
  const { t } = useTranslation();

  const defaultColDef: ColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      width: 200,
    }),
    []
  );

  const columnDefs = useMemo(() => {
    const colDefs: ColDef[] = [
      {
        colId: 'assetName',
        field: 'name',
        width: 240,
        headerName: t('assets.management.asset-name'),
        checkboxSelection: true,
        headerCheckboxSelection: true,
        lockVisible: true,
        tooltipValueGetter: ({ value }: ITooltipParams) => value,
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
        sortable: false,
      },
      {
        field: 'lastModified',
        headerName: t('assets.management.last-modified-on'),
        sort: 'desc',
        valueFormatter: (params: ValueFormatterParams) =>
          timestampFormatter(params.value, dateFormat, { timezone }),
      },
    ];

    return colDefs;
  }, [t, dateFormat, timezone]);

  return { columnDefs, defaultColDef };
};
