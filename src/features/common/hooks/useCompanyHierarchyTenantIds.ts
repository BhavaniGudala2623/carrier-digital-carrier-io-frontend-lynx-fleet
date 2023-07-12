import { useMemo } from 'react';

import { getCompanyHierarchyTenantIds } from '../utils';

import { useAppSelector } from '@/stores';
import { getAuthTenantsHierarchy } from '@/features/authentication';
import { useApplicationContext } from '@/providers/ApplicationContext';

interface UseCompanyHierarchyTenantIdsResponse {
  companyHierarchyTenantIds?: string[];
}

export const useCompanyHierarchyTenantIds = (): UseCompanyHierarchyTenantIdsResponse => {
  const {
    applicationState: { selectedCompanyHierarchy },
  } = useApplicationContext();

  const tenantsHierarchy = useAppSelector(getAuthTenantsHierarchy);

  const companyHierarchyTenantIds = useMemo(
    () => getCompanyHierarchyTenantIds(selectedCompanyHierarchy, tenantsHierarchy),
    [selectedCompanyHierarchy, tenantsHierarchy]
  );

  return { companyHierarchyTenantIds };
};
