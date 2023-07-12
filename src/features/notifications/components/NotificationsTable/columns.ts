import { TFunction } from 'i18next';
import { DateFormatType } from '@carrier-io/lynx-fleet-common';

import { conditionTypeFormatter } from './column-formatters';

import { Columns } from '@/types';
import { dateTimeFormatter } from '@/components';
import { DEFAULT_COLUMN_WIDTH } from '@/constants';

export const getDefaultNotificationsTableColumns = (
  t: TFunction,
  dateFormat: DateFormatType,
  showActionsColumn: boolean,
  timezone: string
): Columns => [
  {
    colId: 'name',
    field: 'name',
    headerName: t('notifications.name'),
    minWidth: 250,
    lockVisible: true,
  },
  {
    colId: 'active',
    field: 'active',
    headerName: t('common.status'),
    cellRenderer: 'StatusRenderer',
    width: DEFAULT_COLUMN_WIDTH,
  },
  {
    colId: 'type',
    field: 'rule',
    headerName: t('common.type'),
    valueFormatter: (params) => conditionTypeFormatter(params, t),
    width: DEFAULT_COLUMN_WIDTH,
  },
  {
    colId: 'rule',
    field: 'rule',
    headerName: t('notifications.rules'),
    cellRenderer: 'RuleRenderer',
    width: DEFAULT_COLUMN_WIDTH,
  },
  {
    colId: 'recipientCount',
    field: 'recipientCount',
    headerName: t('notifications.recipients'),
    width: DEFAULT_COLUMN_WIDTH,
  },
  {
    colId: 'sendEmail',
    field: 'sendEmail',
    headerName: t('common.email'),
    headerTooltip: t('common.email'),
    cellRenderer: 'EmailRenderer',
    cellStyle: { display: 'flex', alignItems: 'center' },
    width: DEFAULT_COLUMN_WIDTH,
  },
  {
    colId: 'tenantName',
    field: 'tenantName',
    headerName: t('common.company'),
    minWidth: 200,
  },
  {
    colId: 'createdBy',
    field: 'createdBy',
    headerName: t('common.created-by'),
    minWidth: 200,
  },
  {
    colId: 'modifiedBy',
    field: 'modifiedBy',
    headerName: t('common.modified-by'),
    minWidth: 200,
  },
  {
    colId: 'updatedAt',
    field: 'updatedAt',
    headerName: t('common.modified-on'),
    type: 'numericColumn',
    cellStyle: { textAlign: 'right' },
    valueFormatter: (params) => dateTimeFormatter(params.value, { dateFormat, timezone }),
    minWidth: 200,
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
    field: 'actions',
    headerName: '',
    cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
    hide: !showActionsColumn,
    pinned: 'right',
    cellRenderer: 'ActionsRenderer',
    minWidth: 60,
    width: 60,
    resizable: false,
    sortable: false,
    suppressMenu: true,
    suppressColumnsToolPanel: true,
  },
];
