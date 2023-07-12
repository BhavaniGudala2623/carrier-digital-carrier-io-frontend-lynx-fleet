import { ApolloError } from '@apollo/client';
import { useMemo } from 'react';
import { CompanyService } from '@carrier-io/lynx-fleet-data-lib';

import { useAppDispatch } from '@/stores';
import { showError } from '@/stores/actions';

export const useGetSubCompaniesInfo = (id: string) => {
  const dispatch = useAppDispatch();

  const { data, loading: isCheckingSubCompanies } = CompanyService.useGetSubCompaniesInfo(
    { tenantId: id },
    { onError: (error: ApolloError) => showError(dispatch, error) }
  );

  const subCompanies = data?.getSubTenantsForTenant.items;

  const hasSubCompaniesWithUsersOrAssets = useMemo(
    () =>
      subCompanies ? subCompanies.some(({ userCount, assetCount }) => userCount > 0 || assetCount > 0) : [],
    [subCompanies]
  );

  return {
    hasSubCompaniesWithUsersOrAssets,
    isCheckingSubCompanies,
  };
};
