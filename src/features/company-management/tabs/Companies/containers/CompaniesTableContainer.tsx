import { useCallback, useMemo } from 'react';
import { useRbac } from '@carrier-io/rbac-provider-react';
import { Company } from '@carrier-io/lynx-fleet-types';
import { useTranslation } from 'react-i18next';
import type { SelectionChangedEvent } from '@ag-grid-community/core';

import { CompaniesTableTree } from '../CompaniesTableTree';
import { CompaniesTable } from '../CompaniesTable';
import { getColumns } from '../CompaniesTableColumns';
import { companyManagementSlice, useCompanyManagementState } from '../../../stores';
import { HierarchicalCompany } from '../types';

import { getAuthTenantId } from '@/features/authentication';
import { useAppDispatch, useAppSelector } from '@/stores';
import { companyActionPayload } from '@/features/authorization';
import { useUserSettings } from '@/providers/UserSettings';

const {
  actions: { setSelectedTableCompaniesIds },
} = companyManagementSlice;

interface IProps {
  loading: boolean;
  filteredRows: Company[];
  parents: HierarchicalCompany[];
}

export const CompaniesTableContainer = (props: IProps) => {
  const { t } = useTranslation();
  const { loading, filteredRows, parents } = props;
  const { selectedTableCompaniesIds } = useCompanyManagementState();
  const { hasPermission } = useRbac();
  const tenantId = useAppSelector(getAuthTenantId);
  const dispatch = useAppDispatch();
  const { selectedGridTab } = useCompanyManagementState();
  const {
    userSettings: { timezone, dateFormat },
  } = useUserSettings();

  const { editCompanyAllowed, deleteCompanyAllowed } = useMemo(
    () => ({
      editCompanyAllowed: hasPermission(companyActionPayload('company.edit', tenantId)),
      deleteCompanyAllowed: hasPermission(companyActionPayload('company.delete', tenantId)),
    }),
    [hasPermission, tenantId]
  );

  const viewByParent = selectedGridTab === 'PARENTS';

  const columnDefs = useMemo(
    () =>
      getColumns({
        dateFormat,
        viewByParent,
        editAllowed: editCompanyAllowed,
        deleteAllowed: deleteCompanyAllowed,
        t,
        timezone,
      }),
    [dateFormat, viewByParent, editCompanyAllowed, deleteCompanyAllowed, t, timezone]
  );

  const onSelectionChanged = useCallback(
    (event: SelectionChangedEvent) => {
      const rows = event.api.getSelectedRows();

      dispatch(setSelectedTableCompaniesIds(rows.map(({ id }) => id)));
    },
    [dispatch]
  );

  return viewByParent ? (
    <CompaniesTableTree
      selectedIds={selectedTableCompaniesIds}
      columnDefs={columnDefs}
      rowData={parents}
      loading={loading}
      onSelectionChanged={onSelectionChanged}
    />
  ) : (
    <CompaniesTable
      selectedIds={selectedTableCompaniesIds}
      columnDefs={columnDefs}
      rowData={filteredRows}
      loading={loading}
      onSelectionChanged={onSelectionChanged}
    />
  );
};
