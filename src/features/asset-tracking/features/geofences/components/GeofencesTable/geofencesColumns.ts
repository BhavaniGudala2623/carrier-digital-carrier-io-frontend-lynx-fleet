import { TFunction } from 'i18next';
import { DateFormatType } from '@carrier-io/lynx-fleet-common';
import { LanguageType } from '@carrier-io/lynx-fleet-types';

import { Columns } from '@/types';
import { dateTimeFormatter } from '@/components';
import { DEFAULT_COLUMN_MIN_WIDTH } from '@/constants';

export function getGeoColumns(
  dateFormat: DateFormatType,
  t: TFunction,
  timezone: string,
  language: LanguageType
): Columns {
  return [
    {
      colId: 'geofenceName',
      field: 'name',
      headerName: t('geofences.header.geofence-name'),
      pinned: 'left',
      lockPosition: true,
      lockVisible: true,
      width: 300,
    },
    {
      colId: 'geofenceGroup',
      field: 'groupId',
      headerName: t('geofences.geofence-group'),
      cellRenderer: 'GeofenceGroupRenderer',
      cellStyle: { display: 'flex', alignItems: 'center' },
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      colId: 'geofenceAddress',
      field: 'address_en',
      headerName: t('geofences.address'),
      cellRenderer: 'GeofenceAddressRenderer',
      minWidth: 250,
      cellRendererParams: { options: { language } },
    },
    {
      colId: 'tenantName',
      field: 'tenantName',
      headerName: t('common.company'),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      colId: 'createdAt',
      field: 'createdAt',
      headerName: t('geofences.header.geofence-created'),
      type: 'numericColumn',
      cellStyle: { textAlign: 'right' },
      valueFormatter: (params) =>
        dateTimeFormatter(params.value, {
          dateFormat,
          timestampFormat: 'milliseconds',
          timezone,
        }),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      colId: 'updatedAt',
      field: 'updatedAt',
      headerName: t('geofences.header.geofence-modified'),
      type: 'numericColumn',
      cellStyle: { textAlign: 'right' },
      valueFormatter: (params) =>
        dateTimeFormatter(params.value, {
          dateFormat,
          timestampFormat: 'milliseconds',
          timezone,
        }),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
    },
    {
      colId: 'modifiedBy',
      field: 'modifiedBy',
      headerName: t('geofences.header.geofence-modifiedby'),
      minWidth: DEFAULT_COLUMN_MIN_WIDTH,
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
}
