import { useEffect, useMemo } from 'react';
import { NetworkStatus } from '@apollo/client';
import { useRbac } from '@carrier-io/rbac-provider-react';

import { DataGrid } from '../components/DataGrid';
import { companyManagementSlice, useCompanyManagementState } from '../stores';
import { useCompanyManagementTabs, useGridData } from '../hooks';
import { companyManagementTabs } from '../constants';

import { getAuthTenantId } from '@/features/authentication';
import { useAppDispatch, useAppSelector } from '@/stores';
import { companyActionPayload } from '@/features/authorization';
import { useApplicationContext } from '@/providers/ApplicationContext';

const {
  actions: {
    setSearchCompaniesCount,
    setSearchParentsCount,
    setSearchAssetsCount,
    setSearchFleetsCount,
    setSearchUsersCount,
    setSearchGroupsCount,
  },
} = companyManagementSlice;

export const DataGridContainer = () => {
  const dispatch = useAppDispatch();
  const { selectedGridTab } = useCompanyManagementState();
  const {
    applicationState: { selectedCompanyHierarchy },
  } = useApplicationContext();
  const { hasPermission } = useRbac();
  const tenantId = useAppSelector(getAuthTenantId);
  const { showAssetList, showUserList, showFleetList, showGroupList } = useMemo(
    () => ({
      showAssetList: hasPermission(companyActionPayload('asset.list', tenantId)),
      showUserList: hasPermission(companyActionPayload('user.list', tenantId)),
      showFleetList: hasPermission(companyActionPayload('fleet.list', tenantId)),
      showGroupList: hasPermission(companyActionPayload('group.list', tenantId)),
    }),
    [hasPermission, tenantId]
  );

  const { tabs } = useCompanyManagementTabs(
    companyManagementTabs,
    showAssetList,
    showUserList,
    showFleetList,
    showGroupList
  );
  const {
    companies: { companies: companiesData, isLoadingCompanies, networkStatusCompanies },
    parents: { companyParents, filteredCompanyParentsCount },
    assets: { assets: assetsData, isLoadingAssets, networkStatusAssets },
    fleets: { fleets: fleetsData, isLoadingFleets, networkStatusFleets },
    users: { users: usersData, allUsers, isLoadingUsers, networkStatusUsers },
    groups: { groups: groupsData, isLoadingGroups, networkStatusGroups },
  } = useGridData({ showAssetList, showUserList, showFleetList, showGroupList });

  const isSelectedFleet = selectedCompanyHierarchy.type === 'FLEET';

  useEffect(() => {
    dispatch(
      setSearchCompaniesCount({
        value: companiesData.length,
        loading: isLoadingCompanies,
        display: !isSelectedFleet,
      })
    );
  }, [companiesData, dispatch, isLoadingCompanies, isSelectedFleet]);

  useEffect(() => {
    dispatch(
      setSearchParentsCount({
        value: filteredCompanyParentsCount,
        loading: isLoadingCompanies,
        display: !isSelectedFleet,
      })
    );
  }, [dispatch, filteredCompanyParentsCount, isLoadingCompanies, isSelectedFleet]);

  useEffect(() => {
    dispatch(
      setSearchAssetsCount({
        value: assetsData.length,
        loading: isLoadingAssets,
        display: showAssetList,
      })
    );
  }, [assetsData.length, dispatch, isLoadingAssets, showAssetList]);

  useEffect(() => {
    dispatch(
      setSearchFleetsCount({
        value: fleetsData.length,
        loading: isLoadingFleets,
        display: showFleetList,
      })
    );
  }, [dispatch, fleetsData.length, isLoadingFleets, showFleetList]);

  useEffect(() => {
    dispatch(
      setSearchUsersCount({
        value: usersData.length,
        loading: isLoadingUsers,
        display: showUserList,
      })
    );
  }, [dispatch, isLoadingUsers, showUserList, usersData]);

  useEffect(() => {
    dispatch(
      setSearchGroupsCount({
        value: groupsData.length,
        loading: isLoadingUsers || isLoadingGroups,
        display: showGroupList,
      })
    );
  }, [dispatch, groupsData, isLoadingGroups, isLoadingUsers, showGroupList]);

  const loadingCompanies = isLoadingCompanies || networkStatusCompanies === NetworkStatus.refetch;
  const loadingAssets = isLoadingAssets || networkStatusAssets === NetworkStatus.refetch;
  const loadingUsers = isLoadingUsers || networkStatusUsers === NetworkStatus.refetch;
  const loadingFleets = isLoadingFleets || networkStatusFleets === NetworkStatus.refetch;
  const loadingGroups = isLoadingGroups || networkStatusGroups === NetworkStatus.refetch;

  return (
    <DataGrid
      selectedTabId={selectedGridTab}
      tabs={tabs}
      isLoadingCompanies={loadingCompanies}
      filteredRowsCompanies={companiesData}
      parents={companyParents}
      isLoadingAssets={loadingAssets || loadingFleets}
      rowAssets={assetsData}
      isLoadingUsers={loadingUsers}
      rowUsers={usersData}
      allUsers={allUsers}
      rowFleets={fleetsData}
      isLoadingGroups={loadingGroups || loadingUsers}
      rowGroups={groupsData}
    />
  );
};
