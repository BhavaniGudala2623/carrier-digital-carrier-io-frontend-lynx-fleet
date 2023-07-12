import { useMemo } from 'react';
import Paper from '@carrier-io/fds-react/Paper';
import { useRbac } from '@carrier-io/rbac-provider-react';
import { AssetRow, Company, GroupData, User } from '@carrier-io/lynx-fleet-types';
import Box from '@carrier-io/fds-react/Box';

import { CompanyManagementGridTab, ITab } from '../types';
import { DataGridProvider } from '../providers';
import {
  AssetsTableContainer,
  CompaniesTableContainer,
  FleetsTableContainer,
  UsersTableContainer,
  GroupsTableContainer,
  HierarchicalCompany,
} from '../tabs';

import { DataGridHeader } from './DataGridHeader';

import { useAppSelector } from '@/stores';
import { getAuthTenantId } from '@/features/authentication';
import { FleetRow } from '@/types';
import { companyActionPayload } from '@/features/authorization';

interface IDataGridProps {
  selectedTabId: CompanyManagementGridTab;
  tabs: ITab[];
  isLoadingCompanies: boolean;
  filteredRowsCompanies: Company[];
  parents: HierarchicalCompany[];
  isLoadingAssets: boolean;
  rowAssets: AssetRow[];
  isLoadingUsers: boolean;
  rowUsers: User[];
  allUsers: User[];
  rowFleets: FleetRow[];
  isLoadingGroups: boolean;
  rowGroups: GroupData[];
}

export const DataGrid = (props: IDataGridProps) => {
  const {
    selectedTabId,
    tabs,
    isLoadingCompanies,
    filteredRowsCompanies,
    parents,
    isLoadingAssets,
    rowAssets,
    isLoadingUsers,
    rowUsers,
    allUsers,
    rowFleets,
    isLoadingGroups,
    rowGroups,
  } = props;
  const { hasPermission } = useRbac();
  const tenantId = useAppSelector(getAuthTenantId);

  const { assetListAllowed, userListAllowed, fleetListAllowed, groupListAllowed } = useMemo(
    () => ({
      assetListAllowed: hasPermission(companyActionPayload('asset.list', tenantId)),
      userListAllowed: hasPermission(companyActionPayload('user.list', tenantId)),
      fleetListAllowed: hasPermission(companyActionPayload('fleet.list', tenantId)),
      groupListAllowed: hasPermission(companyActionPayload('group.list', tenantId)),
    }),
    [hasPermission, tenantId]
  );

  return (
    <DataGridProvider>
      <Paper
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', border: 'none' }}
        variant="outlined"
      >
        <DataGridHeader tabs={tabs} selectedTabId={selectedTabId} />
        <Box flexGrow={1}>
          {(selectedTabId === 'COMPANIES' || selectedTabId === 'PARENTS') && (
            <CompaniesTableContainer
              loading={isLoadingCompanies}
              filteredRows={filteredRowsCompanies}
              parents={parents}
            />
          )}
          {selectedTabId === 'ASSETS' && assetListAllowed && (
            <AssetsTableContainer loading={isLoadingAssets} rowData={rowAssets} />
          )}
          {selectedTabId === 'FLEETS' && fleetListAllowed && (
            <FleetsTableContainer rowFleets={rowFleets} loading={isLoadingAssets} rowData={rowAssets} />
          )}
          {selectedTabId === 'USERS' && userListAllowed && (
            <UsersTableContainer loading={isLoadingUsers} rowData={rowUsers} />
          )}
          {selectedTabId === 'GROUPS' && groupListAllowed && (
            <GroupsTableContainer loading={isLoadingGroups} rowUsers={allUsers} rowGroups={rowGroups} />
          )}
        </Box>
      </Paper>
    </DataGridProvider>
  );
};

DataGrid.displayName = 'DataGrid';
