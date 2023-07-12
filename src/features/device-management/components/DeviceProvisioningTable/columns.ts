import { TFunction } from 'i18next';
import { ITooltipParams } from '@ag-grid-community/core';
import { DateFormatType } from '@carrier-io/lynx-fleet-common';

import { SoftwareVersionFormatterAdapter } from './column-renderers';

import { Columns } from '@/types';
import { dateTimeFormatter, productFamilyFormatter } from '@/components';
import { DEFAULT_COLUMN_MIN_WIDTH } from '@/constants';

export const getDefaultColumns = (
  t: TFunction,
  dateFormat: DateFormatType,
  deviceViewAllowed: boolean,
  timezone: string
): Columns => [
  {
    colId: 'imei',
    field: 'device.imei',
    headerName: t('device.management.device.info.device-IMEI'),
    headerTooltip: t('device.management.device.info.device-IMEI'),
    cellRenderer: 'DeviceImeiRenderer',
    cellRendererParams: {
      deviceViewAllowed,
    },
    lockVisible: true,
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  },
  {
    colId: 'activationDate',
    field: 'device.activationDate',
    headerName: t('device.management.device.provisioning.сreated-on'),
    valueFormatter: (params) => dateTimeFormatter(params.value, { dateFormat, timezone }),
    sortable: true,
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  },
  {
    colId: 'serialNumber',
    field: 'device.serialNumber',
    headerName: t('device.management.device.provisioning.device-serial'),
    headerTooltip: t('device.management.device.provisioning.device-serial'),
    width: 275,
  },
  {
    colId: 'iccid',
    field: 'device.iccid',
    headerName: t('device.management.device.info.device-ICCID'),
    headerTooltip: t('device.management.device.info.device-ICCID'),
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  },
  {
    field: 'status_formatter',
    headerName: t('device.management.device.provisioning.status'),
    cellRenderer: 'DeviceStatusRenderer',
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  },
  {
    field: 'snapshot.freezer_serial_number',
    headerName: t('device.management.device.provisioning.TRU-serial'),
    headerTooltip: t('device.management.device.provisioning.TRU-serial'),
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  },
  {
    field: 'snapshot.freezer_model_number',
    headerName: t('device.management.device.provisioning.TRU-model'),
    headerTooltip: t('device.management.device.provisioning.TRU-model'),
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  },
  {
    field: 'snapshot.freezer_control_mode',
    headerName: t('device.management.device.info.TRU-control-system-type'),
    headerTooltip: t('device.management.device.info.TRU-control-system-type'),
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  },
  {
    field: 'device.productFamily',
    headerName: t('device.management.device.provisioning.product-family'),
    headerTooltip: t('device.management.device.provisioning.product-family'),
    valueFormatter: (params) => productFamilyFormatter(params.value),
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  },
  {
    field: 'device.current_firmware',
    headerName: t('device.management.device.provisioning.device-firmware-version'),
    headerTooltip: t('device.management.device.provisioning.device-firmware-version'),
    width: 225,
  },
  {
    field: 'device.current_configuration',
    headerName: t('device.management.device.provisioning.config-file'),
    headerTooltip: t('device.management.device.provisioning.config-file'),
    tooltipValueGetter: (params: ITooltipParams) => params.value ?? '',
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  },
  {
    field: 'snapshot.freezer_software_version',
    headerName: t('device.management.device.provisioning.freezer-firmware-version'),
    headerTooltip: t('device.management.device.provisioning.freezer-firmware-version'),
    width: 230,
    valueFormatter: SoftwareVersionFormatterAdapter,
  },
  {
    field: 'asset.name',
    headerName: t('device.management.device.provisioning.associated-asset'),
    headerTooltip: t('device.management.device.provisioning.associated-asset'),
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  },
  {
    field: 'tenant.name',
    headerName: t('device.management.device.provisioning.company-name'),
    headerTooltip: t('device.management.device.provisioning.company-name'),
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  },
  {
    field: 'tenant.contactCountry',
    headerName: t('common.components.country'),
    headerTooltip: t('common.components.country'),
    cellRenderer: 'CountryNameRenderer',
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  },
  {
    field: 'snapshot.timestamp',
    headerName: t('device.management.device.provisioning.last-reported-on'),
    headerTooltip: t('device.management.device.provisioning.last-reported-on'),
    valueFormatter: (params) =>
      dateTimeFormatter(params.value, { dateFormat, timestampFormat: 'seconds', timezone }),
    minWidth: DEFAULT_COLUMN_MIN_WIDTH,
  },
  ...[
    {
      colId: 'commissionedOn',
      field: 'device.commissionedOn',
      headerName: t('device.management.device.provisioning.commissionedOn'),
      headerTooltip: t('device.management.device.provisioning.commissionedOn'),
      valueFormatter: (params) => dateTimeFormatter(params.value, { dateFormat, timezone }),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
      sortable: true,
    },
    {
      field: 'device.commissionedBy',
      headerName: t('device.management.device.provisioning.commissionedBy'),
      headerTooltip: t('device.management.device.provisioning.commissionedBy'),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
  ],
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
