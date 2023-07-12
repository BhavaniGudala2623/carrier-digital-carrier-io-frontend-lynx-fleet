import { TenantsHierarchyTenant } from '@carrier-io/lynx-fleet-types';

export const recursivelyGetTenantIdsFromTenants = (
  tenantId: string,
  tenants: TenantsHierarchyTenant[]
): string[] => [
  tenantId,
  ...tenants
    .filter((tenant) => tenant.parentId === tenantId)
    .flatMap((tenant) => recursivelyGetTenantIdsFromTenants(tenant.id, tenants)),
];
