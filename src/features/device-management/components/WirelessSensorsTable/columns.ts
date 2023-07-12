import { TFunction } from 'i18next';
import { DateFormatType } from '@carrier-io/lynx-fleet-common';

import { Columns } from '@/types';
import { dateTimeFormatter } from '@/components';
import { DEFAULT_COLUMN_MIN_WIDTH } from '@/constants';

const emptyValueFormatter = (params) => (params.value ? params.value : '-');

export const getDefaultColumns = (
  t: TFunction,
  dateFormat: DateFormatType,
  deviceViewAllowed: boolean,
  timezone: string
): Columns => [
  {
    colId: 'imei',
    field: 'deviceIMEI',
    headerName: t('device.management.device.info.device-IMEI'),
    headerTooltip: t('device.management.device.info.device-IMEI'),
    cellRenderer: 'DeviceImeiRenderer',
    cellRendererParams: {
      deviceViewAllowed,
    },
    sortable: false,
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  },
  {
    colId: 'assetName',
    field: 'assetName',
    headerName: t('device.management.bluetooth-sensors.sensors-table.asset-name'),
    headerTooltip: t('device.management.bluetooth-sensors.sensors-table.asset-name'),
    cellRenderer: 'AssetNameRenderer',
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  },
  {
    colId: 'tenantName',
    field: 'tenantName',
    headerName: t('device.management.bluetooth-sensors.sensors-table.company-name'),
    headerTooltip: t('device.management.bluetooth-sensors.sensors-table.company-name'),
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    valueFormatter: emptyValueFormatter,
  },
  {
    colId: 'serialNumber',
    field: 'truSerial',
    headerName: t('device.management.bluetooth-sensors.sensors-table.tru-serial'),
    headerTooltip: t('device.management.bluetooth-sensors.sensors-table.tru-serial'),
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    valueFormatter: emptyValueFormatter,
    sortable: false,
  },
  {
    colId: 'mac',
    field: 'macId',
    headerName: t('device.management.bluetooth-sensors.sensors-table.mac-id'),
    headerTooltip: t('device.management.bluetooth-sensors.sensors-table.mac-id'),
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    sortable: false,
  },
  {
    colId: 'sensorLocation',
    field: 'sensorLocation',
    headerName: t('device.management.bluetooth-sensors.sensors-table.sensor-location'),
    headerTooltip: t('device.management.bluetooth-sensors.sensors-table.sensor-location'),
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    cellRenderer: 'SensorLocationRenderer',
    sortable: false,
  },
  {
    colId: 'certificate',
    field: 'hasCertificate',
    headerName: t('device.management.bluetooth-sensors.sensors-table.sensor-certificate'),
    headerTooltip: t('device.management.bluetooth-sensors.sensors-table.sensor-certificate'),
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    cellRenderer: 'CertificateLinkRenderer',
    sortable: false,
  },
  {
    colId: 'replacementDate',
    field: 'replacementDate',
    headerName: t('device.management.bluetooth-sensors.sensors-table.replacement-date'),
    headerTooltip: t('device.management.bluetooth-sensors.sensors-table.replacement-date'),
    valueFormatter: (params) =>
      params.value
        ? dateTimeFormatter(params.value, { dateFormat, timezone, dateOptions: { variant: 'date' } })
        : '-',
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  },
  {
    colId: 'status',
    field: 'status',
    headerName: t('device.management.bluetooth-sensors.sensors-table.sensor-status'),
    headerTooltip: t('device.management.bluetooth-sensors.sensors-table.sensor-status'),
    cellRenderer: 'SensorStatusRenderer',
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  },
  {
    colId: 'statusChangedOn',
    field: 'statusChangedOn',
    headerName: t('device.management.bluetooth-sensors.sensors-table.sensor-status-changed-on'),
    headerTooltip: t('device.management.bluetooth-sensors.sensors-table.sensor-status-changed-on'),
    valueFormatter: (params) =>
      params.value
        ? dateTimeFormatter(params.value, { dateFormat, timezone, dateOptions: { variant: 'date' } })
        : '-',
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    sortable: false,
  },
  // {
  //   colId: 'battery',
  //   field: 'battery',
  //   headerName: t('device.management.bluetooth-sensors.sensors-table.sensor-battery-level'),
  //   headerTooltip: t('device.management.bluetooth-sensors.sensors-table.sensor-battery-level'),
  //   valueFormatter: (params) => (params.value ? `${params.value}%` : '-'),
  //   sortable: false,
  //   minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  // },
  {
    colId: 'commissionedOn',
    field: 'commissionedOn',
    headerName: t('device.management.bluetooth-sensors.sensors-table.sensor-commissioned-on'),
    headerTooltip: t('device.management.bluetooth-sensors.sensors-table.sensor-commissioned-on'),
    valueFormatter: (params) =>
      params.value ? dateTimeFormatter(params.value, { dateFormat, timezone }) : '-',
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  },
  {
    field: 'commissionedBy',
    headerName: t('device.management.bluetooth-sensors.sensors-table.sensor-commissioned-by'),
    headerTooltip: t('device.management.bluetooth-sensors.sensors-table.sensor-commissioned-by'),
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    valueFormatter: emptyValueFormatter,
    sortable: false,
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
    field: '',
    headerName: '',
    cellRenderer: 'SensorActionsRenderer',
    minWidth: 60,
    width: 60,
    cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
    resizable: false,
    sortable: false,
    pinned: 'right',
    suppressColumnsToolPanel: true,
  },
];
