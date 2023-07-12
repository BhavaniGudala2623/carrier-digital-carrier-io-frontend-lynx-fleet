import { Maybe, TenantsHierarchyTenant } from '@carrier-io/lynx-fleet-types';

interface FilteredCompaniesByCarrierGlobal {
  tenantsWithoutCarrier: TenantsHierarchyTenant[];
  globalCarrierCompany: Maybe<TenantsHierarchyTenant>;
}

export const filterCompaniesByCarrierGlobal = (
  tenants: TenantsHierarchyTenant[]
): FilteredCompaniesByCarrierGlobal =>
  tenants.reduce(
    (acc: FilteredCompaniesByCarrierGlobal, item) => {
      if (!acc.globalCarrierCompany && item.isCarrierGlobal) {
        acc.globalCarrierCompany = item;
      } else {
        acc.tenantsWithoutCarrier.push(item);
      }

      return acc;
    },
    { tenantsWithoutCarrier: [], globalCarrierCompany: null }
  );
