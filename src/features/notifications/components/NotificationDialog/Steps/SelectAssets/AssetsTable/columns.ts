import { TFunction } from 'i18next';
import { ValueFormatterParams, ValueGetterParams } from '@ag-grid-community/core';
import { Fleet } from '@carrier-io/lynx-fleet-types';
import { DateFormatType } from '@carrier-io/lynx-fleet-common';

import { Columns } from '@/types';
import { dateTimeFormatter } from '@/components';

export const getColumns = (t: TFunction, dateFormat: DateFormatType): Columns => [
  {
    colId: 'name',
    field: 'name',
    width: 225,
    headerName: t('assets.management.asset-name'),
    checkboxSelection: true,
    headerCheckboxSelection: true,
    lockVisible: true,
  },
  {
    colId: 'licensePlateNumber',
    field: 'licensePlateNumber',
    headerName: t('assets.management.license-plate'),
    width: 190,
  },
  {
    colId: 'fleetName',
    field: 'fleets',
    headerName: t('assets.management.fleets'),
    width: 190,
    valueGetter: (params: ValueGetterParams) =>
      params.data.fleets?.map((fleet: Fleet) => fleet.name).join(', '),
  },
  {
    colId: 'lastModified',
    field: 'lastModified',
    headerName: t('assets.management.last-modified-on'),
    width: 170,
    valueFormatter: (params: ValueFormatterParams) => dateTimeFormatter(params.value, { dateFormat }),
  },
];
