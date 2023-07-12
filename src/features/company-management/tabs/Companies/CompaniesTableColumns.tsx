import { TFunction } from 'i18next';
import { Maybe } from '@carrier-io/lynx-fleet-types';
import type { ValueFormatterParams } from '@ag-grid-community/core';
import { DateFormatType } from '@carrier-io/lynx-fleet-common';

import { NAME_COL_ID } from '../../constants';

import { timestampFormatter } from '@/components';
import { Columns } from '@/types';

type GetColumnsInput = {
  dateFormat: DateFormatType;
  viewByParent: boolean;
  editAllowed: boolean;
  deleteAllowed: boolean;
  t: TFunction;
  timezone: string;
};

const hasParentComparator = (valA?: Maybe<string>, valB?: Maybe<string>) => {
  if (!valA) {
    return -1;
  }

  if (!valB) {
    return 1;
  }

  return 0;
};

export const getColumns = ({
  dateFormat,
  viewByParent,
  editAllowed,
  deleteAllowed,
  t,
  timezone,
}: GetColumnsInput): Columns => [
  {
    colId: NAME_COL_ID,
    field: 'name',
    headerName: t('company.management.company-name'),
    minWidth: 300,
    cellStyle: { textAlign: 'left' },
    rowDrag: false,
    hide: viewByParent,
    getQuickFilterText: (data) => data.data?.name,
    lockVisible: true,
  },
  {
    colId: 'region',
    headerName: t('company.management.region'),
    enableValue: true,
    valueGetter: 'data.contactInfo.region',
    cellRenderer: 'regionNameRenderer',
    field: '',
  },
  {
    colId: 'country',
    headerName: t('company.management.country'),
    valueGetter: 'data.contactInfo.country',
    enableValue: true,
    cellRenderer: 'countryNameRenderer',
    field: '',
  },
  {
    colId: 'companyType',
    headerName: t('company.management.company-type'),
    headerTooltip: t('company.management.company-type'),
    field: 'companyType',
    enableValue: true,
    cellRenderer: 'CompanyTypeRenderer',
  },
  {
    colId: 'companyAdmin',
    headerName: t('company.management.company-admin'),
    headerTooltip: t('company.management.company-admin'),
    field: 'companyAdmin',
    enableValue: true,
    cellRenderer: 'companyAdminRenderer',
    width: 200,
  },
  {
    colId: 'parentId',
    field: 'parentId',
    headerName: t('company.management.has-parent'),
    headerTooltip: t('company.management.has-parent'),
    cellRenderer: 'hasParentRenderer',
    enableValue: true,
    comparator: hasParentComparator,
  },
  {
    colId: 'lastModifiedBy',
    headerName: t('common.last-modified-by'),
    headerTooltip: t('common.last-modified-by'),
    field: 'lastModifiedBy',
    width: 200,
    enableValue: true,
    cellRenderer: 'privacyRenderer',
  },
  {
    colId: 'lastModified',
    headerName: t('common.last-modified-on'),
    headerTooltip: t('common.last-modified-on'),
    field: 'lastModified',
    enableValue: true,
    width: 200,
    valueFormatter: (params: ValueFormatterParams) =>
      timestampFormatter(params.value, dateFormat, { timezone }),
  },
  {
    colId: 'assetCount',
    field: 'assetCount',
    aggFunc: 'assetCount',
    headerName: t('company.management.assets'),
    enableValue: true,
  },
  {
    colId: 'userCount',
    field: 'userCount',
    aggFunc: 'userCount',
    headerName: t('company.management.users'),
    enableValue: true,
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
    cellRenderer: editAllowed || deleteAllowed ? 'rowActionsRenderer' : '',
    minWidth: 60,
    width: 60,
    cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
    resizable: false,
    sortable: false,
    pinned: 'right',
    hide: !editAllowed && !deleteAllowed,
    cellRendererParams: { editAllowed, deleteAllowed },
    field: '',
    suppressColumnsToolPanel: true,
  },
];
