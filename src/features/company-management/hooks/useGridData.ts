import { useCallback, useMemo } from 'react';
import { AssetGql, Company } from '@carrier-io/lynx-fleet-types';
import { ApolloError, useQuery } from '@apollo/client';
import { AssetService, FleetService, CompanyService } from '@carrier-io/lynx-fleet-data-lib';

import { useCompanyManagementState } from '../stores';
import { filterRows, getCompaniesParentSet } from '../tabs/Companies/utils';
import { makeHierarchy } from '../tabs/Companies/CompaniesTableTreeHierarchy';
import { HierarchicalCompany } from '../tabs';

import { useAppDispatch } from '@/stores';
import { showError } from '@/stores/actions';
import { FleetRow } from '@/types';
import { sortArrayOfObjectsByStringField } from '@/utils';
import { useApplicationContext } from '@/providers/ApplicationContext';
import { useCompanyHierarchyTenantIds } from '@/features/common';

const localeCompare = new Intl.Collator().compare;

type UseGridDataProps = {
  showAssetList: boolean;
  showUserList: boolean;
  showFleetList: boolean;
  showGroupList: boolean;
};

export const useGridData = ({
  showAssetList,
  showUserList,
  showFleetList,
  showGroupList,
}: UseGridDataProps) => {
  const dispatch = useAppDispatch();
  const {
    applicationState: { selectedCompanyHierarchy },
  } = useApplicationContext();
  const { searchText: searchTextAnyCase } = useCompanyManagementState();
  const searchText = searchTextAnyCase.toLowerCase();
  const selectedTenantId = selectedCompanyHierarchy.type === 'COMPANY' ? selectedCompanyHierarchy.id : null;
  const { companyHierarchyTenantIds } = useCompanyHierarchyTenantIds();
  const queryOptions = useMemo(
    () => ({
      for: {
        type: selectedCompanyHierarchy.type,
        id: selectedCompanyHierarchy.id,
      },
    }),
    [selectedCompanyHierarchy.id, selectedCompanyHierarchy.type]
  );

  const handleQueryError = useCallback((e: ApolloError) => showError(dispatch, e.message), [dispatch]);

  const companiesData = useQuery(CompanyService.GET_SUB_TENANTS_FOR_TENANT, {
    variables: { tenantId: selectedTenantId },
    onError: handleQueryError,
    notifyOnNetworkStatusChange: true,
  });

  const assetsData = AssetService.useGetAssetsRow(queryOptions, {
    onError: handleQueryError,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    skip: !showAssetList,
  });

  const usersData = CompanyService.useGetUsers(queryOptions, {
    onError: handleQueryError,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    skip: !showUserList,
  });

  const groupsData = CompanyService.useGetGroups({
    onError: handleQueryError,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    skip: !showGroupList,
  });

  const fleetsData = FleetService.useGetFleetsByTenantId(
    {
      tenantId: null, // will always select all fleets, below we will filter them based on the companyHierarchyTenantIds
    },
    {
      onError: handleQueryError,
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network',
      skip: !showFleetList,
    }
  );

  const filteredCompanies = useMemo(() => {
    const filteredAndSortedCompanies = (
      (companiesData.data?.getSubTenantsForTenant?.items ?? []) as Company[]
    )
      .filter((company: Company) => company.name?.toLowerCase().includes(searchText))
      .sort((a, b) => localeCompare(a.name, b.name));

    return filterRows(filteredAndSortedCompanies, selectedCompanyHierarchy);
  }, [companiesData.data?.getSubTenantsForTenant?.items, selectedCompanyHierarchy, searchText]);

  const companyParents = useMemo(
    () =>
      makeHierarchy(
        (companiesData.data?.getSubTenantsForTenant?.items ?? []) as Company[],
        selectedCompanyHierarchy,
        selectedCompanyHierarchy.type === 'COMPANY' ? selectedCompanyHierarchy.id : null
      ),
    [companiesData.data?.getSubTenantsForTenant?.items, selectedCompanyHierarchy]
  );

  const parentSet = getCompaniesParentSet(companyParents);

  let filteredCompanyParentsCount = 0;

  const filteredCompanyParents = companyParents
    .reduce<HierarchicalCompany[]>((prev, company) => {
      if (parentSet.has(company.id)) {
        if (company.name?.toLowerCase().includes(searchText)) {
          prev.push(company);
          filteredCompanyParentsCount += 1;
        }
      } else if (
        company.hierarchy
          .slice(0, company.hierarchy.length - 1)
          .some((companyName) => companyName.toLowerCase().includes(searchText))
      ) {
        prev.push(company);
      }

      return prev;
    }, [])
    .sort((a, b) => localeCompare(a.name, b.name));

  const filteredFleets = useMemo(() => {
    const fleets = (fleetsData.data?.getFleetsByTenantId ?? []).filter(({ fleet }) =>
      companyHierarchyTenantIds?.includes(fleet.tenantId)
    );

    return fleets
      .filter(({ fleet }: FleetRow) => fleet.name?.toLowerCase().includes(searchText))
      .sort((a, b) => localeCompare(a.fleet.name, b.fleet.name));
  }, [fleetsData.data?.getFleetsByTenantId, searchText, companyHierarchyTenantIds]);

  const filteredAssets = useMemo(
    () =>
      assetsData.data?.getAssets?.items
        ?.filter((asset: AssetGql) => asset.name?.toLowerCase().includes(searchText))
        .sort(({ name: nameA = '' }, { name: nameB = '' }) => localeCompare(nameA, nameB))
        // unfreeze items as they were frozen by apollo and aggrid need mutable items for inline edit
        .map((item) => ({ ...item })) ?? [],
    [assetsData, searchText]
  );

  const allUsers = useMemo(
    () =>
      [...(usersData.data?.getUsers?.items ?? [])].sort((a, b) =>
        sortArrayOfObjectsByStringField(a, b, 'fullName')
      ),
    [usersData.data?.getUsers?.items]
  );

  const filteredUsers = useMemo(
    () =>
      allUsers.filter(
        (user) =>
          user?.fullName?.toLowerCase().includes(searchText) || user?.email.toLowerCase().includes(searchText)
      ),
    [allUsers, searchText]
  );

  const knownGroups = useMemo(() => {
    const allUserGroups = allUsers.flatMap((user) =>
      user.groups ? user.groups.flatMap((el) => el.group.id) : []
    );

    return (groupsData.data?.getGroups ?? []).filter(
      (item) => allUserGroups.includes(item.id) && (companyHierarchyTenantIds ?? []).includes(item.tenantId)
    );
  }, [allUsers, groupsData.data?.getGroups, companyHierarchyTenantIds]);

  const filteredGroups = useMemo(
    () =>
      knownGroups
        .filter((group) => group?.name?.toLowerCase().includes(searchText))
        .sort((a, b) => localeCompare(a.name, b.name)),
    [knownGroups, searchText]
  );

  return {
    companies: {
      companies: filteredCompanies,
      isLoadingCompanies: companiesData.loading,
      networkStatusCompanies: companiesData.networkStatus,
    },
    parents: {
      companyParents: searchText ? filteredCompanyParents : companyParents,
      filteredCompanyParents,
      filteredCompanyParentsCount,
    },
    assets: {
      assets: filteredAssets,
      isLoadingAssets: assetsData.loading,
      networkStatusAssets: assetsData.networkStatus,
    },
    fleets: {
      fleets: filteredFleets,
      isLoadingFleets: fleetsData.loading,
      networkStatusFleets: fleetsData.networkStatus,
    },
    users: {
      users: filteredUsers,
      allUsers,
      isLoadingUsers: usersData.loading,
      networkStatusUsers: usersData.networkStatus,
    },
    groups: {
      groups: filteredGroups,
      isLoadingGroups: groupsData.loading,
      networkStatusGroups: groupsData.networkStatus,
    },
  };
};
