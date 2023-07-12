import { TFunction } from 'i18next';
import { ValueFormatterParams } from '@ag-grid-community/core';
import { TemperatureType } from '@carrier-io/lynx-fleet-types';
import { DateFormatType } from '@carrier-io/lynx-fleet-common';

import { responseFormatter } from './column-formatters';

import { Columns } from '@/types';
import { dateTimeFormatter } from '@/components';

const DateComparator = (testDate, valueString) => new Date(valueString).getTime() - testDate.getTime();

const dateFilter = { filter: 'agDateColumnFilter', filterParams: { comparator: DateComparator } };

const commandNameFormatter = (cellContent: ValueFormatterParams, t: TFunction) =>
  cellContent.value?.startsWith('Toggle Compartment')
    ? t('command-history.toggle_compartment')
    : t(`command-history.command-name.${cellContent.value?.toLowerCase().replace(/ /g, '-')}`);

export const getDefaultCommandHistoryTableColumns = (
  t: TFunction,
  dateFormat: DateFormatType,
  temperatureUnit: TemperatureType,
  timezone: string
): Columns => [
  {
    colId: 'assetName',
    field: 'assetName',
    headerName: t('assets.management.asset-name'),
    headerTooltip: t('assets.management.asset-name'),
    pinned: 'left',
    lockPosition: true,
    lockVisible: true,
    cellRenderer: 'AssetNameRenderer',
    width: 192,
  },
  {
    colId: 'deviceName',
    field: 'deviceName',
    headerName: t('assets.asset.table.device-name'),
    headerTooltip: t('assets.asset.table.device-name'),
    width: 192,
  },
  {
    colId: 'commandName',
    field: 'commandName',
    headerName: t('asset.command.name'),
    headerTooltip: t('asset.command.name'),
    valueFormatter: (params) => commandNameFormatter(params, t),
    width: 192,
  },
  {
    colId: 'value',
    field: 'value',
    headerName: t('assethistory.table.value'),
    cellRenderer: 'ValueRenderer',
    cellRendererParams: { temperatureUnit },
    cellStyle: {
      display: 'flex',
      alignItems: 'center',
    },
    width: 192,
  },
  {
    colId: 'status',
    field: 'status',
    headerName: t('asset.command.status'),
    cellRenderer: 'StatusRenderer',
    cellStyle: { display: 'flex', alignItems: 'center' },
    width: 110,
    minWidth: 110,
  },
  {
    colId: 'response',
    field: 'response',
    headerName: t('assethistory.table.response'),
    valueFormatter: (params) => responseFormatter(params.value, params.data.status),
    width: 160,
  },
  {
    colId: 'responseOn',
    field: 'responseOn',
    headerName: t('assethistory.table.responseOn'),
    valueFormatter: (params) => dateTimeFormatter(params.value, { dateFormat, timezone }),
    cellStyle: { textAlign: 'right' },
    width: 190,
    ...dateFilter,
  },
  {
    colId: 'createdOn',
    field: 'createdOn',
    headerName: t('assethistory.table.createdOn'),
    valueFormatter: (params) => dateTimeFormatter(params.value, { dateFormat, timezone }),
    sort: 'desc',
    cellStyle: { textAlign: 'right' },
    width: 190,
    ...dateFilter,
  },
  {
    colId: 'sentOn',
    field: 'sentOn',
    headerName: t('assethistory.table.sentOn'),
    valueFormatter: (params) => dateTimeFormatter(params.value, { dateFormat, timezone }),
    cellStyle: { textAlign: 'right' },
    width: 190,
    ...dateFilter,
  },
  {
    colId: 'sentBy',
    field: 'sentBy',
    headerName: t('asset.command.sent.by'),
    cellRenderer: 'PrivacyRenderer',
    width: 250,
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
];
