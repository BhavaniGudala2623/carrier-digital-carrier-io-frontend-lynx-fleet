import { TFunction } from 'i18next';
import type { ValueFormatterParams } from '@ag-grid-community/core';
import { DateFormatType } from '@carrier-io/lynx-fleet-common';

import { timestampFormatter } from '@/components';
import { Columns } from '@/types';

export const FULL_NAME_COL_ID = 'fullName';
export const EMAIL_COL_ID = 'email';

interface GetUserColumnsInput {
  editAllowed: boolean;
  deleteAllowed: boolean;
  dateFormat: DateFormatType;
  t: TFunction;
  timezone: string;
}

export const getUsersColumns = ({
  editAllowed,
  deleteAllowed,
  dateFormat,
  t,
  timezone,
}: GetUserColumnsInput): Columns => [
  {
    colId: FULL_NAME_COL_ID,
    field: 'fullName',
    headerName: t('common.name'),
    minWidth: 250,
    cellRenderer: 'privacyRenderer',
    // sort: 'asc',
    lockVisible: true,
  },
  {
    colId: EMAIL_COL_ID,
    field: 'email',
    headerName: t('common.email'),
    minWidth: 250,
    cellRenderer: 'privacyRenderer',
  },
  // TODO: hidden for release 21.1.3
  /* {
    colId: 'primary',
    headerName: t('company.management.primary-contact'),
    field: 'primary',
    width: 100,
    cellRenderer: 'isPrimaryRenderer',
  }, */
  {
    colId: 'phone',
    headerName: t('company.management.phone'),
    field: 'phone',
    cellRenderer: 'privacyRenderer',
    minWidth: 200,
  },
  {
    colId: 'companyName',
    headerName: t('company.management.company-name'),
    field: 'tenant.name',
    minWidth: 250,
  },
  {
    colId: 'group',
    headerName: t('company.management.user-group'),
    field: 'groups',
    minWidth: 200,
    cellRenderer: 'userGroupsRenderer',
  },
  {
    colId: 'lastVisitedOn',
    headerName: t('company.management.user-last-login'),
    field: 'lastLogin',
    minWidth: 250,
    valueFormatter: (params: ValueFormatterParams) =>
      timestampFormatter(params.value, dateFormat, { timezone }),
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
    headerName: '',
    field: '',
    cellRenderer: editAllowed || deleteAllowed ? 'rowActionsRenderer' : '',
    minWidth: 60,
    width: 60,
    cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
    resizable: false,
    sortable: false,
    pinned: 'right',
    hide: !editAllowed && !deleteAllowed,
    cellRendererParams: { editAllowed, deleteAllowed },
    suppressColumnsToolPanel: true,
  },
];
