import { Maybe, TenantsHierarchy } from '@carrier-io/lynx-fleet-types';

import { getFleetTenantIds } from './getFleetTenantIds';

import type { SelectedCompanyHierarchy } from '@/providers/ApplicationContext';
import { recursivelyGetTenantIdsFromTenants } from '@/utils';

export const getCompanyHierarchyTenantIds = (
  companyHierarchy: SelectedCompanyHierarchy | undefined,
  tenantsHierarchy: Maybe<TenantsHierarchy>
): string[] | undefined => {
  if (!companyHierarchy || !tenantsHierarchy) {
    return undefined;
  }

  const { type, id } = companyHierarchy;
  const { tenants, fleets } = tenantsHierarchy;

  switch (type) {
    case 'ALL':
      return tenants.map((tenant) => tenant.id);

    case 'REGION':
      return tenants.filter((tenant) => tenant.contactRegion === id).map((tenant) => tenant.id);

    case 'COUNTRY':
      return tenants.filter((tenant) => tenant.contactCountry === id).map((tenant) => tenant.id);

    case 'COMPANY':
      // return the selected company and all its sub companies
      return recursivelyGetTenantIdsFromTenants(id, tenants);

    case 'FLEET':
      // return the selected fleet company and all its sub companies or sub fleets companies
      return getFleetTenantIds(id, fleets);

    default:
      return [];
  }
};
