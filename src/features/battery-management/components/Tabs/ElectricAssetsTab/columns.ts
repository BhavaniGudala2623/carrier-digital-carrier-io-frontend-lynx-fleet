import { TFunction } from 'i18next';
import { DateFormatType } from '@carrier-io/lynx-fleet-common';
import { TemperatureType } from '@carrier-io/lynx-fleet-types';

import { Columns } from '@/types';
import { DEFAULT_COLUMN_MIN_WIDTH } from '@/constants';
import { dateTimeFormatter } from '@/components';

export const getDefaultColumns = (
  t: TFunction,
  dateFormat: DateFormatType,
  timezone: string,
  temperatureUnits: TemperatureType
): Columns => [
  {
    colId: 'assetName',
    field: 'battery.assetName',
    headerName: t('battery.management.asset-name'),
    headerTooltip: t('battery.management.asset-name'),
    lockVisible: true,
    cellRenderer: 'AssetNameRenderer',
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  },

  {
    colId: 'truSerialNumber',
    field: 'battery.truSerialNumber',
    headerName: t('battery.management.tru-serial-number'),
    headerTooltip: t('battery.management.tru-serial-number'),
  },
  {
    colId: 'truStatus',
    field: 'battery.truStatus',
    headerName: t('battery.management.tru-status'),
    headerTooltip: t('battery.management.tru-status'),
    sortable: false,
    cellRenderer: 'TruStatusRenderer',
    minWidth: 110,
  },
  {
    colId: 'powerMode',
    field: 'battery.powerMode',
    headerName: t('battery.management.power-mode'),
    headerTooltip: t('battery.management.power-mode'),
    cellRenderer: 'PowerModeRenderer',
    minWidth: 160,
  },
  {
    colId: 'stateOfCharge',
    field: 'battery.stateOfCharge',
    headerName: t('battery.management.state-of-charge'),
    headerTooltip: t('battery.management.state-of-charge'),
    cellRenderer: 'StateOfChargeRenderer',
    cellStyle: { display: 'flex', alignItems: 'center' },
  },
  {
    colId: 'chargingStatus',
    field: 'battery.chargingStatus',
    headerName: t('battery.management.charging-status'),
    headerTooltip: t('battery.management.charging-status'),
    cellRenderer: 'ChargingStatusRenderer',
    cellStyle: { display: 'flex', alignItems: 'center' },
  },
  {
    colId: 'batteryLastSeen',
    field: 'battery.batteryLastSeen',
    headerName: t('battery.management.battery-last-seen'),
    headerTooltip: t('battery.management.battery-last-seen'),
    cellRenderer: 'BatteryLastSeenRenderer',
    cellRendererParams: {
      timezone,
    },
    cellStyle: { display: 'flex', alignItems: 'center' },
    minWidth: 160,
  },
  {
    colId: 'lastUpdate',
    field: 'battery.batteryLastSeen',
    headerName: t('battery.management.last-updated'),
    headerTooltip: t('battery.management.last-updated'),
    valueFormatter: (params) =>
      dateTimeFormatter(params.data?.battery?.batteryLastSeen, { dateFormat, timezone }),
  },

  {
    colId: 'lowBatterySince',
    field: 'battery.lowBatterySince',
    headerName: t('battery.management.low-battery-since'),
    headerTooltip: t('battery.management.low-battery-since'),
    valueFormatter: (params) =>
      dateTimeFormatter(params.data?.battery?.lowBatterySince, { dateFormat, timezone }),
    minWidth: 160,
  },
  {
    colId: 'lastRebalanced',
    field: 'battery.lastRebalanced',
    headerName: t('battery.management.last-rebalanced'),
    headerTooltip: t('battery.management.last-rebalanced'),
    valueFormatter: (params) =>
      dateTimeFormatter(params.data?.battery?.lastRebalanced, { dateFormat, timezone }),
  },
  {
    colId: 'batteryTemperatureMin',
    field: 'battery.batteryTemperatureMin',
    headerName: t('battery.management.battery-temparature-minimum'),
    headerTooltip: t('battery.management.battery-temparature-minimum'),
    cellRenderer: 'BatteryMinTemparatureRenderer',
    cellRendererParams: {
      temperatureUnits,
    },
    cellStyle: { display: 'flex', alignItems: 'center' },
    minWidth: 160,
  },
  {
    colId: 'batteryTemperatureMax',
    field: 'battery.batteryTemperatureMax',
    headerName: t('battery.management.battery-temparature-maximum'),
    headerTooltip: t('battery.management.battery-temparature-maximum'),
    cellRenderer: 'BatteryMaxTemparatureRenderer',
    cellRendererParams: {
      temperatureUnits,
    },
    cellStyle: { display: 'flex', alignItems: 'center' },
    minWidth: 160,
  },
];
