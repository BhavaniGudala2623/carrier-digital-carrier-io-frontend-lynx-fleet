import { ColDef } from '@carrier-io/fds-react/AgGrid';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { LightGroup, SortedUser } from '../../../common/types';
import { groupRoleTranslations } from '../../constants';

import { timestampFormatter } from '@/components';
import { applyComposedColumnsUserSettings } from '@/utils';
import { useUserSettings } from '@/providers/UserSettings';
import { Columns } from '@/types';
import { useApplicationContext } from '@/providers/ApplicationContext';

export const EMAIL_COL_ID = 'email';

export const useGroupsTableColumns = ({
  editAllowed,
  deleteAllowed,
}: {
  editAllowed: boolean;
  deleteAllowed: boolean;
}) => {
  const { t } = useTranslation();
  const { appLanguage } = useApplicationContext();
  const { userSettings } = useUserSettings();
  const { companyGroupsColumns, timezone, dateFormat } = userSettings;

  const autoGroupColumnDef: ColDef<SortedUser | LightGroup> = useMemo(
    () => ({
      colId: 'company_group_email',
      headerName: t('company.management.group-and-name'),
      lockVisible: true,
      minWidth: 400,
      cellRendererParams: {
        suppressCount: true,
      },
      rowDrag: false,
      valueGetter: (value) => {
        if (value.data?.type === 'USER') {
          return value.data.fullName;
        }

        if (value.data?.type === 'GROUP') {
          return value.data.name;
        }

        return '';
      },
    }),
    /* eslint-disable react-hooks/exhaustive-deps */
    []
  );

  const defaultColumns: Columns = useMemo(
    () => [
      {
        colId: 'companyName',
        headerName: t('company.management.company-name'),
        field: 'tenant.name',
        minWidth: 250,
        valueGetter: (value) => {
          if (value.data?.type === 'USER') {
            return value.data.tenant?.name;
          }

          if (value.data.type === 'GROUP') {
            return value.data.tenantName;
          }

          return '';
        },
      },
      {
        colId: EMAIL_COL_ID,
        field: 'email',
        headerName: t('common.email'),
        minWidth: 200,
        cellRenderer: 'privacyRenderer',
      },
      {
        colId: 'phone',
        headerName: t('company.management.phone'),
        field: 'phone',
        cellRenderer: 'privacyRenderer',
      },
      {
        colId: 'isCompanyAdmin',
        headerName: t('company.management.company-admin'),
        headerTooltip: t('company.management.company-admin'),
        width: 150,
        cellRenderer: 'CompanyAdminRenderer',
        cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'left' },
        field: '',
      },
      {
        colId: 'role',
        headerName: t('company.management.group-role'),
        minWidth: 200,
        valueFormatter: (params) => {
          if (params.data?.type === 'USER') {
            const userRole =
              params.data.groups?.find((group) => group.group.id === (params.data as SortedUser)?.thisGroupId)
                ?.user.role ?? '';

            return t(groupRoleTranslations[userRole]);
          }

          return '';
        },
        field: '',
      },
      {
        colId: 'lastVisitedOn',
        headerName: t('company.management.user-last-login'),
        field: 'lastLogin',
        minWidth: 200,
        valueFormatter: (params) => timestampFormatter(params.value, dateFormat, { timezone }),
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
    ],
    [t, appLanguage, editAllowed, deleteAllowed, timezone]
  );

  const savedColumns = useMemo(
    () => applyComposedColumnsUserSettings(defaultColumns, companyGroupsColumns),
    [companyGroupsColumns, defaultColumns]
  );

  return { autoGroupColumnDef, defaultColumns, savedColumns };
};
